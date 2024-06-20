import Head from "next/head";
import Script from "next/script";
import { MongoClient } from "mongodb";
import CallToActionWithAnnotation from "@/components/CallToActionAnnotation";
import DottedBox from "@/components/DottedBox";
import BackgroundBlobs from "@/components/BackgroundBlobs";
import { Box, Heading } from "@chakra-ui/react";
import MediaContainer from "@/components/MediaContainer";

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
        <Script
          defer
          data-domain="verybad.media"
          src="https://plausible.tagweb.dev/js/script.js"
        />
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
      </Box>
    </>
  );
}

export async function getStaticProps() {
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB.");

    const collection = client
      .db(process.env.MONGODB_DB)
      .collection("episodesGPT4");
    console.log("Fetching episodes from MongoDB...");

    let episodes = await collection.find().toArray();

    episodes = JSON.parse(JSON.stringify(episodes));
    console.log(`Fetched ${episodes.length} episodes.`);

    return {
      props: {
        episodes,
      },
      revalidate: 60 * 60, // Regenerate the page every hour
    };
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    return {
      props: {
        episodes: [],
        error: "Failed to fetch episodes",
      },
    };
  } finally {
    console.log("Closing connection to MongoDB...");
    await client.close();
    console.log("Closed connection to MongoDB.");
  }
}
