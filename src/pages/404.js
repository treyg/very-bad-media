import { Box, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react'

const NotFoundPage = () => {
  const buttonColor = useColorModeValue('light.primary', 'dark.primary')
  const buttonHoverColor = useColorModeValue('green.500', 'green.500')

  return (
    <Box textAlign="center" my="60">
      <Heading as="h1" size="2xl" mb="2">
        404
      </Heading>
      <Heading as="h2" size="xl" mb="2">
        Page Not Found
      </Heading>
      <Text fontSize="xl" mb="4">
        The page you were looking for doesn&apos;t exist.
      </Text>
      <Button
        as="a"
        href="/"
        colorScheme={buttonColor} // Set the button color scheme
        bg={buttonColor}
        px={6}
        _hover={{
          bg: buttonHoverColor
        }}
      >
        Go Home
      </Button>
    </Box>
  )
}

export default NotFoundPage
