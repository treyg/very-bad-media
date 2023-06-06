import fetchRss from './fetchRss.js'
import analyzeText from './textAnalysis.js'
import {
  connectToDb,
  checkExistingEpisode,
  insertEpisodeData,
  closeDbConnection
} from './mongoDb.js'

export async function buildData(rssFeedUrl) {
  const { client, collection } = await connectToDb()

  console.log('Fetching RSS feed...')
  const episodes = await fetchRss(rssFeedUrl)
  console.log('Fetched RSS feed.')

  for (const episode of episodes) {
    // Use the episode guid as the key
    const key = `episode:${episode.guid}`

    const existingEpisode = await checkExistingEpisode(collection, episode.guid)
    if (existingEpisode) {
      console.log(`Episode ${key} already exists in MongoDB, skipping...`)
      continue
    }

    console.log(`Analyzing text for episode ${key}...`)
    const content = `${episode.content} ${episode.links.join('')}`
      .split('\n')
      .map(line => line.replace(/""/g, '"'))
      .join('\n')
    let mediaList
    try {
      mediaList = await analyzeText(content)
    } catch (error) {
      console.error(`Error parsing YAML for episode ${key}: ${error}`)
      continue
    }
    let parsedMediaList
    try {
      parsedMediaList = JSON.parse(mediaList)
    } catch (error) {
      console.error(`Error parsing JSON for episode ${key}: ${error}`)
      continue
    }

    const episodeData = {
      episode: episode.title,
      link: episode.link,
      guid: episode.guid,
      pubDate: episode.pubDate,
      mediaList: parsedMediaList
    }

    await insertEpisodeData(collection, episodeData)

    // Wait for 1 second before the next iteration
    await new Promise(resolve => setTimeout(resolve, 3000))
  }

  await closeDbConnection(client)
}

buildData('http://feeds.libsyn.com/474285/rss')
