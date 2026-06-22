import { Table, Text, Link, Badge, Box, Icon } from "@chakra-ui/react";
import { LuExternalLink, LuHeadphones, LuArrowUp, LuArrowDown } from "react-icons/lu";
import { fixType, typeColor } from "../utils/utils";
import { useColorModeValue } from "@/components/ui/color-mode";

const SortHeader = ({ label, field, sortField, sortDirection, onSort, ...rest }) => (
  <Table.ColumnHeader
    cursor="pointer"
    userSelect="none"
    onClick={() => onSort(field)}
    {...rest}
  >
    <Box as="span" display="inline-flex" alignItems="center" gap={1}>
      {label}
      {sortField === field &&
        (sortDirection === "asc" ? <LuArrowUp /> : <LuArrowDown />)}
    </Box>
  </Table.ColumnHeader>
);

const MediaTable = ({ rows, sortField, sortDirection, onSort }) => {
  const headerBg = useColorModeValue("#ffffff", "#0f172a");
  const hoverBg = useColorModeValue("blackAlpha.50", "whiteAlpha.100");

  const headerProps = { sortField, sortDirection, onSort };

  return (
    <Box overflowX="auto">
      <Table.Root
        variant="line"
        size="sm"
        minWidth="100%"
        bg="transparent"
        css={{ "& td, & tr, & tbody, & table": { background: "transparent" } }}
      >
        <Table.Header
          css={{ "& th": { position: "sticky", top: 0, background: headerBg, zIndex: 1 } }}
        >
          <Table.Row>
            <SortHeader label="Title" field="title" {...headerProps} />
            <SortHeader label="Type" field="type" {...headerProps} />
            <SortHeader label="Author" field="creator" {...headerProps} />
            <SortHeader label="Date" field="date" {...headerProps} />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((r, i) => (
            <Table.Row key={i} _hover={{ bg: hoverBg }}>
              <Table.Cell>
                <Text fontSize="md" fontWeight="bold">
                  {r.mediaLink ? (
                    <Link
                      href={r.mediaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      display="inline-flex"
                      alignItems="center"
                      gap={1}
                    >
                      {r.mediaTitle}
                      <Icon as={LuExternalLink} boxSize={3} color="gray.500" />
                    </Link>
                  ) : (
                    r.mediaTitle
                  )}
                </Text>
                <Link
                  href={r.episodeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  fontSize="sm"
                  color="gray.500"
                  display="inline-flex"
                  alignItems="center"
                  gap={1}
                >
                  <Icon as={LuHeadphones} boxSize={3} />
                  {r.episodeTitle}
                </Link>
              </Table.Cell>
              <Table.Cell>
                <Badge colorPalette={typeColor(r.mediaType)}>
                  {fixType(r.mediaType)}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm">{r.mediaCreator}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm" whiteSpace="nowrap">
                  {r.dateLabel}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default MediaTable;
