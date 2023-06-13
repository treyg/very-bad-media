import { Box, Container, Heading, Text, Link, Grid } from '@chakra-ui/react'
import Image from 'next/image'
import SocialProfile from '../components/SocialProfile'

const AboutPodcast = () => {
  const hosts = [
    {
      name: 'David Pizarro',
      handle: '@peez',
      twitterUrl: 'https://twitter.com/peez',
      avatar: '/dave.jpeg',
      bio: 'David Pizarro is a professor at Cornell University, specializing in moral judgement and emotion.',
      hashtags: []
    },
    {
      name: 'Tamler Sommers',
      handle: '@tamler',
      twitterUrl: 'https://twitter.com/tamler',
      avatar: '/tamler.jpeg',
      bio: 'Tamler Sommers is a professor at the University of Houston, specializing in honor and morality.',
      hashtags: []
    }
  ]

  return (
    <Container maxW="container.md" py={8}>
      <Box textAlign="center">
        <Heading as="h1" size="xl" mb={4}>
          About Very Bad Wizards
        </Heading>
        <Text mb={20} fontSize="lg">
          Very Bad Wizards is a podcast featuring a philosopher (Tamler Sommers) and a
          psychologist (David Pizarro), who share a love for ethics, pop culture, and
          cognitive science, and who have a marked inability to distinguish sacred from
          profane. Each podcast includes discussions of moral philosophy, recent work on
          moral psychology and neuroscience, and the overlap between the two.
        </Text>
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={6}>
          {hosts.map((host, index) => (
            <SocialProfile
              key={index}
              name={host.name}
              twitterUrl={host.twitterUrl}
              handle={host.handle}
              avatar={host.avatar}
              bio={host.bio}
              hashtags={host.hashtags}
            />
          ))}
        </Grid>
      </Box>
    </Container>
  )
}

export default AboutPodcast
