import { useState } from 'react'
import SkeletonTable from '@/components/SkeletonTable'
import { Table, Thead, Tbody, Tr, Th, Td, Text, Box, Skeleton } from '@chakra-ui/react'

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
  //   if (isLoading) {
  //     return <SkeletonTable />
  //   }

  const [sortField, setSortField] = useState(null)
  const [sortDirection, setSortDirection] = useState(null)

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

  // Sort data
  if (sortField !== null) {
    data.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  const handleSort = field => {
    setSortField(field)
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple" minWidth="100%">
        <Thead>
          <Tr>
            <Th cursor={'pointer'} onClick={() => handleSort('episodeTitle')}>
              Title
            </Th>
            <Th cursor={'pointer'} onClick={() => handleSort('mediaType')}>
              Type
            </Th>
            <Th cursor={'pointer'} onClick={() => handleSort('author')}>
              Author
            </Th>
            <Th cursor={'pointer'} onClick={() => handleSort('episodeDate')}>
              Date
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) =>
            item.media.map((mediaItem, mIndex) => (
              <Tr key={`${index}-${mIndex}`} className={index % 2 === 0 ? 'active' : ''}>
                <Td>
                  <Text fontSize="md" fontWeight="bold">
                    <a href={mediaItem.link ? mediaItem.link : '#'}>{mediaItem.title}</a>
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    <a href={item.episodeLink}>{item.episodeTitle}</a>
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="md">{fixType(item.mediaType)}</Text>
                </Td>
                <Td>
                  <Text fontSize="sm">
                    {mediaItem.author || mediaItem.director || ''}
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="sm">{item.episodeDate}</Text>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  )
}

export default MediaTable
