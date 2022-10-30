import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Link as CharkraLink,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import Router from "next/router";
import { memo, ReactNode, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { useAuth } from "../../contexts/AuthContext";
import { DrawerMenu } from "./DrawerMenu";

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
}: HeaderProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { signOut } = useAuth();

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  if (!Left && isGoBack) {
    Left = (
      <Flex ml="4" align="center">
        <Button
          p="0"
          bg="transparent"
          d="flex"
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
      if (window.scrollY === 0) {
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
      <DrawerMenu isOpen={isOpen} onClose={onClose} />
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
          <Button
            display={["none", "none", "none", "flex"]}
            variant="unstyled"
            onClick={onOpen}
          >
            <Flex align="center" justify="center">
              <IoMenu color="white" fontSize="32" />
              <Text color="white" ml="2">
                Menu
              </Text>
            </Flex>
          </Button>

          <Flex flex={1}>{Left && Left}</Flex>
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
      >
        <Flex
          bg="red.500"
          w="full"
          h="full"
          py="2"
          justifyContent="space-between"
          align="center"
          px={["30"]}
        >
          <Button variant="unstyled" onClick={onOpen}>
            <Flex align="center" justify="center">
              <IoMenu color="white" fontSize="32" />
              <Text color="white" ml="2">
                Menu
              </Text>
            </Flex>
          </Button>

          <Link href=" /inicio">
            <CharkraLink h="full">
              <Image
                h="full"
                objectFit="contain"
                src="/assets/logo-white.png"
              />
            </CharkraLink>
          </Link>

          <Menu>
            <MenuButton>
              <Flex align={"center"}>
                <Avatar size="md" name="Matheus Thiesen" bg="white" />
                <Text fontSize="sm" fontWeight="bold" ml="2" color="white">
                  Matheus Thiesen
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
        </Flex>
      </Flex>
    </>
  );
}

export const HeaderNavigation = memo(HeaderNavigationComponent);
