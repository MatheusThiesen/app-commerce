import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IoArrowBack } from "react-icons/io5";

interface DrawerListProps {
  title: string;

  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export function DrawerList({
  onClose,
  isOpen,
  children,
  title,
}: DrawerListProps) {
  return (
    <Drawer
      onClose={onClose}
      size={["full", "full", "full", "lg"]}
      isOpen={isOpen}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Stack>
            <Box>
              <Button variant="unstyled" onClick={onClose}>
                <Icon as={IoArrowBack} fontSize="1.8rem" />
              </Button>
            </Box>

            <Flex align="center" justify="center">
              <Text fontSize="2xl">{title}</Text>
            </Flex>
          </Stack>
        </DrawerHeader>

        <DrawerBody bg="gray.50" p="0">
          {children}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
