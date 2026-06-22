// D1 access helpers for the pipeline.

import { MEDIA_TYPES } from "./openrouter.js";

/**
 * Read the whole catalog grouped by episode, newest first.
 * Returns episodes shaped for the frontend:
 *   { guid, episode, link, pubDate, mediaList: { <type>: [{ title, creator, link }] } }
 */
export async function getAllEpisodes(db) {
  const { results } = await db
    .prepare(
      `SELECT e.guid, e.title AS episode, e.link, e.pub_date AS pubDate,
              m.media_type, m.title AS media_title, m.creator, m.link AS media_link
         FROM episodes e
         LEFT JOIN media_items m ON m.episode_guid = e.guid
        ORDER BY e.pub_date DESC, m.id ASC`
    )
    .all();

  const byGuid = new Map();
  for (const row of results || []) {
    let ep = byGuid.get(row.guid);
    if (!ep) {
      ep = {
        guid: row.guid,
        episode: row.episode,
        link: row.link,
        pubDate: row.pubDate,
        mediaList: {},
      };
      for (const type of MEDIA_TYPES) ep.mediaList[type] = [];
      byGuid.set(row.guid, ep);
    }
    if (row.media_type) {
      (ep.mediaList[row.media_type] ||= []).push({
        title: row.media_title,
        creator: row.creator,
        link: row.media_link,
      });
    }
  }

  return [...byGuid.values()];
}

/** Returns a Set of guids already stored, for fast diffing against the feed. */
export async function getExistingGuids(db) {
  const { results } = await db.prepare("SELECT guid FROM episodes").all();
  return new Set((results || []).map((r) => r.guid));
}

/**
 * Insert one episode plus its media items atomically via a batched write.
 * `mediaByType` is { type: [{ title, creator, link }] }.
 */
export async function insertEpisode(db, episode, mediaByType) {
  const statements = [
    db
      .prepare(
        "INSERT OR IGNORE INTO episodes (guid, title, link, pub_date) VALUES (?, ?, ?, ?)"
      )
      .bind(episode.guid, episode.title, episode.link || null, episode.pubDate),
  ];

  const insertMedia = db.prepare(
    "INSERT INTO media_items (episode_guid, media_type, title, creator, link) VALUES (?, ?, ?, ?, ?)"
  );

  let mediaCount = 0;
  for (const [type, items] of Object.entries(mediaByType)) {
    for (const item of items) {
      statements.push(
        insertMedia.bind(episode.guid, type, item.title, item.creator, item.link)
      );
      mediaCount++;
    }
  }

  await db.batch(statements);
  return mediaCount;
}
