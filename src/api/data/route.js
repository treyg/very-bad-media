import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function GET() {
  // Fetch all keys from the KV store
  const keys = await kv.keys('episode:*')

  // Fetch the data for each key
  const episodesData = []
  for (const key of keys) {
    const episodeData = await kv.get(key)
    episodesData.push(episodeData)
  }

  return NextResponse.json(episodesData)
}
