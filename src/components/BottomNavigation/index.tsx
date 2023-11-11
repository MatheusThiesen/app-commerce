import { Flex, List, ListItem } from "@chakra-ui/react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { IoBagHandleOutline, IoHomeOutline } from "react-icons/io5";
import { useAuth } from "../../contexts/AuthContext";
import { MainNavLink } from "./MainNavLink";
import { NavLink } from "./NavLink";

interface BottomNavigationPros {
  height: string;
}

export function BottomNavigation({ height }: BottomNavigationPros) {
  const { user } = useAuth();

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

          {user?.eVendedor &&
            user.email === "matheus.thiesen@alpardobrasil.com.br" && (
              <ListItem h="full">
                <MainNavLink href="/pedidos" icon={IoBagHandleOutline}>
                  Pedidos
                </MainNavLink>
              </ListItem>
            )}

          <ListItem h="full">
            <NavLink href="/produtos" icon={BsBoxSeam}>
              Produtos
            </NavLink>
          </ListItem>
          <ListItem h="full">
            <NavLink href="/mais" icon={BiDotsHorizontalRounded}>
              mais
            </NavLink>
          </ListItem>
        </List>
      </Flex>
    </Flex>
  );
}
