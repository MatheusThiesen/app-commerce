import { Box, Button } from "@chakra-ui/react";
import Head from "next/head";
import { HeaderNavigation as Header } from "../../components/HeaderNavigation";
import { useAuth } from "../../contexts/AuthContext";

export default function SignIn() {
  const { signOut } = useAuth();

  return (
    <>
      <Head>
        <title>Mais - App Alpar do Brasil</title>
      </Head>

      <Header title="Mais" />

      <Box>
        <Button onClick={signOut}>Logout</Button>
      </Box>
    </>
  );
}
