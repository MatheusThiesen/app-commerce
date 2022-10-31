import { Button, Flex, Stack, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Head from "next/head";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { Input } from "../components/Form/Input";
import { useAuth } from "../contexts/AuthContext";
import { withSSRGuest } from "../utils/withSSRGuest";

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = Yup.object().shape({
  email: Yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: Yup.string().required("Senha obrigatório"),
});

export default function SignIn() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });
  const { errors } = formState;

  const { signIn } = useAuth();
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

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>

      <Flex w="100vw" h="100vh" align="center" justify="center">
        <Flex
          as="form"
          w="100%"
          maxW={360}
          bg="white"
          p="8"
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit(HandleSignIn as any)}
        >
          <Stack spacing="4">
            <Input
              label="E-mail"
              type="email"
              error={
                !!errors?.email?.message
                  ? String(errors?.email?.message)
                  : undefined
              }
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              error={
                !!errors?.password?.message
                  ? String(errors?.password?.message)
                  : undefined
              }
              {...register("password")}
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
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = withSSRGuest<{}>(async (ctx) => {
  return {
    props: {},
  };
});
