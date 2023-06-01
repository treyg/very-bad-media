import MediaTable from '@/components/MediaTable'
import { Box, Heading, Text } from '@chakra-ui/react'

export default function Books({ episodes }) {
  const selectedMedia = ['books', 'shortStories']

  const headings = {
    books: 'Books',
    shortStories: 'Short Stories',
    movies: 'Movies',
    tvshows: 'TV Shows',
    articles: 'Articles',
    essays: 'Essays'
  }

  function generateHeading(selectedMedia) {
    if (selectedMedia.length === 1) {
      return headings[selectedMedia[0]]
    } else {
      return selectedMedia.map(type => headings[type]).join(' and ')
    }
  }

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mt="20px">
        {generateHeading(selectedMedia)}
        <Text as="p" fontSize="sm" fontWeight="normal" my="10px">
          {generateHeading(selectedMedia)} discussed on the Very Bad Wizards podcast.
        </Text>
      </Heading>

      <MediaTable episodes={episodes} mediaTypes={selectedMedia} />
    </Box>
  )
}

export async function getServerSideProps() {
  const response = await fetch(`http://localhost:3000/api/data`, {
    headers: {
      'Cache-Control': 'no-cache'
    }
  })
  const episodes = await response.json()

  return {
    props: {
      episodes
    }
  }
}
