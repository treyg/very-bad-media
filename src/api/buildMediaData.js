const fetch = require('node-fetch')
const fetchRss = require('./fetchRss')
const analyzeText = require('./textAnalysis')
const storeDataInKV = require('./storeData')

require('dotenv').config({ path: '../../.env.development.local' })

// const KV = require('@vercel/kv')

// // Extract the KV namespace ID from the KV_URL
// // const kvNamespaceId = process.env.KV_URL.split('@')[1].split('.')[0]

// // // Create an instance of your KV store
// // const kv = new KV({
// //   id: kvNamespaceId,
// //   token: process.env.KV_REST_API_TOKEN
// // })

async function buildData(rssFeedUrl) {
  const episodes = await fetchRss(rssFeedUrl)

  for (const episode of episodes) {
    // Use the episode guid as the key
    const key = `episode:${episode.guid}`

    // Fetch the value of the key from the KV store
    const response = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`
      }
    })

    const value = await response.json()

    // Check if the key exists in the KV store
    if (value.result !== null && value !== undefined) {
      console.log(
        `Episode ${episode.title} already exists in KV store, skipping text analysis`
      )
      continue
    }

    const mediaList = await analyzeText(
      `${episode.contentSnippet} ${episode.links.join('')}`
    )
    //console.log('mediaList:', mediaList)
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

;(async () => {
  try {
    const rssFeedUrl = 'http://feeds.libsyn.com/474285/rss'
    const result = await buildData(rssFeedUrl)
    //console.log(result)
    return result
  } catch (error) {
    console.error(error)
  }
})()

async function logAllData() {
  const { KV_REST_API_URL, KV_REST_API_TOKEN } = process.env

  try {
    // Fetch all keys from the KV store
    const keysResponse = await fetch(`${KV_REST_API_URL}/keys/*`, {
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`
      }
    })

    console.log(
      `Response status: ${keysResponse.status}, status text: ${keysResponse.statusText}`
    )

    const keys = await keysResponse.json()

    console.log(`Response: ${JSON.stringify(keys)}`)

    // Fetch the value of each key
    for (const key of keys.result) {
      const valueResponse = await fetch(`${KV_REST_API_URL}/get/${key}`, {
        headers: {
          Authorization: `Bearer ${KV_REST_API_TOKEN}`
        }
      })
      const value = await valueResponse.json()

      console.log(value)
    }
  } catch (error) {
    console.error(`Error fetching data from KV: ${error}`)
  }
}

//logAllData()
