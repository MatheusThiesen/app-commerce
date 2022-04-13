import { Flex, List, ListItem } from "@chakra-ui/react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { IoBagHandleOutline, IoHomeOutline } from "react-icons/io5";
import { MainNavLink } from "./MainNavLink";
import { NavLink } from "./NavLink";

export function BottonNavigation() {
  return (
    <Flex
      as="nav"
      justify="center"
      position="fixed"
      boxShadow="dark-lg"
      bottom={0}
      left={0}
      w="full"
      h="3.5rem"
      bg="white"
    >
      <Flex w="full" h="3.5rem" maxW="lg">
        <List
          px={"0.75rem"}
          w="full"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <ListItem h="full">
            <NavLink href="/inicio" icon={IoHomeOutline}>
              Inicio
            </NavLink>
          </ListItem>
          <ListItem h="full">
            <NavLink href="/clientes" icon={FiUsers}>
              Clientes
            </NavLink>
          </ListItem>
          <ListItem h="full">
            <MainNavLink href="/pedidos" icon={IoBagHandleOutline}>
              Pedidos
            </MainNavLink>
          </ListItem>
          <ListItem h="full">
            <NavLink href="/produtos" icon={BsBoxSeam}>
              Produtos
            </NavLink>
          </ListItem>
          <ListItem h="full">
            <NavLink href="/clientes" icon={BiDotsHorizontalRounded}>
              mais
            </NavLink>
          </ListItem>
        </List>
      </Flex>
    </Flex>
  );
}
