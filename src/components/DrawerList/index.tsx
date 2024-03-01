import {
  Box,
  Button,
  Drawer,
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
      size={["full", "full", "full", "xl"]}
      isOpen={isOpen}
      placement="right"
    >
      <DrawerOverlay backdropFilter="blur(5px)" />
      <DrawerContent>
        <DrawerHeader borderBottom={"1px"} borderColor="#ccc">
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

        {children}
      </DrawerContent>
    </Drawer>
  );
}
