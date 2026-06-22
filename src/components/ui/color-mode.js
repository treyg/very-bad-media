// Color-mode shim for Chakra UI v3, which delegates light/dark to next-themes.
// Re-exports the v2-style hooks so existing components only change their import.
import { ThemeProvider, useTheme } from "next-themes";

export function ColorModeProvider(props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    />
  );
}

// `resolvedTheme` is undefined until next-themes resolves in an effect. Fall
// back to the app default (dark) so server render, first client render, and the
// CSS `_dark` default all agree — avoiding a white-on-dark flash.
export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const colorMode = resolvedTheme ?? "dark";
  const toggleColorMode = () =>
    setTheme(colorMode === "dark" ? "light" : "dark");
  return { colorMode, setColorMode: setTheme, toggleColorMode };
}

export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}
