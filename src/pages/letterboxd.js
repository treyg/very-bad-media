import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Link,
  Image,
  Flex,
  HStack,
  Badge,
  Spinner,
  Center
} from '@chakra-ui/react'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { useColorModeValue } from '@/components/ui/color-mode'
import DOMPurify from 'isomorphic-dompurify'
import { fetchLetterboxd } from '@/lib/api'

function Stars({ rating }) {
  if (rating == null) return null
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <HStack gap={0.5} color="#00e054">
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={`f${i}`} />
      ))}
      {half && <FaStarHalfAlt />}
      {Array.from({ length: empty }).map((_, i) => (
        <FaRegStar key={`e${i}`} />
      ))}
    </HStack>
  )
}

export default function LetterboxdPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const metaColor = useColorModeValue('gray.500', 'gray.400')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    fetchLetterboxd()
      .then(data => active && setEntries(data))
      .catch(err => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
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
    <Container maxW="5xl" py={8}>
      <Heading as="h1" mb={2}>
        Tamler&apos;s Letterboxd Reviews
      </Heading>
      <Text color={metaColor} mb={6}>
        Recent films watched and rated by Tamler.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
        {entries.map((entry, index) => {
          const reviewHtml = entry.review
            ? DOMPurify.sanitize(entry.review)
            : ''
          const watched = entry.watchedDate
            ? new Date(entry.watchedDate).toLocaleDateString()
            : null

          return (
            <Flex
              key={index}
              gap={4}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg={cardBg}
              borderColor={borderColor}
              shadow="sm"
            >
              {entry.poster && (
                <Link
                  href={entry.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  flexShrink={0}
                >
                  <Image
                    src={entry.poster}
                    alt={entry.filmTitle}
                    w="92px"
                    borderRadius="md"
                    loading="lazy"
                  />
                </Link>
              )}

              <Box flex="1" minW={0}>
                <Link
                  href={entry.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  fontWeight="bold"
                  fontSize="md"
                >
                  {entry.filmTitle}
                  {entry.filmYear && (
                    <Text as="span" color={metaColor} fontWeight="normal">
                      {' '}
                      ({entry.filmYear})
                    </Text>
                  )}
                </Link>

                <HStack gap={2} mt={1} mb={2}>
                  <Stars rating={entry.rating} />
                  {entry.rewatch && (
                    <Badge size="sm" colorPalette="green">
                      Rewatch
                    </Badge>
                  )}
                  {watched && (
                    <Text fontSize="xs" color={metaColor}>
                      {watched}
                    </Text>
                  )}
                </HStack>

                {reviewHtml && (
                  <Box
                    fontSize="sm"
                    color={metaColor}
                    lineClamp={6}
                    css={{ '& p': { marginBottom: '0.5rem' } }}
                    dangerouslySetInnerHTML={{ __html: reviewHtml }}
                  />
                )}
              </Box>
            </Flex>
          )
        })}
      </SimpleGrid>
    </Container>
  )
}
