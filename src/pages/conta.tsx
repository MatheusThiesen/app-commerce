import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import Head from "next/head";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import * as Yup from "yup";
import { Input } from "../components/Form/Input";
import { InputFake } from "../components/Form/InputFake";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { regexHelper } from "../helpers/regex";
import { setupAPIClient } from "../service/api";
import { api } from "../service/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

interface ContaProps {
  me: {
    id: string;
    email: string;
  };
}

interface ChangePasswordProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const changePasswordFormSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Senha atual é obrigatório"),
  newPassword: Yup.string()
    .matches(
      regexHelper.password,
      "A senha precisa conter letras e números, no mínimo 8 caracteres, uma letras maiúscula e um carácter especial."
    )
    .required("nova senha é obrigatório"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "As senhas precisam ser iguais ")
    .required("Confirmação de senha é obrigatório"),
});

export default function Conta(props: ContaProps) {
  const {
    isOpen: isOpenModalUpdatePassword,
    onOpen: onOpenModalUpdatePassword,
    onClose: onCloseModalUpdatePassword,
  } = useDisclosure();

  const toast = useToast();

  const { register, handleSubmit, formState, setError, reset } = useForm({
    resolver: yupResolver(changePasswordFormSchema),
  });
  const { errors } = formState;
  const HandleChangePassword: SubmitHandler<ChangePasswordProps> = async (
    data
  ) => {
    try {
      await api.post("/auth/password", {
        antigaSenha: data.oldPassword,
        senha: data.newPassword,
      });

      reset();
      onCloseModalUpdatePassword();

      return toast({
        title: "Senha alterada",
        status: "success",
        position: "top",
        isClosable: true,
      });
    } catch (err) {
      const error = err as AxiosError;

      if (
        error.response?.status === 400 &&
        error.response?.data?.message === "Senha atual não corresponde"
      ) {
        setError(
          "oldPassword",
          { message: error.response?.data?.message },
          {
            shouldFocus: true,
          }
        );
        return toast({
          title: error.response?.data?.message,
          status: "warning",
          position: "top",
          isClosable: true,
        });
      }
      return toast({
        title: "Desculpe, ocorreu um erro interno, Tente novamente mais tarde",
        status: "error",
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Conta - App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isInativeEventScroll
        user={{ name: props.me.email }}
        title="Conta"
        isGoBack
      />

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
              <Box
                as="form"
                onSubmit={handleSubmit(HandleChangePassword as any)}
              >
                <Stack>
                  <Input
                    placeholder="Senha atual"
                    iconLeft={FaLock}
                    isPassword
                    {...register("oldPassword")}
                    error={
                      !!errors?.oldPassword
                        ? String(errors?.oldPassword.message)
                        : undefined
                    }
                  />
                  <Input
                    placeholder="Nova senha"
                    iconLeft={FaLock}
                    isPassword
                    {...register("newPassword")}
                    error={
                      !!errors?.newPassword
                        ? String(errors?.newPassword.message)
                        : undefined
                    }
                  />
                  <Input
                    placeholder="Confirmar senha"
                    iconLeft={FaLock}
                    isPassword
                    {...register("confirmPassword")}
                    error={
                      !!errors?.confirmPassword
                        ? String(errors?.confirmPassword.message)
                        : undefined
                    }
                  />
                </Stack>

                <Button
                  variant="solid"
                  w="full"
                  colorScheme="red"
                  bg="red.500"
                  size="lg"
                  mt="6"
                  mb="4"
                  type="submit"
                >
                  Confirmar
                </Button>
              </Box>
            </ModalBody>
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
