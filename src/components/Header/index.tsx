import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

interface HeaderProps {
  children: ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <Flex
      as="header"
      h="3.5rem"
      bg="red.500"
      px="2"
      alignItems="center"
      boxShadow="2xl"
    >
      {children}
    </Flex>
  );
}
