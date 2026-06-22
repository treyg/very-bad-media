import { Box, Heading, Text, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useColorModeValue } from "@/components/ui/color-mode";

const NotFoundPage = () => {
  const buttonColor = useColorModeValue("light.primary", "dark.primary");

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
      <Button asChild bg={buttonColor} px={6} _hover={{ bg: "green.500" }}>
        <NextLink href="/">Go Home</NextLink>
      </Button>
    </Box>
  );
};

export default NotFoundPage;
