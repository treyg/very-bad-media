import fetchRss from './fetchRss.js'
import analyzeText from './textAnalysis.js'
import storeDataInKV from './storeData.js'
import fetch from 'node-fetch'

import dotenv from 'dotenv'
dotenv.config({
  path: '../../../.env.development.local'
})

export async function buildData(rssFeedUrl) {
  const episodes = await fetchRss(rssFeedUrl)

  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env

  for (const episode of episodes) {
    // Use the episode guid as the key
    const key = `episode:${episode.guid}`

    //fetch all of the data in the store
    const keysResponse = await fetch(`${KV_REST_API_URL}/keys/*`, {
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`
      }
    })
    const keysData = await keysResponse.json()
    const keys = keysData.result
    //console.log(keys)

    // Check if the key already exists in the KV store
    if (keys.includes(key)) {
      console.log(`${key} already exists in KV store, skipping...`)
      continue
    }

    const mediaList = await analyzeText(`${episode.content} ${episode.links.join('')}`)
    //console.log(mediaList)
    const parsedMediaList = JSON.parse(mediaList) // Parse mediaList string

    const episodeData = {
      episode: episode.title,
      link: episode.link,
      guid: episode.guid,
      pubDate: episode.pubDate,
      mediaList: parsedMediaList // Assign parsed mediaList back to property
    }

    // Store the episode data in the KV store
    await storeDataInKV(key, episodeData)

    // Wait for 1 second before the next iteration
    await new Promise(resolve => setTimeout(resolve, 3000))
  }
}

buildData('http://feeds.libsyn.com/474285/rss')
