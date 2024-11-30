import { parseStringPromise } from 'xml2js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const username = 'tamler'
    const feedUrl = `https://letterboxd.com/${username}/rss/`

    const response = await fetch(feedUrl)
    
    if (!response.ok) {
      throw new Error('Failed to fetch Letterboxd RSS feed')
    }

    const xmlData = await response.text()
    const result = await parseStringPromise(xmlData, {
      explicitArray: false,
      ignoreAttrs: true
    })

    const items = result.rss?.channel?.item || []
    const entries = Array.isArray(items) ? items : [items]

    const formattedEntries = entries
      .filter(item => item)
      .map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description
      }))

    res.status(200).json(formattedEntries)
  } catch (error) {
    console.error('Error fetching Letterboxd data:', error)
    res.status(500).json({ 
      message: 'Failed to fetch Letterboxd data',
      error: error.message 
    })
  }
}
