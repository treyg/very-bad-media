import Head from "next/head";

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
        <script
          defer
          data-domain="verybad.media"
          src="https://plausible.tagweb.dev/js/script.js"
        ></script>
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
  const apiUrl = process.env.API_URL;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const responseText = await response.text();

  const contentType = response.headers.get("Content-Type");
  if (!contentType || !contentType.includes("application/json")) {
    console.error("Unexpected content type:", contentType);
    console.error("Raw response text:", responseText);
    throw new Error(`Unexpected content type: ${contentType}`);
  }

  let episodes;
  try {
    episodes = JSON.parse(responseText);
  } catch (error) {
    console.error("Error parsing response body as JSON:", error);
    throw error;
  }

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60, // Regenerate the page every hour
  };
}
