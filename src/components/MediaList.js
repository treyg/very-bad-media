import { BiBook, BiMoviePlay } from 'react-icons/bi'
import { MdOutlineArticle } from 'react-icons/md'
import { VStack, Text, Box } from '@chakra-ui/react'
import { fixType } from '../utils/utils'

function getIconForMediaType(mediaType) {
  switch (mediaType) {
    case 'articles':
    case 'essays':
      return <MdOutlineArticle />
    case 'movies':
    case 'tvshows':
      return <BiMoviePlay />
    case 'books':
    case 'shortstories':
      return <BiBook />
    default:
      return null
  }
}

const MediaList = ({ data = [] }) => (
  <VStack spacing={4} align="start" w="100%">
    {data.map((item, index) =>
      item.media.map((mediaItem, mIndex) => (
        <Box w="100%" borderBottom="1px" borderColor="gray.200" py={4}>
          <Text fontSize="md" fontWeight="bold">
            <a href={mediaItem.link ? mediaItem.link : '#'}>{mediaItem.title}</a>
          </Text>
          <Text fontSize="sm">
            <Box as="span" display="inline-flex" alignItems="center" gap={1}>
              {getIconForMediaType(item.mediaType)}
              {fixType(item.mediaType)} {mediaItem.author ? `- ${mediaItem.author}` : ''}
            </Box>
          </Text>
          <Text fontSize="sm" color="gray.500">
            <a href={item.episodeLink}>{item.episodeTitle}</a>
          </Text>
          {/* <Text fontSize="sm">{item.episodeDate}</Text> */}
        </Box>
      ))
    )}
  </VStack>
)

export default MediaList
