// Fetch + parse a Letterboxd user's RSS feed (replaces the old /api/letterboxd
// Next route). Extracts the structured letterboxd:* fields plus the poster and
// review text so the frontend can render a compact, informative card.

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
    const description = pick(item, "description");

    // First <img> in the description is the film poster.
    const posterMatch = description.match(/<img[^>]+src="([^"]+)"/i);
    const poster = posterMatch ? posterMatch[1] : null;

    // Review = description minus the poster image, leftover empty tags trimmed.
    const review = description
      .replace(/<img[^>]*>/gi, "")
      .replace(/<p>\s*<\/p>/gi, "")
      .trim();

    const ratingRaw = pick(item, "letterboxd:memberRating");
    const rating = ratingRaw ? Number(ratingRaw) : null;

    entries.push({
      filmTitle: pick(item, "letterboxd:filmTitle") || pick(item, "title"),
      filmYear: pick(item, "letterboxd:filmYear") || null,
      rating: Number.isFinite(rating) ? rating : null,
      rewatch: pick(item, "letterboxd:rewatch").toLowerCase() === "yes",
      watchedDate: pick(item, "letterboxd:watchedDate") || null,
      link: pick(item, "link"),
      pubDate: pick(item, "pubDate"),
      poster,
      review,
    });
  }
  return entries;
}
