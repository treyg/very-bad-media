import { ChakraProvider, Container } from '@chakra-ui/react'
import theme from '../theme/theme'
import WithSubnavigation from '../components/WithSubNavigation'

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <WithSubnavigation />
      <Container maxW="7xl">
        <Component {...pageProps} />
      </Container>
    </ChakraProvider>
  )
}

export default App
