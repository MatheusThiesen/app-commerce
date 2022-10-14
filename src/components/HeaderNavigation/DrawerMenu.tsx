import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Link as CharkraLink,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { memo } from "react";
import { IoClose } from "react-icons/io5";

interface DrawerMenuProps {
  onClose(): void;
  isOpen: boolean;
}

export function DrawerMenuComponent({ isOpen, onClose }: DrawerMenuProps) {
  const options = [
    {
      name: "INICIO",
      path: "inicio",
    },
    {
      name: "PRODUTOS",
      path: "produtos",
    },
    {
      name: "MAIS",
      path: "mais",
    },
  ];

  return (
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
            {options.map(({ name, path }) => (
              <ListItem key={path} onClick={onClose}>
                <CharkraLink fontWeight="bold">
                  <Link href={`/${path}`}>{name}</Link>
                </CharkraLink>
              </ListItem>
            ))}
          </List>
          <Box></Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export const DrawerMenu = memo(DrawerMenuComponent);
