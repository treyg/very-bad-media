import { Container, Flex } from "@chakra-ui/react";
import { Provider } from "@/components/ui/provider";
import WithSubnavigation from "@/components/WithSubNavigation";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <WithSubnavigation />
      <Flex direction="column" minH="100vh">
        <Container flex="1" maxW="8xl">
          <Component {...pageProps} />
        </Container>
        <Footer />
      </Flex>
    </Provider>
  );
}
