import { useState, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import {
  Box,
  Input,
  Button,
  Wrap,
  WrapItem,
  Text,
  Center,
  useBreakpointValue
} from '@chakra-ui/react'
import MediaTable from './MediaTable'
import MediaList from './MediaList'
import { fixType, typeColor } from '../utils/utils'

const PAGE_SIZE = 50

function formatDate(date) {
  return format(date, 'MM/dd/yy')
}

const MediaContainer = ({ episodes, mediaTypes }) => {
  const showTypeFilter = mediaTypes.length > 1
  const typesKey = mediaTypes.join(',')

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [selectedTypes, setSelectedTypes] = useState(() => new Set(mediaTypes))
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300)
    return () => clearTimeout(id)
  }, [searchTerm])

  // Flatten episodes -> one row per media item.
  const allRows = useMemo(() => {
    if (!episodes) return []
    const rows = []
    for (const ep of episodes) {
      const date = new Date(ep.pubDate)
      const dateLabel = formatDate(date)
      for (const type of mediaTypes) {
        const items = ep.mediaList?.[type] || []
        for (const m of items) {
          if (!m.title) continue
          rows.push({
            mediaTitle: m.title,
            mediaCreator: m.creator || '',
            mediaLink: m.link || '',
            mediaType: type,
            episodeTitle: ep.episode,
            episodeLink: ep.link,
            date,
            dateLabel
          })
        }
      }
    }
    return rows
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodes, typesKey])

  const filtered = useMemo(() => {
    const q = debouncedSearchTerm.trim().toLowerCase()
    return allRows.filter(r => {
      if (showTypeFilter && !selectedTypes.has(r.mediaType)) return false
      if (!q) return true
      return (
        r.mediaTitle.toLowerCase().includes(q) ||
        r.mediaCreator.toLowerCase().includes(q) ||
        r.episodeTitle.toLowerCase().includes(q)
      )
    })
  }, [allRows, selectedTypes, debouncedSearchTerm, showTypeFilter])

  const sorted = useMemo(() => {
    const dir = sortDirection === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      let cmp
      switch (sortField) {
        case 'title':
          cmp = a.mediaTitle.localeCompare(b.mediaTitle)
          break
        case 'type':
          cmp = a.mediaType.localeCompare(b.mediaType) || a.date - b.date
          break
        case 'creator':
          cmp = a.mediaCreator.localeCompare(b.mediaCreator)
          break
        default:
          cmp = a.date - b.date
      }
      return cmp * dir
    })
  }, [filtered, sortField, sortDirection])

  // Reset paging whenever the result set changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [debouncedSearchTerm, selectedTypes, sortField, sortDirection, typesKey])

  const visible = sorted.slice(0, visibleCount)
  const displayType = useBreakpointValue({ base: 'list', md: 'table' })

  const handleSort = field => {
    if (sortField === field) {
      setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection(field === 'date' ? 'desc' : 'asc')
    }
  }

  const toggleType = type => {
    setSelectedTypes(prev => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next.size === 0 ? new Set(mediaTypes) : next
    })
  }

  return (
    <Box>
      <Input
        placeholder="Search title, author, or episode..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        mb={4}
        maxWidth="400px"
      />

      {showTypeFilter && (
        <Wrap mb={4} gap={2}>
          {mediaTypes.map(type => (
            <WrapItem key={type}>
              <Button
                size="xs"
                variant={selectedTypes.has(type) ? 'solid' : 'outline'}
                colorPalette={typeColor(type)}
                onClick={() => toggleType(type)}
              >
                {fixType(type)}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      )}

      <Text fontSize="sm" color="gray.500" mb={3}>
        Showing {visible.length.toLocaleString()} of{' '}
        {sorted.length.toLocaleString()}
      </Text>

      {displayType === 'table' ? (
        <MediaTable
          rows={visible}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      ) : (
        <MediaList rows={visible} />
      )}

      {visibleCount < sorted.length && (
        <Center mt={6}>
          <Button variant="outline" onClick={() => setVisibleCount(c => c + PAGE_SIZE)}>
            Load more ({(sorted.length - visibleCount).toLocaleString()} remaining)
          </Button>
        </Center>
      )}
    </Box>
  )
}

export default MediaContainer
