import {
  Box,
  Button,
  Center,
  Flex,
  Link as ChakraLink,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import { yupResolver } from "@hookform/resolvers/yup";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import * as Yup from "yup";
import { Input } from "../components/Form/Input";
import { useAuth } from "../contexts/AuthContext";
import { regexHelper } from "../helpers/regex";
import { withSSRGuest } from "../utils/withSSRGuest";

type ResetFormData = {
  newPassword: string;
  confirmPassword: string;
};

const ResetFormSchema = Yup.object().shape({
  newPassword: Yup.string()
    .matches(
      regexHelper.password,
      "A senha precisa conter letras e números, no mínimo 8 caracteres, uma letras maiúscula e um carácter especial."
    )
    .required("Senha Obrigatório"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "As senhas precisam ser iguais ")
    .required("Confirmação de senha é obrigatório"),
});

export default function Reset() {
  const router = useRouter();
  const { reset } = useAuth();
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(ResetFormSchema),
  });
  const { errors } = formState;

  const toast = useToast();

  const HandleReset: SubmitHandler<ResetFormData> = async (data) => {
    try {
      if (!router.query.token) {
        return toast({
          title: "Token inválido",
          status: "warning",
          position: "top",
          isClosable: true,
        });
      }

      const resetResponse = await reset({
        password: data.newPassword,
        token: router.query.token.toString(),
      });

      if (resetResponse) {
        const { status, title } = resetResponse;

        toast({
          title: title,
          status: status,
          position: "top",
          isClosable: true,
        });
      }
    } catch (err) {
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
        <title>Redefinir senha | App Alpar do Brasil</title>
      </Head>

      <Box bg="white" w="100vw" h="100vh" overflow="hidden">
        <Box
          display="flex"
          w="100vw"
          h="100vh"
          bg="white"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Resetar senha
          </Text>
          <Flex
            as="form"
            w="100%"
            maxW={480}
            bg="white"
            p={["2rem", "2rem", "2rem", "4rem"]}
            borderRadius={8}
            flexDir="column"
            onSubmit={handleSubmit(HandleReset as any)}
          >
            <Stack spacing="4">
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
                placeholder="Confirme senha"
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
              type="submit"
              mt="6"
              colorScheme="red"
              size="lg"
              isLoading={formState.isSubmitting}
            >
              Alterar senha
            </Button>

            <Center pt="20px">
              <Link href="/" passHref>
                <ChakraLink>Voltar</ChakraLink>
              </Link>
            </Center>
          </Flex>
        </Box>
      </Box>
    </>
  );
}

export const getServerSideProps = withSSRGuest<{}>(async (ctx) => {
  return {
    props: {},
  };
});
