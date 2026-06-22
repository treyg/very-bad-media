import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// Custom palette carried over from the old v2 theme. Tokens keep their original
// dotted names (light.primary, dark.backgroundColor, ...) so existing
// useColorModeValue('light.primary', 'dark.primary') calls keep resolving.
const palette = {
  light: {
    primary: { value: "#34d399" },
    secondary: { value: "#a855f7" },
    accent: { value: "#1FB2A5" },
    neutral: { value: "#191D24" },
    info: { value: "#3ABFF8" },
    success: { value: "#36D399" },
    warning: { value: "#FBBD23" },
    error: { value: "#e11d48" },
    backgroundColor: { value: "#ffffff" },
    heading: { value: "#1f2937" },
    text: { value: "#8795a8" },
  },
  dark: {
    primary: { value: "#34d399" },
    secondary: { value: "#a855f7" },
    accent: { value: "#1FB2A5" },
    neutral: { value: "#191D24" },
    info: { value: "#3ABFF8" },
    success: { value: "#36D399" },
    warning: { value: "#FBBD23" },
    error: { value: "#e11d48" },
    backgroundColor: { value: "#0f172a" },
    heading: { value: "#ffffff" },
    text: { value: "#8795a8" },
  },
};

const config = defineConfig({
  theme: {
    tokens: { colors: palette },
  },
  globalCss: {
    "html, body": { margin: 0, padding: 0 },
    body: {
      bg: { base: "{colors.light.backgroundColor}", _dark: "{colors.dark.backgroundColor}" },
      color: { base: "{colors.light.text}", _dark: "{colors.dark.text}" },
    },
  },
});

export const system = createSystem(defaultConfig, config);
