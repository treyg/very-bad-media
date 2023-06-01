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
  },
  components: {
    Box: {
      overrides: {
        global: {
          margin: 0 // Set the desired margin value here
        }
      }
    }
  }
  //   space: {
  //     sm: '8px',
  //     md: '16px',
  //     lg: '24px',
  //     xl: '48px',
  //     '2xl': '96px',
  //     '3xl': '144px',
  //     '4xl': '192px',
  //     '5xl': '240px',
  //     '6xl': '288px',

  //     '1/2': '50%',
  //     '1/3': '33.333333%',
  //     '2/3': '66.666667%',
  //     '1/4': '25%',
  //     '2/4': '50%',
  //     '3/4': '75%',
  //     '1/5': '20%',
  //     '2/5': '40%',
  //     '3/5': '60%',
  //     '4/5': '80%',
  //     '1/6': '16.666667%',
  //     '2/6': '33.333333%'
  //   }
})

export default theme
