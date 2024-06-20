import { useRouter } from "next/router";
import { Box, Heading, Text } from "@chakra-ui/react";
import MediaContainer from "@/components/MediaContainer";
import { MongoClient } from "mongodb";

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

  console.log(`Fetching data for media type: ${mediaType}`);
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
