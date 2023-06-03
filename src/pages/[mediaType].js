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

export async function getStaticPaths() {
  const paths = ['books', 'shortstories', 'movies', 'tvshows', 'articles', 'essays'].map(
    mediaType => ({
      params: { mediaType }
    })
  )

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const { mediaType } = params

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  const response = await fetch(`${baseUrl}/api/data`)
  const episodes = await response.json()

  return {
    props: {
      episodes
    },
    revalidate: 60 * 60 // Regenerate the page every hour
  }
}
