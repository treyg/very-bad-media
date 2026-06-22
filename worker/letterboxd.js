// Fetch + parse a Letterboxd user's RSS feed (replaces the old /api/letterboxd
// Next route). Dependency-free; returns raw description HTML for the frontend
// to sanitize with DOMPurify.

const ITEM_RE = /<item>([\s\S]*?)<\/item>/g;

function stripCdata(value) {
  if (value == null) return "";
  return value
    .replace(/^\s*<!\[CDATA\[/, "")
    .replace(/\]\]>\s*$/, "")
    .trim();
}

function pick(xml, tag) {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? stripCdata(m[1]) : "";
}

export async function fetchLetterboxd(username) {
  const res = await fetch(`https://letterboxd.com/${username}/rss/`, {
    headers: { "user-agent": "very-bad-media/1.0" },
  });
  if (!res.ok) throw new Error(`Letterboxd fetch failed: ${res.status}`);
  const xml = await res.text();

  const entries = [];
  for (const match of xml.matchAll(ITEM_RE)) {
    const item = match[1];
    entries.push({
      title: pick(item, "title"),
      link: pick(item, "link"),
      pubDate: pick(item, "pubDate"),
      description: pick(item, "description"),
    });
  }
  return entries;
}
