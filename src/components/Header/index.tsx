import { Box, Flex, Image } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";

interface HeaderProps {
  inativeEventScroll?: boolean;
  children?: ReactNode;
  childrenSizeY?: number;
  headerSizeY?: number;

  getHeaderY?: (set: () => string) => void;
}

export function Header({
  inativeEventScroll = false,
  children,
  childrenSizeY = 0,
  headerSizeY = 3.5,
  getHeaderY,
}: HeaderProps) {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
      <Flex bg="red.500" w="full" h="full" py="2" justifyContent="center">
        <Image h="full" objectFit="contain" src="/assets/logo-white.png" />
      </Flex>
      <Box>{children}</Box>
    </Flex>
  );
}
