import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import CallToActionWithAnnotation from '@/components/CallToActionAnnotation'
import DottedBox from '@/components/DottedBox'
import BackgroundBlobs from '@/components/BackgroundBlobs'
import MediaTable from '@/components/MediaTable'
import { Box, Container, Heading } from '@chakra-ui/react'

export default function Home() {
  const [episodes, setEpisodes] = useState([])

  useEffect(() => {
    async function fetchMediaData() {
      const response = await fetch('http://localhost:3000/api/data')
      const media = await response.json()
      setEpisodes(media)
    }

    fetchMediaData()
  }, [])
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

      {/* {episodes.map((episode, index) => (
          <div key={index}>
            <h2>{episode.episode}</h2>
            <p>{episode.link}</p>
            <p>{episode.guid}</p>
            <p>{episode.pubDate}</p>
            <ul>
              {Object.entries(episode.mediaList).map(([category, items]) => (
                <li key={category}>
                  <strong>{category}</strong>
                  <ul>
                    {Array.isArray(items)
                      ? items.map((item, i) => <li key={i}>{JSON.stringify(item)}</li>)
                      : null}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))} */}
    </>
  )
}
