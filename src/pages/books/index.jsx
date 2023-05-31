import MediaTable from '@/components/MediaTable'

import { Box, Heading } from '@chakra-ui/react'

export default function Books() {
  const mediaTypes = ['books']

  return (
    <Box p={4}>
      <Heading as="h1" size="xl">
        Welcome to Chakra UI!
      </Heading>
      <MediaTable mediaType="books" />
    </Box>
  )
}
