import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

import CallToActionWithAnnotation from '@/components/CallToActionAnnotation'
import DottedBox from '@/components/DottedBox'
import BackgroundBlobs from '@/components/BackgroundBlobs'
import MediaTable from '@/components/MediaTable'
import { Box, Container, Heading } from '@chakra-ui/react'

export default function Home({ episodes }) {
  return (
    <>
      <Head>
        <title>Very Bad Media</title>
        <meta
          name="description"
          content="Media lists for books, movies, and short stories discussed on the Very Bad Wizards podcast"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box position="relative">
        <DottedBox position="absolute" />
        {/* <Image src="/logo.svg" alt="Very Bad Media" width="300" height="300" /> */}
        <BackgroundBlobs position="absolute" right="-200px" />
        <CallToActionWithAnnotation />
      </Box>
      <Box id="master" mt={{ base: '80px' }}>
        <Heading as="h2" size="lg" mb="10px">
          Master List
        </Heading>

        <MediaTable
          episodes={episodes}
          mediaTypes={[
            'books',
            'movies',
            'shortStories',
            'tvShows',
            'articles',
            'essays'
          ]}
        />
      </Box>
    </>
  )
}

export async function getServerSideProps() {
  const response = await fetch('/api/data')
  const episodes = await response.json()

  return {
    props: {
      episodes
    }
  }
}
