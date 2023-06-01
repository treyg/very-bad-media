import { useRouter } from 'next/router'
import { Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react'

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, options)
}

const typeFixes = {
  movies: 'Movie',
  tvshows: 'TV Show',
  books: 'Book',
  articles: 'Article',
  essays: 'Essay',
  shortStories: 'Short Story'
}

function fixType(type) {
  return typeFixes[type] || type
}

const MediaTable = ({ episodes, mediaTypes }) => {
  const data = episodes
    ? episodes
        .map(episode =>
          mediaTypes.map(type => ({
            episodeTitle: episode.episode,
            episodeLink: episode.link,
            episodeDate: formatDate(episode.pubDate),
            mediaType: type, // Use 'type' instead of 'mediaType'
            media: episode.mediaList[type] || [] // Access mediaList[type] and provide an empty array as a fallback
          }))
        )
        .reduce((acc, val) => acc.concat(val), [])
    : []

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Type</Th>
          <Th>Author</Th>
          <Th>Date</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item, index) =>
          item.media.map((mediaItem, mIndex) => (
            <Tr key={`${index}-${mIndex}`} className={index % 2 === 0 ? 'active' : ''}>
              <Td>
                <Text fontSize="md" fontWeight="bold">
                  {typeof mediaItem === 'string' ? mediaItem : mediaItem.title}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  <a href={item.episodeLink}>{item.episodeTitle}</a>
                </Text>
              </Td>
              <Td>
                <Text fontSize="md">{fixType(item.mediaType)}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{mediaItem.author || mediaItem.director || ''}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">{item.episodeDate}</Text>
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  )
}

export default MediaTable
