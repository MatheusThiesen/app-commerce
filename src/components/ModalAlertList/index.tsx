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
import { X } from "lucide-react";
import { ReactNode } from "react";

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
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent>
        <ModalHeader>
          <Stack>
            <Flex justify="end">
              <Button variant="unstyled" onClick={onClose}>
                <Icon as={X} fontSize="1.8rem" />
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
