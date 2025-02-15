import {
  CLIENT_EMAILS_ACCEPT_STORE,
  SELLER_EMAILS_ACCEPT_STORE,
} from "@/global/parameters";

import { Button as ButtonUI } from "@/components/ui/button";

import { accessSsoPortal } from "@/hooks/accessSsoPortal";

import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import LinkNext from "next/link";
import Router from "next/router";
import { ReactNode, memo, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { useAuth } from "../../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
  isNotNavigation = false,
}: HeaderProps) {
  const { signOut, isAuthenticated, user } = useAuth();

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
            <Link href="/inicio" h="full">
              <Image
                h="full"
                objectFit="contain"
                src="/assets/logo-white.png"
              />
            </Link>
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
              <Link
                href="/produtos"
                as="span"
                h="full"
                display="flex"
                alignItems="center"
              >
                <Image
                  py="1"
                  h="70%"
                  objectFit="contain"
                  src="/assets/logo-white.png"
                />
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

                {!user.eCliente && <NavLink href="/clientes">Clientes</NavLink>}

                {((user.eCliente &&
                  CLIENT_EMAILS_ACCEPT_STORE.includes(user.email)) ||
                  (user.eVendedor &&
                    SELLER_EMAILS_ACCEPT_STORE.includes(user.email))) && (
                  <NavLink href="/pedidos">Pedidos</NavLink>
                )}
              </Stack>
            )}
          </Flex>

          <HStack justify="center" alignItems="center" h="full" py="0.5rem">
            <Flex
              flexDir="column"
              rowGap={"0.5rem"}
              align="flex-end"
              justify="center"
            >
              {user && !isNotNavigation && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ButtonUI variant="link" className="relative flex p-0 ">
                      <FaUser
                        className="text-white"
                        style={{ height: "1.8rem", width: "1.8rem" }}
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-bold ml-1 text-white uppercase leading-none">
                          {user?.nome}
                        </span>
                        <span className="text-sm font-light ml-1 text-white leading-none">
                          {user?.email}
                        </span>
                      </div>
                    </ButtonUI>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuGroup>
                      <Link href="/conta" _hover={{ textDecoration: "none" }}>
                        <LinkNext href="/conta">
                          <DropdownMenuItem>Minha conta</DropdownMenuItem>
                        </LinkNext>
                      </Link>
                      <DropdownMenuItem onClick={accessSsoPortal}>
                        Acessar Portal Alpar
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>Sair</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </Flex>

            <Box>{Right && Right}</Box>
          </HStack>
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
