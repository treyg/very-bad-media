import RSSParser from 'rss-parser'

async function fetchRss(rssFeedUrl) {
  console.log('Fetching RSS feed...')
  try {
    const parser = new RSSParser()
    const feed = await parser.parseURL(rssFeedUrl)

    const episodes = feed.items.map(item => {
      const linksStart = item.contentSnippet.indexOf('Links:\n')
      let contentLinks = []

      if (linksStart !== -1) {
        const linksText = item.contentSnippet.slice(linksStart + 'Links:\n'.length)
        contentLinks = linksText.split('\n').filter(link => link.trim() !== '')
      }

      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        content: item.content,
        contentSnippet: item.contentSnippet,
        links: contentLinks,
        guid: item.guid
      }
    })

    console.log('RSS feed fetched successfully!')

    return episodes
  } catch (error) {
    console.log(error)
    throw new Error('Error fetching RSS feed')
  }
}

export default fetchRss
