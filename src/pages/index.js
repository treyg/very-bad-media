import Head from "next/head";
import CallToActionWithAnnotation from "@/components/CallToActionAnnotation";
import DottedBox from "@/components/DottedBox";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import { Box, Heading, Text } from "@chakra-ui/react";
import MediaContainer from "@/components/MediaContainer";
import SkeletonTable from "@/components/SkeletonTable";
import { fetchEpisodes, useFetch } from "@/lib/api";

export default function Home() {
  const { data: episodes, error, loading } = useFetch(fetchEpisodes);

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
        <BackgroundBlobs position="absolute" right="-200px" />
        <CallToActionWithAnnotation />
      </Box>
      <Box id="master" mt={{ base: "80px" }}>
        <Heading as="h2" size="lg" mb="10px">
          Master List
        </Heading>

        {error ? (
          <Text color="red.500">Failed to load media: {error}</Text>
        ) : loading ? (
          <SkeletonTable />
        ) : (
          <MediaContainer
            episodes={episodes}
            mediaTypes={[
              "books",
              "movies",
              "shortstories",
              "tvshows",
              "articles",
              "essays",
            ]}
          />
        )}
      </Box>
    </>
  );
}
