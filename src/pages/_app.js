import { ChakraProvider, Container } from '@chakra-ui/react'
import theme from '../theme/theme'
import WithSubnavigation from '../components/WithSubNavigation'
import Footer from '../components/Footer'
import { Analytics } from '@vercel/analytics/react'
function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <WithSubnavigation />
      <Container maxW="8xl">
        <Component {...pageProps} />
      </Container>
      <Footer />
      <Analytics />
    </ChakraProvider>
  )
}

export default App
