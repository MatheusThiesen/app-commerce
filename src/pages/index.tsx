import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Flex,
  Image,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";

import Head from "next/head";

import { SubmitHandler, useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

import { useEffect } from "react";
import * as Yup from "yup";
import { Input } from "../components/Form/Input";
import { useAuth } from "../contexts/AuthContext";
import { useLoading } from "../contexts/LoadingContext";
import { withSSRGuest } from "../utils/withSSRGuest";

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = Yup.object({
  email: Yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: Yup.string().required("Senha obrigatório"),
});

export default function SignIn() {
  const { register, handleSubmit, formState } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
  });
  const { errors } = formState;

  const { signIn } = useAuth();
  const { setLoading } = useLoading();
  const toast = useToast();

  const HandleSignIn: SubmitHandler<SignInFormData> = async (data) => {
    const signInResponse = await signIn(data);

    if (signInResponse) {
      const { status, title } = signInResponse;

      toast({
        title: title,
        status: status,
        position: "top",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>Login | App Alpar do Brasil</title>
      </Head>
      <Box overflow="hidden">
        <Box
          display="flex"
          w="100vw"
          h="100vh"
          alignItems="center"
          justifyContent="center"
          flexDirection={["column", "column", "column", "row"]}
        >
          <Box
            w={["95%", "80%", "80%", "full"]}
            maxW={[480, 480, 480, 380]}
            mb={["8", "8", "8", "0"]}
          >
            <Box mb="6">
              <Image w="12rem" objectFit="contain" src="/assets/logo-red.png" />
            </Box>
            <Text as="h1" fontSize="4xl" fontWeight="bold" lineHeight={"54px"}>
              Faça seu login na plataforma
            </Text>
          </Box>
          <Flex
            as="form"
            w={["95%", "80%", "80%", "full"]}
            maxW={480}
            bg="white"
            p={["2rem", "2rem", "2rem", "4rem"]}
            borderRadius={8}
            flexDir="column"
            onSubmit={handleSubmit(HandleSignIn as any)}
          >
            <Stack spacing="2">
              <Input
                iconLeft={IoMdMail}
                placeholder="E-mail"
                type="email"
                error={
                  !!errors?.email?.message
                    ? String(errors?.email?.message)
                    : undefined
                }
                {...register("email")}
              />
              <Input
                iconLeft={FaLock}
                placeholder="Senha"
                isPassword
                error={
                  !!errors?.password?.message
                    ? String(errors?.password?.message)
                    : undefined
                }
                {...register("password")}
              />
            </Stack>

            <Link
              href="/esquecido"
              mt="2"
              fontWeight="bold"
              _hover={{
                textDecoration: "none",
                filter: "brightness(1.2)",
              }}
              transition=" all 0.3s"
            >
              Esqueci minha senha
            </Link>

            <Button
              type="submit"
              mt="6"
              colorScheme="red"
              size="lg"
              isLoading={formState.isSubmitting}
            >
              ENTRAR
            </Button>
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
