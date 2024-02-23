import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Input, Box } from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";
import MediaTable from "./MediaTable";
import MediaList from "./MediaList";

function formatDate(dateString) {
  return format(new Date(dateString), "MM/dd/yy");
}

const parseDate = (dateStr) => {
  const [month, day, year] = dateStr.split("/").map(Number);
  // Adjust for YY format to full year
  const fullYear = year < 70 ? 2000 + year : 1900 + year;
  return new Date(fullYear, month - 1, day);
};

const MediaContainer = ({ episodes, mediaTypes }) => {
  const [sortField, setSortField] = useState("episodeDate"); // Default to sorting by date
  const [sortDirection, setSortDirection] = useState("asc"); // or 'desc'
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const sortedData = episodes
    ? episodes
        .map((episode) =>
          mediaTypes.map((type) => ({
            episodeTitle: episode.episode,
            episodeLink: episode.link,
            episodeDate: formatDate(episode.pubDate),
            mediaType: type,
            media: episode.mediaList[type] || [],
          }))
        )
        .reduce((acc, val) => acc.concat(val), [])
        .filter((item) =>
          item.media.some(
            (mediaItem) =>
              mediaItem.title &&
              mediaItem.title
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase())
          )
        )
        .sort((a, b) => {
          const dateA = parseDate(a.episodeDate);
          const dateB = parseDate(b.episodeDate);
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        })
    : [];

  const displayType = useBreakpointValue({ base: "list", md: "table" });

  return (
    <Box>
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
        maxWidth="400px"
      />
      {displayType === "table" ? (
        <MediaTable
          data={sortedData}
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />
      ) : (
        <MediaList data={sortedData} />
      )}
    </Box>
  );
};

export default MediaContainer;
