import { useState, useEffect } from 'react'
import { Input } from '@chakra-ui/react'
import SkeletonTable from '@/components/SkeletonTable'
import { Table, Thead, Tbody, Tr, Th, Td, Text, Box, Skeleton } from '@chakra-ui/react'
import { format } from 'date-fns'

function formatDate(dateString) {
  return format(new Date(dateString), 'MM/dd/yy')
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
  const [sortField, setSortField] = useState(null)
  const [sortDirection, setSortDirection] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const data = episodes
    ? episodes
        .map(episode =>
          mediaTypes.map(type => ({
            episodeTitle: episode.episode,
            episodeLink: episode.link,
            episodeDate: formatDate(episode.pubDate),
            mediaType: type,
            media: episode.mediaList[type] || []
          }))
        )
        .reduce((acc, val) => acc.concat(val), [])
        .filter(item => {
          return item.media.some(
            mediaItem =>
              mediaItem.title &&
              mediaItem.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          )
        })
    : []

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

  // Update debounced search term after user stops typing for 500ms
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    // Clear timeout if user types within the debounce period
    return () => {
      clearTimeout(timerId)
    }
  }, [searchTerm])

  const handleSort = field => {
    setSortField(field)
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
  }

  return (
    <Box overflowX="auto">
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        mb={4}
        maxWidth="400px"
      />

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
