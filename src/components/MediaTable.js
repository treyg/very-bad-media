import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, options)
}

const MediaTable = () => {
  const router = useRouter()
  const { mediaType } = router.query // get mediaType from the router query
  const [episodes, setEpisodes] = useState([])

  useEffect(() => {
    async function fetchMediaData() {
      const response = await fetch(`http://localhost:3000/api/data`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const media = await response.json()
      setEpisodes(media)
    }

    fetchMediaData()
  }, [])

  console.log(episodes)

  const data = episodes.map(episode => ({
    episodeTitle: episode.episode,
    episodeLink: episode.link,
    episodeDate: formatDate(episode.pubDate),
    media: episode.mediaList[mediaType] || [] // Access mediaList[mediaType] and provide an empty array as a fallback
  }))

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) =>
            item.media.map((mediaItem, mIndex) => (
              <tr key={`${index}-${mIndex}`} className={index % 2 === 0 ? 'active' : ''}>
                <td>
                  {mediaItem.title}
                  <br />
                  <a href={item.episodeLink} className="text-sm">
                    {item.episodeTitle}
                  </a>
                </td>
                <td>{mediaItem.author || mediaItem.director}</td>
                <td>{item.episodeDate}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default MediaTable
