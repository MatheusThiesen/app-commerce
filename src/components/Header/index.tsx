import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import Router from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

interface HeaderProps {
  inativeEventScroll?: boolean;
  children?: ReactNode;
  childrenSizeY?: number;
  headerSizeY?: number;

  Left?: ReactNode;
  Right?: ReactNode;
  isGoBack?: boolean;

  getHeaderY?: (set: () => string) => void;
}

export function Header({
  children,
  getHeaderY,
  Left,
  Right,
  inativeEventScroll = false,
  childrenSizeY = 0,
  headerSizeY = 3.5,
  isGoBack = false,
}: HeaderProps) {
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

  const headerSize = `${headerSizeY + childrenSizeY}rem`;

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
    if (getHeaderY) getHeaderY(() => headerSize);
  }, []);

  return (
    <Flex
      as="header"
      h={headerSize}
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
        h={`${headerSizeY}rem`}
        py="2"
        justifyContent="space-between"
        align="center"
      >
        <Flex flex={1}>{Left && Left}</Flex>
        <Image h="full" objectFit="contain" src="/assets/logo-white.png" />
        <Flex flex={1} align="flex-end" justify="flex-end">
          {Right && Right}
        </Flex>
      </Flex>
      <Box w="full" h="full">
        {children}
      </Box>
    </Flex>
  );
}
