import { Flex, List, ListItem } from "@chakra-ui/react";
import { BsBoxSeam } from "react-icons/bs";
import { MainNavLink } from "./MainNavLink";

interface BottomNavigationPros {
  height: string;
}

export function BottomNavigation({ height }: BottomNavigationPros) {
  return (
    <Flex
      as="nav"
      justify="center"
      position="fixed"
      zIndex={10}
      boxShadow="dark-lg"
      bottom={0}
      left={0}
      w="full"
      h={height}
      bg="white"
      display={["flex", "flex", "flex", "none"]}
    >
      <Flex w="full" h="3.5rem" maxW="lg">
        <List
          px={"0.75rem"}
          w="full"
          display="flex"
          justifyContent="space-around"
          alignItems="center"
        >
          {/* <ListItem h="full">
            <NavLink href="/inicio" icon={IoHomeOutline}>
              Inicio
            </NavLink>
          </ListItem> */}
          {/* <ListItem h="full">
            <NavLink href="/clientes" icon={FiUsers}>
              Clientes
            </NavLink>
          </ListItem>
          <ListItem h="full">
            <MainNavLink href="/pedidos" icon={IoBagHandleOutline}>
              Pedidos
            </MainNavLink>
          </ListItem> */}
          <ListItem h="full">
            <MainNavLink href="/produtos" icon={BsBoxSeam}>
              Produtos
            </MainNavLink>
          </ListItem>
          {/* <ListItem h="full">
            <NavLink href="/produtos" icon={BsBoxSeam}>
              Produtos
            </NavLink>
          </ListItem> */}
          {/* <ListItem h="full">
            <NavLink href="/mais" icon={BiDotsHorizontalRounded}>
              mais
            </NavLink>
          </ListItem> */}
        </List>
      </Flex>
    </Flex>
  );
}
