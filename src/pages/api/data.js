import { kv } from '@vercel/kv'
import { Response } from 'node-fetch'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch all keys from the KV store
      const keys = await kv.keys('episode:*')

      // Fetch the data for each key
      const episodesData = []
      for (const key of keys) {
        const episodeData = await kv.get(key)
        episodesData.push(episodeData)
      }

      res.json(episodesData)
    } catch (error) {
      console.error(error)
      res.status(500).end()
    }
  } else {
    res.status(404).end()
  }
}
