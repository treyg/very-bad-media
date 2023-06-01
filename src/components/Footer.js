import { Box, ButtonGroup, Container, IconButton, Stack, Text } from '@chakra-ui/react'
import { FaGithub, FaTwitter } from 'react-icons/fa'

const Footer = () => (
  <Box as="footer" role="contentinfo" py={{ base: '12', md: '16' }} mt="auto">
    <Container>
      <Stack spacing={{ base: '4', md: '5' }}>
        <Stack justify="space-between" direction="row" align="center">
          <ButtonGroup variant="ghost">
            <IconButton
              as="a"
              href="https://github.com/treyg/very-bad-media"
              aria-label="GitHub"
              icon={<FaGithub fontSize="1.25rem" />}
            />
            <IconButton
              as="a"
              href="https://twitter.com/verybadwizards"
              aria-label="Twitter"
              icon={<FaTwitter fontSize="1.25rem" />}
            />
          </ButtonGroup>
        </Stack>
        <Text fontSize="sm" color="subtle">
          &copy; {new Date().getFullYear()} Very Bad Media. Site by{' '}
          <a href="https://treygordon.com">Trey Gordon</a>.
        </Text>
      </Stack>
    </Container>
  </Box>
)

export default Footer
