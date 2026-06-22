// Very Bad Media — data pipeline Worker.
//
// Runs daily (cron trigger) and on-demand (guarded fetch handler):
//   1. fetch + parse the libsyn RSS feed (env.RSS_URL, env.LOOKBACK_DAYS)
//   2. diff against episodes already in D1 (env.DB)
//   3. extract media references via OpenRouter (env.OPENROUTER_MODEL/KEY)
//   4. insert new episodes + media_items into D1

import { fetchEpisodes } from "./rss.js";
import { extractMedia } from "./openrouter.js";
import { getExistingGuids, insertEpisode, getAllEpisodes } from "./db.js";
import { fetchLetterboxd } from "./letterboxd.js";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "Content-Type",
};

export async function buildData(env, { log = console.log, lookbackDays, model } = {}) {
  const days = Number(lookbackDays ?? env.LOOKBACK_DAYS ?? 30);
  const activeModel = model || env.OPENROUTER_MODEL;
  const episodes = await fetchEpisodes(env.RSS_URL, days);
  log(`Fetched ${episodes.length} episodes within ${days} days (model: ${activeModel}).`);

  const existing = await getExistingGuids(env.DB);
  const newEpisodes = episodes.filter((e) => !existing.has(e.guid));
  log(`${newEpisodes.length} new episode(s) to process.`);

  const summary = { processed: 0, skipped: existing.size, errors: 0, mediaInserted: 0 };

  // Sequential on purpose: stays well under model rate limits and D1 write
  // concurrency, and one failure shouldn't abort the rest of the batch.
  for (const episode of newEpisodes) {
    try {
      log(`Analyzing "${episode.title}"...`);
      const media = await extractMedia(episode, env, activeModel);
      const count = await insertEpisode(env.DB, episode, media);
      summary.processed++;
      summary.mediaInserted += count;
      log(`Stored "${episode.title}" (${count} media items).`);
    } catch (err) {
      summary.errors++;
      console.error(`Failed on "${episode.title}" (${episode.guid}):`, err);
    }
  }

  log(`Build complete: ${JSON.stringify(summary)}`);
  return summary;
}

export default {
  // Cron-triggered daily build.
  async scheduled(event, env, ctx) {
    ctx.waitUntil(buildData(env));
  },

  async fetch(req, env, ctx) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // Public read endpoint — Tamler's Letterboxd reviews.
    if (req.method === "GET" && url.pathname === "/api/letterboxd") {
      try {
        const entries = await fetchLetterboxd(env.LETTERBOXD_USER || "tamler");
        return Response.json(entries, {
          headers: { ...CORS, "cache-control": "public, max-age=300, s-maxage=3600" },
        });
      } catch (err) {
        console.error("letterboxd failed:", err);
        return Response.json({ error: "Failed to fetch Letterboxd" }, { status: 500, headers: CORS });
      }
    }

    // Public read endpoint — full catalog as JSON for the frontend.
    if (req.method === "GET" && url.pathname === "/api/episodes") {
      try {
        const episodes = await getAllEpisodes(env.DB);
        return Response.json(episodes, {
          headers: {
            ...CORS,
            // Cache at the edge; the data only changes once a day.
            "cache-control": "public, max-age=300, s-maxage=3600",
          },
        });
      } catch (err) {
        console.error("read failed:", err);
        return Response.json({ error: "Failed to read episodes" }, { status: 500, headers: CORS });
      }
    }

    // Manual rebuild for development — guarded by CRON_SECRET.
    // Optional query params override one run:
    //   ?days=N      lookback window (e.g. ?days=100000 for a full backfill)
    //   ?model=...   OpenRouter model (e.g. ?model=google/gemini-2.5-flash)
    const auth = req.headers.get("authorization");
    if (!env.CRON_SECRET || auth !== `Bearer ${env.CRON_SECRET}`) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
      const daysParam = url.searchParams.get("days");
      const lookbackDays = daysParam != null ? Number(daysParam) : undefined;
      const model = url.searchParams.get("model") || undefined;
      const summary = await buildData(env, { lookbackDays, model });
      return Response.json({ success: true, summary });
    } catch (err) {
      console.error("buildData failed:", err);
      return Response.json(
        { success: false, error: String(err?.message || err) },
        { status: 500 }
      );
    }
  },
};
