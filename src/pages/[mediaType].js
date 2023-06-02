import { useRouter } from 'next/router'
import MediaTable from '@/components/MediaTable'
import { Box, Heading, Text } from '@chakra-ui/react'

const headings = {
  books: 'Books',
  shortstories: 'Short Stories',
  movies: 'Movies',
  tvshows: 'TV Shows',
  articles: 'Articles',
  essays: 'Essays'
}

function generateHeading(mediaType) {
  return headings[mediaType] || mediaType
}

export default function MediaTypePage({ episodes }) {
  const router = useRouter()
  const { mediaType } = router.query

  const selectedMedia = [mediaType]

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mt="20px">
        {generateHeading(mediaType)}
        <Text as="p" fontSize="sm" fontWeight="normal" my="10px">
          {generateHeading(mediaType)} discussed on the Very Bad Wizards podcast.
        </Text>
      </Heading>

      <MediaTable episodes={episodes} mediaTypes={selectedMedia} />
    </Box>
  )
}

export async function getServerSideProps(context) {
  const { mediaType } = context.query

  // Define the allowed media types
  const allowedMediaTypes = [
    'books',
    'shortstories',
    'movies',
    'tvshows',
    'articles',
    'essays'
  ]

  // If the mediaType from the URL is not allowed, return a 404
  if (!allowedMediaTypes.includes(mediaType)) {
    return {
      notFound: true
    }
  }

  const response = await fetch(
    `https://very-bad-media-98k6ggf04-treyg.vercel.app/api/data`,
    {
      headers: {
        // 'Cache-Control': 'no-cache'
      }
    }
  )
  const episodes = await response.json()

  // You can filter the episodes based on the mediaType here if needed

  return {
    props: {
      episodes
    }
  }
}
