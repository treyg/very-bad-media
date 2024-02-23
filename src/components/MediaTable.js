import { Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";
import { fixType } from "../utils/utils";
const MediaTable = ({
  data,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
}) => {
  const handleSortByDate = () => {
    const newSortDirection =
      sortField === "episodeDate" && sortDirection === "asc" ? "desc" : "asc";
    setSortField("episodeDate");
    setSortDirection(newSortDirection);
  };

  return (
    <Table variant="simple" minWidth="100%">
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Type</Th>
          <Th>Author</Th>
          <Th cursor="pointer" onClick={handleSortByDate}>
            Date{" "}
            {sortField === "episodeDate"
              ? sortDirection === "asc"
                ? "↑"
                : "↓"
              : ""}
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item, index) =>
          item.media.map((mediaItem, mIndex) => (
            <Tr key={`${index}-${mIndex}`}>
              <Td>
                <Text fontSize="md" fontWeight="bold">
                  <a href={mediaItem.link ? mediaItem.link : "#"}>
                    {mediaItem.title}
                  </a>
                </Text>
                <Text fontSize="sm" color="gray.500">
                  <a href={item.episodeLink}>{item.episodeTitle}</a>
                </Text>
              </Td>
              <Td>
                <Text fontSize="sm">{fixType(item.mediaType)}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">
                  {mediaItem.author || mediaItem.director || ""}
                </Text>
              </Td>
              <Td>
                <Text fontSize="sm">{item.episodeDate}</Text>
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );
};

export default MediaTable;
