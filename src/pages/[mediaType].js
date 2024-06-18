import { useRouter } from "next/router";
import { Box, Heading, Text } from "@chakra-ui/react";
import MediaContainer from "@/components/MediaContainer";

const headings = {
  books: "Books",
  shortstories: "Short Stories",
  movies: "Movies",
  tvshows: "TV Shows",
  articles: "Articles",
  essays: "Essays",
};

function generateHeading(mediaType) {
  return headings[mediaType] || mediaType;
}

export default function MediaTypePage({ episodes }) {
  const router = useRouter();
  const { mediaType } = router.query;

  const selectedMedia = [mediaType];

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mt="20px">
        {generateHeading(mediaType)}
        <Text as="p" fontSize="sm" fontWeight="normal" my="10px">
          {generateHeading(mediaType)} discussed on the Very Bad Wizards
          podcast.
        </Text>
      </Heading>

      <MediaContainer episodes={episodes} mediaTypes={selectedMedia} />
    </Box>
  );
}

export async function getStaticProps({ params }) {
  const { mediaType } = params;

  const apiUrl = "http://localhost:3000/api/data";

  const response = await fetch(apiUrl);

  // Check if the request was successful
  if (!response.ok) {
    // If the server returned an error status code, throw an error
    throw new Error(`API request failed with status ${response.status}`);
  }

  // Check if the response has the correct content type
  const contentType = response.headers.get("Content-Type");
  if (!contentType || !contentType.includes("application/json")) {
    console.error("Unexpected content type:", contentType);
    console.error("Raw response text:", await response.text());
    throw new Error(`Unexpected content type: ${contentType}`);
  }
  // Try to parse the response body as JSON
  let episodes;
  try {
    episodes = await response.json();
  } catch (error) {
    // If parsing the response body as JSON failed, log the error and the response body
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

export async function getStaticPaths() {
  const paths = [
    "books",
    "shortstories",
    "movies",
    "tvshows",
    "articles",
    "essays",
  ].map((mediaType) => ({
    params: { mediaType },
  }));

  return { paths, fallback: false };
}
