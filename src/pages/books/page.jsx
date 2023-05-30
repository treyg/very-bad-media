import MediaTable from '@/components/MediaTable'

import { Box, Heading } from '@chakra-ui/react'

export default function Books() {
  return (
    <Box p={4}>
      <Heading as="h1" size="xl">
        Welcome to Chakra UI!
      </Heading>
      <MediaTable />
    </Box>
  )
}
