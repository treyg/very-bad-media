import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Link,
  Divider,
  useColorModeValue,
  Flex,
  Spinner,
  Center
} from '@chakra-ui/react'
import DOMPurify from 'isomorphic-dompurify'

export default function LetterboxdPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    const fetchLetterboxdData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/letterboxd')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        setEntries(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLetterboxdData()
  }, [])

  if (loading) {
    return (
      <Center py={8}>
        <Spinner size="xl" />
      </Center>
    )
  }

  if (error) {
    return (
      <Text p={4} color="red.500">
        Error: {error}
      </Text>
    )
  }

  return (
    <Container maxW="6xl" py={8}>
      <Heading as="h1" mb={6}>
        Tamler&apos;s Letterboxd Reviews
      </Heading>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {entries.map((entry, index) => {
          const cleanHtml = DOMPurify.sanitize(entry.description)

          return (
            <Box
              key={index}
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bg={bgColor}
              borderColor={borderColor}
              shadow="sm"
              display="flex"
              flexDirection="column">
              <Link href={entry.link} isExternal color="teal.500">
                <Heading as="h2" size="md" mb={2}>
                  {entry.title}
                </Heading>
              </Link>
              <Text fontSize="sm" color="gray.500" mb={4}>
                {new Date(entry.pubDate).toLocaleDateString()}
              </Text>
              <Flex direction="column" flex="1">
                <Box
                  className="letterboxd-review-content"
                  sx={{
                    img: {
                      maxWidth: '120px',
                      height: 'auto',
                      borderRadius: 'md',
                      float: 'left',
                      marginRight: '1rem',
                      marginBottom: '1rem'
                    },
                    p: {
                      marginBottom: '1rem',
                      '&:last-of-type': {
                        marginBottom: 0
                      }
                    }
                  }}
                  mb={4}
                  flex="1"
                  dangerouslySetInnerHTML={{ __html: cleanHtml }}
                />
                <Divider />
                <Box pt={4}>
                  <Link href={entry.link} color="teal.500" isExternal>
                    View on Letterboxd →
                  </Link>
                </Box>
              </Flex>
            </Box>
          )
        })}
      </SimpleGrid>
    </Container>
  )
}
