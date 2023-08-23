import {
  Avatar,
  Box,
  Button,
  Link as CharkraLink,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import Router from "next/router";
import { ReactNode, memo, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "./NavLink";

export interface HeaderProps {
  isInativeEventScroll?: boolean;
  isNotHideHeaderEventScroll?: boolean;
  isGoBack?: boolean;

  content?: ReactNode;
  contentHeight?: number;

  title?: string;
  height?: number;

  Left?: ReactNode;
  Right?: ReactNode;

  user?: {
    name: string;
  };
}

export function HeaderNavigationComponent({
  title,
  Left,
  Right,
  content,
  contentHeight = 0,
  height = 3.5,
  isInativeEventScroll = false,
  isNotHideHeaderEventScroll = false,
  isGoBack = false,
  user,
}: HeaderProps) {
  const { signOut, isAuthenticated } = useAuth();

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  if (!Left && isGoBack) {
    Left = (
      <Flex ml="4" align="center">
        <Button
          p="0"
          bg="transparent"
          display="flex"
          _hover={{ bg: "transparent" }}
          alignItems="center"
          justifyContent="center"
          onClick={() => Router.back()}
        >
          <IoIosArrowBack color="white" fontSize={"1.8rem"} />
          <Text color="white">Voltar</Text>
        </Button>
      </Flex>
    );
  }

  const headerSize = `${height + contentHeight}rem`;

  const controlNavbar = () => {
    if (typeof window !== "undefined" && !isInativeEventScroll) {
      if (window.scrollY <= 100) {
        setShow(true);
      } else {
        if (window.scrollY > lastScrollY) {
          setShow(false);
        } else {
          setShow(true);
        }
      }

      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (!isNotHideHeaderEventScroll) {
      if (typeof window !== "undefined") {
        window.addEventListener("scroll", controlNavbar);

        return () => {
          window.removeEventListener("scroll", controlNavbar);
        };
      }
    }
  }, [lastScrollY, isNotHideHeaderEventScroll]);

  return (
    <>
      {/* MOBILE */}
      <Flex
        as="header"
        zIndex={10}
        h={headerSize}
        w="full"
        alignItems="center"
        boxShadow={show ? "xl" : "none"}
        position={isInativeEventScroll ? undefined : "fixed"}
        transition="transform 0.2s"
        transform={
          show ? "translateY(0)" : `translateY(calc(${headerSize} * -1))`
        }
        flexDir="column"
        display={["flex", "flex", "flex", "none"]}
      >
        <Flex
          bg="red.500"
          w="full"
          h={`${height}rem`}
          py="2"
          justifyContent="space-between"
          align="center"
          px={["0", "0", "0", "30"]}
        >
          <Flex flex={1} align="center">
            {Left && Left}
          </Flex>
          {title ? (
            <Text color="white" fontSize={"medium"} fontWeight="bold">
              {title}
            </Text>
          ) : (
            <CharkraLink h="full">
              <Link href="/inicio">
                <Image
                  h="full"
                  objectFit="contain"
                  src="/assets/logo-white.png"
                />
              </Link>
            </CharkraLink>
          )}

          <Flex flex={1} align="flex-end" justify="flex-end">
            {Right && Right}
          </Flex>
        </Flex>

        {content && (
          <Box w="full" h="calc(100% - 3.5rem)">
            {content}
          </Box>
        )}
      </Flex>

      {/* WEB */}
      <Flex
        as="header"
        zIndex={10}
        h={`${height + 1}rem`}
        w="full"
        alignItems="center"
        boxShadow={show ? "2xl" : "none"}
        position={isInativeEventScroll ? undefined : "fixed"}
        transition="all 0.2s"
        transform={
          show ? "translateY(0)" : `translateY(calc(${height + 1}rem * -1))`
        }
        flexDir="column"
        display={["none", "none", "none", "flex"]}
        bg="red.500"
      >
        <Flex
          w="full"
          h="full"
          justifyContent="space-between"
          align="center"
          px={["30"]}
          maxW="1120px"
        >
          {isAuthenticated ? (
            <Link href="/produtos" passHref>
              <CharkraLink h="full">
                <Image
                  py="1"
                  h="full"
                  objectFit="contain"
                  src="/assets/logo-white.png"
                />
              </CharkraLink>
            </Link>
          ) : (
            <Image
              py="1"
              h="full"
              objectFit="contain"
              src="/assets/logo-white.png"
            />
          )}

          {isAuthenticated && (
            <Stack direction="row" h="full" spacing="10">
              {/* <NavLink href="/inicio">Início</NavLink> */}
              <NavLink href="/produtos">Produtos</NavLink>
              <NavLink href="/clientes">Clientes</NavLink>
              <NavLink href="/pedidos">Pedidos</NavLink>
            </Stack>
          )}

          {user && (
            <Menu>
              <MenuButton>
                <Flex align={"center"}>
                  <Avatar size="md" name={user?.name} bg="white" />
                  <Text fontSize="sm" fontWeight="bold" ml="2" color="white">
                    {user?.name}
                  </Text>
                </Flex>
              </MenuButton>
              <MenuList zIndex="1000">
                <MenuGroup title="Perfil">
                  <MenuItem>
                    <Link href="/conta" passHref>
                      <CharkraLink _hover={{ textDecoration: "none" }}>
                        Minha conta
                      </CharkraLink>
                    </Link>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={signOut}>Sair </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>
    </>
  );
}

export const HeaderNavigation = memo(HeaderNavigationComponent);
