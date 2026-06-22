# Very Bad Media

A fan-built site presenting media discussed on the [Very Bad Wizards](https://verybadwizards.com/) podcast.

## Architecture

Two pieces, both on Cloudflare:

1. **Data pipeline Worker** (`worker/`) — a Cloudflare Worker that, on a daily cron
   trigger, fetches the podcast RSS feed, extracts media references via
   [OpenRouter](https://openrouter.ai/), and stores them in **Cloudflare D1**.
   It also serves a small public read API:
   - `GET /api/episodes` — full catalog as JSON
   - `GET /api/letterboxd` — Tamler's Letterboxd reviews
   - Guarded build trigger (manual rebuild) — `Authorization: Bearer $CRON_SECRET`,
     optional `?days=N` to override the lookback window (e.g. a full backfill).

2. **Frontend** (`src/`) — a Next.js static export ([Chakra UI](https://chakra-ui.com/))
   that fetches the read API client-side. Deploys as plain static assets.

## Configuration

### Worker (`wrangler.jsonc`)

Non-secret vars live in `wrangler.jsonc` (`RSS_URL`, `OPENROUTER_MODEL`,
`LOOKBACK_DAYS`, `LETTERBOXD_USER`). The D1 binding is `DB`.
