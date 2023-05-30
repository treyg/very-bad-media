import fetchRss from './fetchRss'
import analyzeText from './textAnalysis'
import storeDataInKV from './storeData'

export async function buildData(rssFeedUrl) {
  const episodes = await fetchRss(rssFeedUrl)

  for (const episode of episodes) {
    // Use the episode guid as the key
    const key = `episode:${episode.guid}`

    // Fetch the value of the key from the KV store
    const response = await fetch(`/api/getKV?key=${encodeURIComponent(key)}`)
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
