import { MongoClient } from 'mongodb'
import fetchRss from './fetchRss.js'
import analyzeText from './textAnalysis.js'

export async function buildData(rssFeedUrl) {
  console.log('Connecting to MongoDB...')
  // Connect to MongoDB
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  console.log('Connected to MongoDB.')

  // Get a reference to the collection where you'll store the data
  const collection = client.db(process.env.MONGODB_DB).collection('episodes')

  console.log('Fetching RSS feed...')
  const episodes = await fetchRss(rssFeedUrl)
  console.log('Fetched RSS feed.')

  for (const episode of episodes) {
    // Use the episode guid as the key
    const key = `episode:${episode.guid}`

    // Check if a document with this guid already exists
    const existingEpisode = await collection.findOne({ guid: episode.guid })
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
      mediaList: parsedMediaList // Assign parsed mediaList back to property
    }

    // Store the episode data in MongoDB
    console.log(`Storing data for episode ${key} in MongoDB...`)
    await collection.insertOne(episodeData)
    console.log(`Stored data for episode ${key} in MongoDB.`)

    // Wait for 1 second before the next iteration
    await new Promise(resolve => setTimeout(resolve, 3000))
  }

  // Close the connection to MongoDB
  console.log('Closing connection to MongoDB...')
  await client.close()
  console.log('Closed connection to MongoDB.')
}

buildData('http://feeds.libsyn.com/474285/rss')
