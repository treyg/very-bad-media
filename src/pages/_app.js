import { ChakraProvider, Container, Flex } from "@chakra-ui/react";
import theme from "../theme/theme";
import WithSubnavigation from "../components/WithSubNavigation";
import Footer from "../components/Footer";


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
    </ChakraProvider>
  );
}

export default App;
