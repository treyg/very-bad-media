import { ChakraProvider, Container, Flex, Box } from '@chakra-ui/react'
import theme from '../theme/theme'
import WithSubnavigation from '../components/WithSubNavigation'
import Footer from '../components/Footer'
import { Analytics } from '@vercel/analytics/react'

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <WithSubnavigation />
      <Flex direction="column" minH="100vh">
        <Container flex="1" maxW="8xl">
          <Component {...pageProps} />
        </Container>
        <Footer />
      </Flex>
      <Analytics />
    </ChakraProvider>
  )
}

export default App
