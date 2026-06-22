import { Box, Table, Skeleton } from "@chakra-ui/react";

const SkeletonTable = () => (
  <Box overflowX="auto">
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
          <Table.ColumnHeader>Date</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {[...Array(10)].map((_, index) => (
          <Table.Row key={index}>
            <Table.Cell>
              <Skeleton height="20px" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height="20px" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height="20px" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton height="20px" />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  </Box>
);

export default SkeletonTable;
