import { ChakraProvider, CSSReset } from '@chakra-ui/react'

function ChakraApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default ChakraApp
