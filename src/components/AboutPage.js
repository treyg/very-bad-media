import { Box, Container, Heading, Text } from '@chakra-ui/react'

const AboutPage = ({ pageInfo }) => {
  const { title, description } = pageInfo

  return (
    <Container maxW="container.md" py={8}>
      <Box textAlign="center">
        <Heading as="h1" size="xl" mb={4}>
          {title}
        </Heading>
        <Text fontSize="lg">{description}</Text>
      </Box>
    </Container>
  )
}

export default AboutPage
