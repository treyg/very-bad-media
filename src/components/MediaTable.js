import { Table, Text, Link } from "@chakra-ui/react";
import { fixType } from "../utils/utils";

const MediaTable = ({
  data,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
}) => {
  const handleSortByDate = () => {
    const newSortDirection =
      sortField === "episodeDate" && sortDirection === "asc" ? "desc" : "asc";
    setSortField("episodeDate");
    setSortDirection(newSortDirection);
  };

  return (
    <Table.Root
      variant="line"
      size="sm"
      minWidth="100%"
      bg="transparent"
      css={{
        "& th, & td, & thead, & tbody, & tr": { background: "transparent" },
      }}
    >
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Title</Table.ColumnHeader>
          <Table.ColumnHeader>Type</Table.ColumnHeader>
          <Table.ColumnHeader>Author</Table.ColumnHeader>
          <Table.ColumnHeader cursor="pointer" onClick={handleSortByDate}>
            Date{" "}
            {sortField === "episodeDate"
              ? sortDirection === "asc"
                ? "↑"
                : "↓"
              : ""}
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((item, index) =>
          item.media.map((mediaItem, mIndex) => (
            <Table.Row key={`${index}-${mIndex}`}>
              <Table.Cell>
                <Text fontSize="md" fontWeight="bold">
                  <Link href={mediaItem.link || "#"}>{mediaItem.title}</Link>
                </Text>
                <Text fontSize="sm" color="gray.500">
                  <Link href={item.episodeLink}>{item.episodeTitle}</Link>
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm">{fixType(item.mediaType)}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm">{mediaItem.creator || ""}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm">{item.episodeDate}</Text>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
};

export default MediaTable;
