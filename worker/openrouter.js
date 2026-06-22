// Media extraction via OpenRouter (OpenAI-compatible chat completions).
// Swap models freely with env.OPENROUTER_MODEL — same prompt, same parsing.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const MEDIA_TYPES = [
  "movies",
  "tvshows",
  "books",
  "shortstories",
  "articles",
  "essays",
];

const SYSTEM_PROMPT = `You parse podcast show notes and identify references to movies/films, TV shows, books, short stories, articles, and essays. Organize them into the provided JSON schema.

Rules:
- Put every reference in exactly one category. If unsure whether something is an article or an essay, use "articles".
- "creator" is the director (for movies/TV shows) or the author (for books, short stories, essays, articles). If a book's author isn't stated but you know it, include it. Use an empty string "" when there is no sensible creator.
- "link": for movies use a letterboxd.com URL; for articles use the URL found in the show notes; otherwise use an empty string "".
- Only include real references. Return empty arrays for categories with none.`;

// Structured Outputs schema — constrains decoding so the model cannot emit
// anything but this exact shape. All keys required + additionalProperties:false
// is what `strict` mode demands across providers.
const itemSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    creator: { type: "string" },
    link: { type: "string" },
  },
  required: ["title", "creator", "link"],
  additionalProperties: false,
};

const MEDIA_SCHEMA = {
  type: "object",
  properties: Object.fromEntries(
    MEDIA_TYPES.map((t) => [t, { type: "array", items: itemSchema }])
  ),
  required: MEDIA_TYPES,
  additionalProperties: false,
};

function stripFences(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

// Fallback parser for any model/provider that ignores structured outputs.
function parseModelJson(content) {
  const cleaned = stripFences(content);
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("Model did not return parseable JSON");
  }
}

// Normalize into a clean { type: [{title, creator, link}] } shape for D1,
// dropping empties. Falls back to author/director if a model still sends them.
function normalize(raw) {
  const out = {};
  for (const type of MEDIA_TYPES) {
    const items = raw?.[type];
    if (!Array.isArray(items)) continue;
    const cleaned = items
      .filter((it) => it && typeof it.title === "string" && it.title.trim())
      .map((it) => ({
        title: it.title.trim(),
        creator: (it.creator || it.author || it.director || "").trim() || null,
        link: (it.link || "").trim() || null,
      }));
    if (cleaned.length) out[type] = cleaned;
  }
  return out;
}

/**
 * Extract media references from an episode's text.
 * Returns { movies: [...], books: [...], ... } (only non-empty categories).
 */
export async function extractMedia(episode, env, model = env.OPENROUTER_MODEL) {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "content-type": "application/json",
      // Optional OpenRouter attribution headers:
      "http-referer": "https://verybadmedia.com",
      "x-title": "Very Bad Media",
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 3000,
      // Force the exact output shape; only route to providers that support it.
      response_format: {
        type: "json_schema",
        json_schema: { name: "media_references", strict: true, schema: MEDIA_SCHEMA },
      },
      provider: { require_parameters: true },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Episode title: ${episode.title}\nEpisode link: ${episode.link}\n\nShow notes:\n${episode.content}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${body.slice(0, 500)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter returned no message content");

  return normalize(parseModelJson(content));
}
