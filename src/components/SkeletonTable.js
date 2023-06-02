import { Box, Table, Thead, Tbody, Tr, Th, Td, Skeleton } from '@chakra-ui/react'

const SkeletonTable = () => (
  <Box overflowX="auto">
    <Table variant="simple" minWidth="100%">
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Type</Th>
          <Th>Author</Th>
          <Th>Date</Th>
        </Tr>
      </Thead>
      <Tbody>
        {[...Array(10)].map((_, index) => (
          <Tr key={index}>
            <Td>
              <Skeleton height="20px" />
            </Td>
            <Td>
              <Skeleton height="20px" />
            </Td>
            <Td>
              <Skeleton height="20px" />
            </Td>
            <Td>
              <Skeleton height="20px" />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
)

export default SkeletonTable
