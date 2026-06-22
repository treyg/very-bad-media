import { Box, Container, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => (
  <Box as="footer" role="contentinfo" py={{ base: "12", md: "16" }} mt="auto">
    <Container>
      <Stack gap={{ base: "4", md: "5" }}>
        <Stack justify="space-between" direction="row" align="center">
          <HStack gap="2">
            <IconButton asChild aria-label="GitHub" variant="ghost">
              <a
                href="https://github.com/treyg/very-bad-media"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
            </IconButton>
            <IconButton asChild aria-label="Twitter" variant="ghost">
              <a
                href="https://twitter.com/verybadwizards"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
            </IconButton>
          </HStack>
        </Stack>
        <Text fontSize="sm" color="gray.500">
          &copy; {new Date().getFullYear()} Very Bad Media. Site by{" "}
          <a href="https://treygordon.com">Trey Gordon</a>.
        </Text>
      </Stack>
    </Container>
  </Box>
);

export default Footer;
