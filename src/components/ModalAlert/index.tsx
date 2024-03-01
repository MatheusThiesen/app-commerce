import {
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
import { IconType } from "react-icons";
import { IoClose } from "react-icons/io5";

interface ModalAlertProps {
  data: {
    title: string;
    Icon: IconType;
  };

  isOpen: boolean;
  onClose: () => void;

  confirmOptions?: {
    onClose: () => void;
    onConfirm: () => void;

    titleButtonClose: string;
    titleButtonConfirm: string;
  };
}

export function ModalAlert({
  onClose,
  isOpen,
  data,
  confirmOptions,
}: ModalAlertProps) {
  return (
    <Modal
      onClose={onClose}
      size={["3xl"]}
      isOpen={isOpen}
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent>
        <ModalHeader>
          <Stack>
            <Flex justify="end">
              <Button variant="unstyled" onClick={onClose}>
                <Icon as={IoClose} fontSize="5xl" />
              </Button>
            </Flex>
          </Stack>
        </ModalHeader>

        <ModalBody bg="white" px="8" pb="8" borderRadius="md">
          <Stack align="center" justify="center">
            <Icon as={data.Icon} fontSize="9xl" color="gray.700" mb="4" />
            <Text
              fontSize={["2xl", "2xl", "2xl", "2xl"]}
              fontWeight="light"
              color="gray.600"
              textAlign="center"
              px={["4", "12", "24", "24"]}
            >
              {data.title}
            </Text>
          </Stack>
        </ModalBody>

        {confirmOptions && (
          <ModalFooter justifyContent="center" mb="10">
            <Button size="lg" mr={"2"} onClick={confirmOptions.onClose}>
              {confirmOptions.titleButtonClose}
            </Button>
            <Button
              size="lg"
              bg="primary"
              colorScheme="red"
              _hover={{ bg: "primary.hover" }}
              onClick={confirmOptions.onConfirm}
            >
              {confirmOptions.titleButtonConfirm}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
