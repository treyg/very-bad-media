import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Link,
  Badge,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";

export default function SocialProfileSimple({
  name,
  handle,
  avatar,
  bio,
  hashtags,
  twitterUrl,
}) {
  const badgeBg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.900");
  const bioColor = useColorModeValue("gray.700", "gray.400");

  return (
    <Center py={6}>
      <Box
        maxW={"320px"}
        w={"full"}
        bg={cardBg}
        boxShadow={"2xl"}
        rounded={"lg"}
        p={6}
        textAlign={"center"}
      >
        <Avatar.Root size="xl" mb={4}>
          <Avatar.Image src={avatar} alt={name} />
          <Avatar.Fallback name={name} />
        </Avatar.Root>
        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {name}
        </Heading>
        <Text fontWeight={600} color={"gray.500"} mb={4}>
          <Link href={twitterUrl} target="_blank" rel="noopener noreferrer">
            {handle}
          </Link>
        </Text>
        <Text textAlign={"center"} color={bioColor} px={3}>
          {bio}
        </Text>

        <Stack align={"center"} justify={"center"} direction={"row"} mt={6}>
          {hashtags.map((hashtag, index) => (
            <Badge key={index} px={2} py={1} bg={badgeBg} fontWeight={"400"}>
              {hashtag}
            </Badge>
          ))}
        </Stack>
      </Box>
    </Center>
  );
}
