// Dependency-free RSS parsing for the Very Bad Wizards libsyn feed.
// The feed is simple, stable RSS 2.0 with CDATA-wrapped fields, so a focused
// extractor avoids pulling Node-only XML libraries into the Workers runtime.

const ITEM_RE = /<item>([\s\S]*?)<\/item>/g;

function stripCdata(value) {
  if (value == null) return "";
  return value
    .replace(/^\s*<!\[CDATA\[/, "")
    .replace(/\]\]>\s*$/, "")
    .trim();
}

function pick(xml, tag) {
  // Matches <tag ...>...</tag> (e.g. content:encoded, guid isPermaLink="false").
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? stripCdata(m[1]) : "";
}

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&[a-z]+;/gi, (m) => ENTITIES[m] ?? m);
}

// Convert the HTML content:encoded body into a compact, model-friendly text
// payload: keep anchor text plus the real URL, drop other markup.
function htmlToText(html) {
  if (!html) return "";
  return decodeEntities(
    html
      // <a href="URL">label</a> -> "label (URL)"
      .replace(
        /<a\b[^>]*?href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
        (_, href, label) => `${label.replace(/<[^>]+>/g, "").trim()} (${href.trim()})`
      )
      .replace(/<\/(p|div|li|h[1-6]|br)\s*>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Fetch and parse the feed, returning episodes published within `lookbackDays`.
 * Each episode: { guid, title, link, pubDate (ISO), content (plain text) }.
 */
export async function fetchEpisodes(rssUrl, lookbackDays) {
  const res = await fetch(rssUrl, {
    headers: { "user-agent": "very-bad-media-pipeline/1.0" },
  });
  if (!res.ok) {
    throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();

  const cutoff = Date.now() - lookbackDays * 24 * 60 * 60 * 1000;
  const episodes = [];

  for (const match of xml.matchAll(ITEM_RE)) {
    const itemXml = match[1];

    const guid = pick(itemXml, "guid");
    const title = pick(itemXml, "title");
    const link = pick(itemXml, "link");
    const pubDateRaw = pick(itemXml, "pubDate");
    const rawContent = pick(itemXml, "content:encoded") || pick(itemXml, "description");

    if (!guid || !title) continue;

    const pubMs = Date.parse(pubDateRaw);
    if (Number.isNaN(pubMs) || pubMs < cutoff) continue;

    episodes.push({
      guid,
      title: decodeEntities(title),
      link,
      pubDate: new Date(pubMs).toISOString(),
      content: htmlToText(rawContent),
    });
  }

  return episodes;
}
