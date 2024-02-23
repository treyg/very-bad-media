import fetchRss from "./fetchRss.js";
import analyzeText from "./textAnalysis.js";
import {
  connectToDb,
  checkExistingEpisode,
  insertEpisodeData,
  closeDbConnection,
} from "./mongoDb.js";

export async function buildData(rssFeedUrl) {
  const { client, collection } = await connectToDb();

  const episodes = await fetchRss(
    rssFeedUrl,
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  console.log("Fetched RSS feed.");

  const episodePromises = episodes.map(async (episode) => {
    const key = `episode:${episode.guid}`;

    const existingEpisode = await checkExistingEpisode(
      collection,
      episode.guid
    );
    if (existingEpisode) {
      console.log(`Episode ${key} already exists in MongoDB, skipping...`);
      return;
    }

    console.log(`Analyzing text for episode ${key}...`);
    const content = `${episode.content} ${episode.links.join("")}`
      .split("\n")
      .map((line) => line.replace(/""/g, '"'))
      .join("\n");
    let mediaList;
    try {
      mediaList = await analyzeText(content);
    } catch (error) {
      console.error(`Error parsing YAML for episode ${key}: ${error}`);
      return;
    }
    let parsedMediaList;
    try {
      parsedMediaList = JSON.parse(mediaList);
    } catch (error) {
      console.error(`Error parsing JSON for episode ${key}: ${error}`);
      return;
    }

    const episodeData = {
      episode: episode.title,
      link: episode.link,
      guid: episode.guid,
      pubDate: episode.pubDate,
      mediaList: parsedMediaList,
    };

    await insertEpisodeData(collection, episodeData);
  });

  await Promise.all(episodePromises);

  await closeDbConnection(client);
}

//buildData('http://feeds.libsyn.com/474285/rss')

export default async function handler(req, res) {
  try {
    await buildData("http://feeds.libsyn.com/474285/rss");

    res.status(200).json({ message: "Data build successful" });
  } catch (error) {
    console.error("Error in buildData:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
