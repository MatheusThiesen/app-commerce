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
  onGoBack?: () => void;

  content?: ReactNode;
  contentHeight?: number;

  title?: string;
  height?: number;

  Left?: ReactNode;
  Right?: ReactNode;
  Center?: ReactNode;

  user?: {
    name: string;
  };
  isNotNavigation?: boolean;
}

export function HeaderNavigationComponent({
  title,
  Left,
  Right,
  Center,
  content,
  contentHeight = 0,
  height = 3.5,
  isInativeEventScroll = false,
  isNotHideHeaderEventScroll = false,
  isGoBack = false,
  onGoBack,
  user,
  isNotNavigation = false,
}: HeaderProps) {
  const { signOut, isAuthenticated, user: userAuth } = useAuth();

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  if (!Left && (isGoBack || onGoBack)) {
    Left = (
      <Flex ml="4" align="center" display={["flex", "flex", "flex", "none"]}>
        <Button
          p="0"
          bg="transparent"
          display="flex"
          _hover={{ bg: "transparent" }}
          alignItems="center"
          justifyContent="center"
          onClick={() => (onGoBack ? onGoBack() : Router.back())}
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
          bg="primary"
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

          {Center ? (
            Center
          ) : title ? (
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
        h={`${height + 2.6}rem`}
        w="full"
        alignItems="center"
        boxShadow={show ? "2xl" : "none"}
        position={isInativeEventScroll ? undefined : "fixed"}
        transition="all 0.2s"
        transform={
          show
            ? "translateY(0)"
            : `translateY(calc(${height + contentHeight + 2.6}rem * -1))`
        }
        flexDir="column"
        display={["none", "none", "none", "flex"]}
        bg="primary"
      >
        <Flex
          w="full"
          h="full"
          justifyContent="space-between"
          align="center"
          px={["0.5rem"]}
          maxW="1200px"
        >
          <Flex align="center" h="full">
            {Left && Left}
            {isAuthenticated && !isNotNavigation ? (
              <Link href="/produtos" passHref>
                <CharkraLink h="full" display="flex" alignItems="center">
                  <Image
                    py="1"
                    h="70%"
                    objectFit="contain"
                    src="/assets/logo-white.png"
                  />
                </CharkraLink>
              </Link>
            ) : (
              <Image
                py="1"
                h="70%"
                objectFit="contain"
                src="/assets/logo-white.png"
              />
            )}
          </Flex>

          <Flex flexDir="column" rowGap="0.6rem" flex={1} px="2rem">
            {Center && Center}

            {isAuthenticated && !isNotNavigation && (
              <Stack direction="row" h="full" spacing="10">
                <NavLink href="/inicio">Inicio</NavLink>
                <NavLink href="/produtos">Produtos</NavLink>
                <NavLink href="/clientes">Clientes</NavLink>
                {userAuth?.eVendedor &&
                  [
                    "amanda.medeiros@alpardobrasil.com.br",
                    "rardy.maciel@alpardobrasil.com.br",
                    "yasmin.santos@alpardobrasil.com.br",
                    "vanessa.rodrigues@alpardobrasil.com.br",
                    "mariana.fonseca@alpardobrasil.com.br",
                    "lucas.machado@alpardobrasil.com.br",
                    "matheus.thiesen@alpardobrasil.com.br",
                    "joaoo@alpardobrasil.com.br",
                    "vinicius@alpardobrasil.com.br",
                    "fernando@alpardobrasil.com.br",
                    "bruna.anjos@alpardobrasil.com.br",
                    "diulia.abbott@alpardobrasil.com.br",
                  ].includes(userAuth.email) && (
                    <NavLink href="/pedidos">Pedidos</NavLink>
                  )}
              </Stack>
            )}
          </Flex>

          <Flex
            flexDir="column"
            rowGap={"0.5rem"}
            align="flex-end"
            justify="center"
            h="full"
            py="0.5rem"
          >
            <Box>{Right && Right}</Box>

            {user && !isNotNavigation && (
              <Menu>
                <MenuButton>
                  <Flex align={"center"}>
                    <Avatar size="sm" name={user?.name} bg="white" />
                    <Text
                      fontSize="smaller"
                      fontWeight="bold"
                      ml="2"
                      color="white"
                    >
                      {user?.name}
                    </Text>
                  </Flex>
                </MenuButton>
                <MenuList zIndex="9999">
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

        {content && (
          <Box w="full" h="calc(100% - 3.5rem)">
            {content}
          </Box>
        )}
      </Flex>
    </>
  );
}

export const HeaderNavigation = memo(HeaderNavigationComponent);
