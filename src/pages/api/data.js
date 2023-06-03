import { MongoClient } from 'mongodb'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Connect to MongoDB
      const client = new MongoClient(process.env.MONGODB_URI)
      await client.connect()

      // Get a reference to the collection where you're storing the data
      const collection = client.db(process.env.MONGODB_DB).collection('episodes')

      // Fetch all documents from the collection
      const episodesData = await collection.find().toArray()

      // Close the connection to MongoDB
      await client.close()

      res.json(episodesData)
    } catch (error) {
      console.error('An error occurred:', error)
      res.status(500).json({ message: 'An error occurred', error: error.toString() })
    }
  } else {
    res.status(404).end()
  }
}
