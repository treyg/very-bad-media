import { Box, useColorModeValue } from '@chakra-ui/react'

const BackgroundBlobs = ({ ...props }) => {
  const blob1Color = useColorModeValue('light.primary', 'dark.primary')
  const blob2Color = useColorModeValue('light.secondary', 'dark.secondary')
  const blob3Color = useColorModeValue('light.accent', 'dark.accent')

  return (
    <Box
      {...props}
      inset="0"
      display="grid"
      placeItems="center"
      opacity="0.2"
      width="max-content"
    >
      <Box
        position="absolute"
        height="200px"
        width="200px"
        borderRadius="100%"
        filter="blur(100px)"
        bgColor={blob1Color}
        transform="translate(50px, -50px) scaleY(1.4)"
      />
      <Box
        position="absolute"
        height="300px"
        width="300px"
        borderRadius="100%"
        filter="blur(100px)"
        bgColor={blob2Color}
      />
      <Box
        position="absolute"
        height="300px"
        width="300px"
        borderRadius="100%"
        filter="blur(100px)"
        bgColor={blob3Color}
        transform="translate(-50px, 50px) scaleY(1.4)"
      />
    </Box>
  )
}

export default BackgroundBlobs
