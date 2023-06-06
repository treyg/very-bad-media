import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Input, Box } from '@chakra-ui/react'
import { useBreakpointValue } from '@chakra-ui/react'
import MediaTable from './MediaTable'
import MediaList from './MediaList'

function formatDate(dateString) {
  return format(new Date(dateString), 'MM/dd/yy')
}

const MediaContainer = ({ episodes, mediaTypes }) => {
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

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchTerm])

  const displayType = useBreakpointValue({ base: 'list', md: 'table' })

  return (
    <Box>
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        mb={4}
        maxWidth="400px"
      />

      {displayType === 'table' ? <MediaTable data={data} /> : <MediaList data={data} />}
    </Box>
  )
}

export default MediaContainer
