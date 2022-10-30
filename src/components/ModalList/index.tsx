import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IoArrowBack } from "react-icons/io5";

interface ModalListProps {
  title: string;

  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export function ModalList({
  onClose,
  isOpen,
  children,
  title,
}: ModalListProps) {
  return (
    <Modal
      onClose={onClose}
      size={"full"}
      isOpen={isOpen}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
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
        </ModalHeader>

        <ModalBody bg="gray.50" p="0">
          {children}
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
