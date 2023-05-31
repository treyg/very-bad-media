import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react'

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, options)
}

const MediaTable = ({ mediaType }) => {
  const router = useRouter()
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

  const data = episodes.map(episode => ({
    episodeTitle: episode.episode,
    episodeLink: episode.link,
    episodeDate: formatDate(episode.pubDate),
    media: episode.mediaList[mediaType] || [] // Access mediaList[mediaType] and provide an empty array as a fallback
  }))

  return (
    <div className="overflow-x-auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Author</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) =>
            item.media.map((mediaItem, mIndex) => (
              <Tr key={`${index}-${mIndex}`} className={index % 2 === 0 ? 'active' : ''}>
                <Td>
                  {mediaItem.title}
                  <br />
                  <a href={item.episodeLink} className="text-sm">
                    {item.episodeTitle}
                  </a>
                </Td>
                <Td>{mediaItem.author || mediaItem.director}</Td>
                <Td>{item.episodeDate}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </div>
  )
}

export default MediaTable
