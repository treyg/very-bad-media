import { VStack, Box, Text, Link, Badge, Icon, HStack } from "@chakra-ui/react";
import { LuExternalLink, LuHeadphones } from "react-icons/lu";
import { fixType, typeColor } from "../utils/utils";

const MediaList = ({ rows = [] }) => (
  <VStack gap={4} align="start" w="100%">
    {rows.map((r, index) => (
      <Box
        key={index}
        w="100%"
        borderBottom="1px solid"
        borderColor="gray.700"
        pb={4}
      >
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

        <HStack gap={2} my={1}>
          <Badge colorPalette={typeColor(r.mediaType)}>
            {fixType(r.mediaType)}
          </Badge>
          {r.mediaCreator && <Text fontSize="sm">{r.mediaCreator}</Text>}
        </HStack>

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
      </Box>
    ))}
  </VStack>
);

export default MediaList;
