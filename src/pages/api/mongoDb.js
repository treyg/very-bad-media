import { MongoClient } from 'mongodb'

export async function connectToDb() {
  console.log('Connecting to MongoDB...')
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  console.log('Connected to MongoDB.')

  const collection = client.db(process.env.MONGODB_DB).collection('episodesGPT4')
  return { client, collection }
}

export async function checkExistingEpisode(collection, guid) {
  return await collection.findOne({ guid: guid })
}

export async function insertEpisodeData(collection, episodeData) {
  console.log(`Storing data for episode ${episodeData.guid} in MongoDB...`)
  await collection.insertOne(episodeData)
  console.log(`Stored data for episode ${episodeData.guid} in MongoDB.`)
}

export async function closeDbConnection(client) {
  console.log('Closing connection to MongoDB...')
  await client.close()
  console.log('Closed connection to MongoDB.')
}
