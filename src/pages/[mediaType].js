import { useRouter } from "next/router";
import { Box, Heading, Text } from "@chakra-ui/react";
import MediaContainer from "@/components/MediaContainer";
import SkeletonTable from "@/components/SkeletonTable";
import { fetchEpisodes, useFetch } from "@/lib/api";

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

export default function MediaTypePage() {
  const router = useRouter();
  const { mediaType } = router.query;
  const { data: episodes, error, loading } = useFetch(fetchEpisodes);

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

      {error ? (
        <Text color="red.500">Failed to load media: {error}</Text>
      ) : loading ? (
        <SkeletonTable />
      ) : (
        <MediaContainer episodes={episodes} mediaTypes={selectedMedia} />
      )}
    </Box>
  );
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
