import { Box, Container, Heading, Text, Link } from '@chakra-ui/react'
import Image from 'next/image'

const AboutPage = ({ pageInfo }) => {
  const { title, description, coffeeLink } = pageInfo

  return (
    <Container maxW="container.md" py={8}>
      <Box textAlign="center">
        <Heading as="h1" size="xl" mb={4}>
          {title}
        </Heading>
        <Text mb={20} fontSize="lg">
          {description}
        </Text>
        {coffeeLink && (
          <Link href={coffeeLink} isExternal>
            <Image src="/coffee.svg" alt="Buy me a coffee" width={150} height={150} />
          </Link>
        )}
      </Box>
    </Container>
  )
}

export default AboutPage
