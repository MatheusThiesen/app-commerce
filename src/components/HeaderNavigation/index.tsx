import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Link as CharkraLink,
  List,
  ListItem,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import Router from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose, IoMenu } from "react-icons/io5";

interface HeaderProps {
  inativeEventScroll?: boolean;
  children?: ReactNode;
  childrenSizeY?: number;

  // headerSizeY?: number;

  Left?: ReactNode;
  Right?: ReactNode;
  isGoBack?: boolean;

  title?: string;

  getHeaderY?: (set: () => string) => void;
}

export function HeaderNavigation({
  children,
  getHeaderY,
  Left,
  Right,
  title,
  inativeEventScroll = false,
  childrenSizeY = 0,
  // headerSizeY = 3.5,
  isGoBack = false,
}: HeaderProps) {
  const mobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const headerSize = `${3.5 + childrenSizeY}rem`;

  const controlNavbar = () => {
    if (typeof window !== "undefined" && !inativeEventScroll) {
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
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (getHeaderY) getHeaderY(() => (mobile ? headerSize : "4rem"));
  }, []);

  return (
    <>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex justify={"space-between"} align="center">
              <Flex align={"center"}>
                <Avatar size="md" name="Matheus Thiesen" />
                <Text fontSize="sm" ml="2">
                  Matheus Thiesen
                </Text>
              </Flex>

              <Box
                _hover={{
                  cursor: "pointer",
                }}
                onClick={onClose}
              >
                <IoClose size={26} />
              </Box>
            </Flex>
          </DrawerHeader>
          <DrawerBody mt="6">
            <List spacing="2">
              <ListItem>
                <CharkraLink fontWeight="bold">
                  <Link href="/inicio">INICIO</Link>
                </CharkraLink>
              </ListItem>
              <ListItem>
                <CharkraLink fontWeight="bold">
                  <Link href="/produtos">PRODUTOS</Link>
                </CharkraLink>
              </ListItem>
              <ListItem>
                <CharkraLink fontWeight="bold">
                  <Link href="/mais">MAIS</Link>
                </CharkraLink>
              </ListItem>
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Flex
        as="header"
        zIndex={10}
        h={mobile ? headerSize : "4rem"}
        w="full"
        alignItems="center"
        boxShadow={show ? "xl" : "none"}
        position={inativeEventScroll ? undefined : "fixed"}
        transition="transform 0.2s"
        transform={
          show ? "translateY(0)" : `translateY(calc(${headerSize} * -1))`
        }
        flexDir="column"
      >
        <Flex
          bg="red.500"
          w="full"
          h={mobile ? "3.5rem" : "full"}
          py="2"
          justifyContent="space-between"
          align="center"
          px={["0", "0", "0", "30"]}
        >
          <Flex flex={1}>
            {mobile ? (
              Left && Left
            ) : (
              <Button variant="unstyled" onClick={onOpen}>
                <Flex align="center" justify="center">
                  <IoMenu color="white" fontSize="32" />
                  <Text color="white" ml="2">
                    Menu
                  </Text>
                </Flex>
              </Button>
            )}
          </Flex>
          {title && mobile ? (
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
            {Right && mobile && Right}
          </Flex>
        </Flex>

        {children && mobile && (
          <Box w="full" h="calc(100% - 3.5rem)">
            {children}
          </Box>
        )}
      </Flex>
    </>
  );
}
