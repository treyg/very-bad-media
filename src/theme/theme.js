import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false
  },
  colors: {
    light: {
      primary: '#34d399',
      secondary: '#a855f7',
      accent: '#1FB2A5',
      neutral: '#191D24',
      info: '#3ABFF8',
      success: '#36D399',
      warning: '#FBBD23',
      error: '#e11d48',
      backgroundColor: '#fff',
      heading: '#1f2937',
      text: '#8795a8'
    },
    dark: {
      heading: '#fff',
      text: '#8795a8',
      primary: '#34d399',
      secondary: '#a855f7',
      accent: '#1FB2A5',
      neutral: '#191D24',
      info: '#3ABFF8',
      success: '#36D399',
      warning: '#FBBD23',
      error: '#e11d48',
      backgroundColor: '#0f172a'
    }
  },
  styles: {
    global: ({ colorMode }) => ({
      body: {
        backgroundColor:
          colorMode === 'light' ? 'light.backgroundColor' : 'dark.backgroundColor'
      }
    })
  }
})

export default theme
