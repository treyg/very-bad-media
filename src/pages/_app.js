import { ChakraProvider, Container, Flex } from "@chakra-ui/react";
import theme from "../theme/theme";
import WithSubnavigation from "../components/WithSubNavigation";
import Footer from "../components/Footer";
import PlausibleProvider from "next-plausible";

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <PlausibleProvider
        domain="yourdomain.com"
        customDomain="https://plausible.tagweb.dev"
      >
        <WithSubnavigation />
        <Flex direction="column" minH="100vh">
          <Container flex="1" maxW="8xl">
            <Component {...pageProps} />
          </Container>
          <Footer />
        </Flex>
      </PlausibleProvider>
    </ChakraProvider>
  );
}

export default App;
