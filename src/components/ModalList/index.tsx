import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IoClose } from "react-icons/io5";

interface ModalListProps {
  title: string;
  placement?: "right" | "left";

  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export function ModalList({
  onClose,
  isOpen,
  children,
  title,
  placement = "right",
}: ModalListProps) {
  return (
    <Drawer onClose={onClose} size={"md"} isOpen={isOpen} placement={placement}>
      <DrawerOverlay backdropFilter="blur(5px)" />
      <DrawerContent>
        <DrawerHeader>
          <Stack>
            <Flex justify={placement === "right" ? "start" : "end"}>
              <Button variant="unstyled" onClick={onClose}>
                <Icon as={IoClose} fontSize="1.8rem" />
              </Button>
            </Flex>

            <Flex align="center" justify="center">
              <Text fontSize="2xl">{title}</Text>
            </Flex>
          </Stack>
        </DrawerHeader>

        <DrawerBody bg="gray.50" p="0">
          {children}
        </DrawerBody>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
