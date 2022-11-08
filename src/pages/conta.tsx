import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import { FaLock } from "react-icons/fa";
import { Input } from "../components/Form/Input";
import { InputFake } from "../components/Form/InputFake";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { setupAPIClient } from "../service/api";
import { withSSRAuth } from "../utils/withSSRAuth";

interface ContaProps {
  me: {
    id: string;
    email: string;
  };
}

export default function Conta(props: ContaProps) {
  const {
    isOpen: isOpenModalUpdatePassword,
    onOpen: onOpenModalUpdatePassword,
    onClose: onCloseModalUpdatePassword,
  } = useDisclosure();

  return (
    <>
      <Head>
        <title>Inicio - App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation isInativeEventScroll user={{ name: props.me.email }} />

      <Flex justify="center" pt="3rem" px="1.25rem">
        <Box bg="white" borderRadius="md" p="6" maxW="47.75rem" w="full">
          <Box>
            <Text as="h2" fontWeight="bold" fontSize="2xl">
              Minha conta
            </Text>
          </Box>

          <Stack spacing="4" mt="6">
            <InputFake label="E-mail" value={props.me?.email} />
            <InputFake
              label="Password"
              value="************"
              onUpdate={onOpenModalUpdatePassword}
            />
          </Stack>
        </Box>
        <Modal
          isCentered
          isOpen={isOpenModalUpdatePassword}
          onClose={onCloseModalUpdatePassword}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center" mt="4" fontSize="2xl">
              Alterar senha
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack>
                <Input
                  name="oldPassword"
                  placeholder="Senha atual"
                  iconLeft={FaLock}
                  isPassword
                />
                <Input
                  name="newPassword"
                  placeholder="Nova senha"
                  iconLeft={FaLock}
                  isPassword
                />
                <Input
                  name="confirmPassword"
                  placeholder="Confirmar senha"
                  iconLeft={FaLock}
                  isPassword
                />
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="solid"
                w="full"
                colorScheme="red"
                bg="red.500"
                size="lg"
              >
                Confirmar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
}

export const getServerSideProps = withSSRAuth<{}>(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/auth/me");

  return {
    props: {
      me: response.data,
    },
  };
});
