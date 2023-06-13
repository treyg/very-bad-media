import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Link,
  Badge,
  useColorModeValue
} from '@chakra-ui/react'

export default function SocialProfileSimple({
  name,
  handle,
  avatar,
  bio,
  hashtags,
  twitterUrl
}) {
  return (
    <Center py={6}>
      <Box
        maxW={'320px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
        textAlign={'center'}
      >
        <Avatar size={'xl'} src={avatar} alt={name} mb={4} pos={'relative'} />
        <Heading fontSize={'2xl'} fontFamily={'body'}>
          {name}
        </Heading>
        <Text fontWeight={600} color={'gray.500'} mb={4}>
          <Link href={twitterUrl} isExternal>
            {handle}
          </Link>
        </Text>
        <Text
          textAlign={'center'}
          color={useColorModeValue('gray.700', 'gray.400')}
          px={3}
        >
          {bio}
        </Text>

        <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
          {hashtags.map((hashtag, index) => (
            <Badge
              key={index}
              px={2}
              py={1}
              bg={useColorModeValue('gray.50', 'gray.800')}
              fontWeight={'400'}
            >
              {hashtag}
            </Badge>
          ))}
        </Stack>
      </Box>
    </Center>
  )
}
