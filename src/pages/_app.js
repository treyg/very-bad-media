import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme/theme'
import WithSubnavigation from '../components/WithSubnavigation'

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <WithSubnavigation />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
