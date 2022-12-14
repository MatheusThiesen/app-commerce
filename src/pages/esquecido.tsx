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
import { AxiosError } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoMdMail } from "react-icons/io";
import * as Yup from "yup";
import { Input } from "../components/Form/Input";
import { api } from "../service/apiClient";
import { withSSRGuest } from "../utils/withSSRGuest";

type ForgotFormData = {
  email: string;
};

const ForgotFormSchema = Yup.object().shape({
  email: Yup.string().required("E-mail obrigatório").email("E-mail inválido"),
});

export default function Forgot() {
  const router = useRouter();
  const { register, handleSubmit, formState, setError } = useForm({
    resolver: yupResolver(ForgotFormSchema),
  });
  const { errors } = formState;

  const toast = useToast();

  const HandleForgot: SubmitHandler<ForgotFormData> = async (data) => {
    try {
      await api.post("/auth/forgot", {
        email: data.email,
      });

      await router.push("/");

      return toast({
        title: "Quase lá, dê uma checada em seu e-mail",
        status: "success",
        position: "top",
        isClosable: true,
      });
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 400) {
        setError(
          "email",
          { message: "" },
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
        <title>Recuperar senha | App Alpar do Brasil</title>
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
            Recuperar senha
          </Text>
          <Flex
            as="form"
            w="100%"
            maxW={480}
            bg="white"
            p={["2rem", "2rem", "2rem", "4rem"]}
            borderRadius={8}
            flexDir="column"
            onSubmit={handleSubmit(HandleForgot as any)}
          >
            <Stack spacing="4">
              <Input
                iconLeft={IoMdMail}
                // label="E-mail"
                placeholder="Digite seu e-mail"
                type="email"
                error={
                  !!errors?.email?.message
                    ? String(errors?.email?.message)
                    : undefined
                }
                {...register("email")}
              />
            </Stack>

            <Button
              type="submit"
              mt="6"
              colorScheme="red"
              size="lg"
              isLoading={formState.isSubmitting}
            >
              Entrar
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
