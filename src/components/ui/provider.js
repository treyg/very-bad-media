import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/theme/system";
import { ColorModeProvider } from "./color-mode";

export function Provider({ children }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
