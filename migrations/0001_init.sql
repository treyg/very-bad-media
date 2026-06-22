-- Very Bad Media — initial D1 schema
-- episodes: one row per podcast episode
-- media_items: normalized media references extracted from each episode

CREATE TABLE IF NOT EXISTS episodes (
  guid       TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  link       TEXT,
  pub_date   TEXT NOT NULL,        -- ISO 8601 timestamp
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS media_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  episode_guid TEXT NOT NULL REFERENCES episodes(guid) ON DELETE CASCADE,
  media_type   TEXT NOT NULL,      -- movies | tvshows | books | shortstories | articles | essays
  title        TEXT NOT NULL,
  creator      TEXT,               -- unified author/director (nullable)
  link         TEXT
);

CREATE INDEX IF NOT EXISTS idx_media_type    ON media_items(media_type);
CREATE INDEX IF NOT EXISTS idx_media_episode ON media_items(episode_guid);
CREATE INDEX IF NOT EXISTS idx_episodes_date ON episodes(pub_date);
