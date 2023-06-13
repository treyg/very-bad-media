import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Icon,
  HStack,
  VStack
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import { Link } from '@chakra-ui/react'
import features from '../data/features'

const AboutSite = () => {
  return (
    <Box p={4} mt={16}>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
        <Heading as={'h1'} fontSize={'3xl'}>
          About Very Bad Media
        </Heading>
        <Text fontSize={'md'}>
          This is a fan built site for the media discussed on the Very Bad Wizards
          podcast. The media lists are automated by running the RSS feed for the podcast
          through the Open AI api and analyzing the text to find the media discussed. The
          episode data is then stored in a database. The site is built with Next.js and
          Chakra UI. Reach out to me if you'd like to contribute or make suggestions!
        </Text>
      </Stack>

      <Container maxW={'6xl'} mt={10}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {features.map(feature => (
            <HStack key={feature.id} align={'top'}>
              <Box color={'green.400'} px={2}>
                <Icon as={CheckIcon} />
              </Box>
              <VStack align={'start'}>
                <Text fontWeight={600}>{feature.title}</Text>
                <Text color={'gray.600'}>{feature.text}</Text>
              </VStack>
            </HStack>
          ))}
        </SimpleGrid>
      </Container>

      <Container maxW={'3xl'} textAlign={'center'} mt={20} ml={0}>
        <Link href="https://www.buymeacoffee.com/TreyG" isExternal>
          <Image src="/coffee.svg" alt="Buy me a coffee" width={150} height={150} />
        </Link>
      </Container>
    </Box>
  )
}

export default AboutSite
