import {
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IoArrowForward } from "react-icons/io5";

interface ModalAlertListProps {
  title: string;

  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export function ModalAlertList({
  onClose,
  isOpen,
  children,
  title,
}: ModalAlertListProps) {
  return (
    <Modal
      onClose={onClose}
      size={["full", "full", "full", "4xl"]}
      isOpen={isOpen}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Stack>
            <Flex justify="end">
              <Button variant="unstyled" onClick={onClose}>
                <Icon as={IoArrowForward} fontSize="1.8rem" />
              </Button>
            </Flex>

            <Flex align="center" justify="center">
              <Text fontSize="2xl">{title}</Text>
            </Flex>
          </Stack>
        </ModalHeader>

        <ModalBody bg="gray.50" p="0">
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
