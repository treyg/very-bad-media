import Image from "next/image";
import NextLink from "next/link";
import NAV_ITEMS from "@/data/NavItems";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Link,
  Menu,
  Portal,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { LuMenu, LuX, LuChevronDown, LuSun, LuMoon } from "react-icons/lu";

export default function WithSubnavigation() {
  const { open, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const logoSrc = colorMode === "dark" ? "/logo-dark.svg" : "/logo-light.svg";

  const backgroundColor = useColorModeValue(
    "light.backgroundColor",
    "dark.backgroundColor"
  );
  const borderColor = useColorModeValue("gray.200", "gray.900");
  const textColor = useColorModeValue("gray.600", "white");
  const logoAlign = useBreakpointValue({ base: "center", md: "left" });

  return (
    <Box>
      <Flex
        bg={backgroundColor}
        color={textColor}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={"1px solid"}
        borderColor={borderColor}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          >
            {open ? <LuX /> : <LuMenu />}
          </IconButton>
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
          align="center"
        >
          <Text textAlign={logoAlign} fontFamily={"heading"}>
            <NextLink href="/">
              <Image src={logoSrc} alt="Logo" width={50} height={50} />
            </NextLink>
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack flex={{ base: 1, md: 0 }} justify={"flex-end"} direction={"row"} gap={6}>
          <IconButton
            aria-label="Toggle color mode"
            onClick={toggleColorMode}
            variant="ghost"
          >
            {colorMode === "light" ? <LuMoon /> : <LuSun />}
          </IconButton>
        </Stack>
      </Flex>

      {open && <MobileNav />}
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const menuBg = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} gap={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          {navItem.children ? (
            <Menu.Root positioning={{ placement: "bottom-start" }}>
              <Menu.Trigger asChild>
                <Link
                  p={2}
                  fontSize={"sm"}
                  fontWeight={500}
                  color={linkColor}
                  display="inline-flex"
                  alignItems="center"
                  gap={1}
                  _hover={{ textDecoration: "none", color: linkHoverColor }}
                >
                  {navItem.label}
                  <LuChevronDown />
                </Link>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content bg={menuBg} boxShadow="xl" rounded="xl" p={2} minW="sm">
                    {navItem.children.map((child) => (
                      <Menu.Item key={child.label} value={child.href} asChild>
                        <NextLink href={child.href}>
                          <Box>
                            <Text fontWeight={500}>{child.label}</Text>
                            {child.subLabel && (
                              <Text fontSize={"sm"}>{child.subLabel}</Text>
                            )}
                          </Box>
                        </NextLink>
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          ) : (
            <Link
              asChild
              p={2}
              fontSize={"sm"}
              fontWeight={500}
              color={linkColor}
              _hover={{ textDecoration: "none", color: linkHoverColor }}
            >
              <NextLink href={navItem.href ?? "#"}>{navItem.label}</NextLink>
            </Link>
          )}
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Stack bg={bg} p={4} display={{ md: "none" }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { open, onToggle } = useDisclosure();
  const textColor = useColorModeValue("gray.600", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Stack gap={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={children ? "div" : NextLink}
        href={children ? undefined : href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{ textDecoration: "none" }}
      >
        <Text fontWeight={600} color={textColor}>
          {label}
        </Text>
        {children && (
          <Box
            transition={"all .25s ease-in-out"}
            transform={open ? "rotate(180deg)" : ""}
          >
            <LuChevronDown />
          </Box>
        )}
      </Flex>

      {open && children && (
        <Stack
          mt={2}
          pl={4}
          borderLeft={"1px solid"}
          borderColor={borderColor}
          align={"start"}
        >
          {children.map((child) => (
            <Link key={child.label} asChild py={2}>
              <NextLink href={child.href}>{child.label}</NextLink>
            </Link>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
