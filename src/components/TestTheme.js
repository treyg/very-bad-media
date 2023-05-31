import { Box, Text, useColorMode } from '@chakra-ui/react'

function TestTheme() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box>
      <Text color={colorMode === 'light' ? 'light.primary' : 'dark.primary'}>
        This text color will automatically change based on the selected color mode.
      </Text>
      <button onClick={toggleColorMode}>Toggle Color Mode</button>
    </Box>
  )
}

export default TestTheme
