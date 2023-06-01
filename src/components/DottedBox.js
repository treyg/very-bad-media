import { Box, useColorModeValue } from '@chakra-ui/react'

function DottedBox({ ...props }) {
  return (
    <Box
      {...props}
      height="auto"
      bottom={0}
      right="0"
      width="30vw"
      zIndex={1}
      maxW="900px"
    >
      <svg
        color={useColorModeValue('rgba(55,65,81, 0.1)', 'rgba(55,65,81, 0.7)')}
        width="100%"
        height="100%"
        fill="none"
      >
        <defs>
          <pattern
            id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)"
        ></rect>
      </svg>
    </Box>
  )
}

export default DottedBox
