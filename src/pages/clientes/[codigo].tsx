import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Link as CharkraLink,
  Divider,
  Flex,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoChevronForwardSharp } from "react-icons/io5";
import { Me } from "../../@types/me";
import { InputFake } from "../../components/Form/InputFake";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { useClientOne } from "../../hooks/queries/useClients";
import { setupAPIClient } from "../../service/api";
import { withSSRAuth } from "../../utils/withSSRAuth";

interface ClientProps {
  me: Me;
}

export default function Client(props: ClientProps) {
  const router = useRouter();
  const { codigo } = router.query;

  const { data, isLoading } = useClientOne(Number(codigo));
  return (
    <>
      <Head>
        <title> Cliente | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        isInativeEventScroll
        isGoBack
        title="Detalhes"
        user={{ name: props.me.email }}
      />

      {isLoading ? (
        <Flex h="100vh" w="100%" justify="center" align="center">
          <Spinner ml="4" size="xl" />
        </Flex>
      ) : (
        <Flex
          flexDir="column"
          align="center"
          width="full"
          mt={["0", "0", "0", "8"]}
        >
          <Flex
            flexDir="column"
            width="full"
            align="center"
            maxW="1200px"
            px={["0", "0", "0", "4"]}
          >
            <Flex
              w="full"
              mb="2"
              align="center"
              display={["none", "none", "none", "flex"]}
            >
              <Link href="/clientes">
                <CharkraLink h="full" color="gray.600">
                  Voltar à listagem
                </CharkraLink>
              </Link>

              <Divider h="1rem" mx="2" orientation="vertical" />

              <Breadcrumb
                spacing="8px"
                separator={<IoChevronForwardSharp color="gray.500" />}
              >
                <BreadcrumbItem>
                  <Link href={`/clientes/${data?.codigo}`}>
                    <BreadcrumbLink>{`${data?.codigo} - ${data?.razaoSocial}`}</BreadcrumbLink>
                  </Link>
                </BreadcrumbItem>
              </Breadcrumb>
            </Flex>

            <Flex
              flexDirection="column"
              w="full"
              bg="white"
              borderRadius="md"
              shadow="md"
              mb="5rem"
              p="6"
            >
              <Box>
                <Text as="h2" fontWeight="bold" fontSize="2xl">
                  Cadastro
                </Text>
              </Box>

              <Stack spacing="4" mt="4">
                <Stack
                  direction={["column", "column", "column", "row"]}
                  spacing="4"
                >
                  <InputFake
                    label="Código"
                    value={data?.codigo.toString() || "-"}
                  />
                  <InputFake
                    label="Nome Fantasia"
                    value={data?.nomeFantasia || "-"}
                  />
                  <InputFake
                    label="Razão Social"
                    value={data?.razaoSocial || "-"}
                  />
                  <InputFake label="CNPJ" value={data?.cnpjFormat || "-"} />
                  <InputFake
                    label="Inscrição Estadual"
                    value={data?.incricaoEstadual || "-"}
                  />
                </Stack>
              </Stack>

              <Box mt="4">
                <Text as="h2" fontWeight="bold" fontSize="2xl">
                  Endereço
                </Text>
              </Box>

              <Stack spacing="4" mt="4">
                <Stack
                  direction={["column", "column", "column", "row"]}
                  spacing="4"
                >
                  <InputFake
                    label="Logradouro"
                    value={data?.logradouro || "-"}
                  />
                  <InputFake label="Número" value={data?.numero || "-"} />

                  <InputFake label="Cidade" value={data?.cidade || "-"} />
                  <InputFake label="Bairro" value={data?.bairro || "-"} />
                  <InputFake label="UF" value={data?.uf || "-"} />

                  <InputFake
                    label="Complemento"
                    value={data?.complemento || "-"}
                  />
                </Stack>
              </Stack>

              <Box mt="4">
                <Text as="h2" fontWeight="bold" fontSize="2xl">
                  Contato
                </Text>
              </Box>

              <Stack spacing="4" mt="4">
                <Stack
                  direction={["column", "column", "column", "row"]}
                  spacing="4"
                >
                  <InputFake label="E-Mail" value={data?.email || "-"} />
                  <InputFake
                    label="Telefone"
                    value={data?.telefoneFormat || "-"}
                  />

                  <InputFake label="E-Mail 2" value={data?.email2 || "-"} />
                  <InputFake
                    label="Telefone 2"
                    value={data?.telefone2Format || "-"}
                  />
                </Stack>
              </Stack>

              <Box mt="4">
                <Text as="h2" fontWeight="bold" fontSize="2xl">
                  Classificação
                </Text>
              </Box>

              <Stack spacing="4" mt="4">
                <Stack
                  direction={["column", "column", "column", "row"]}
                  spacing="4"
                >
                  <InputFake
                    label="Ramo de Atividade"
                    value={data?.ramoAtividade?.descricao || "-"}
                  />

                  <InputFake
                    label="Conceito"
                    value={data?.conceito?.descricao || "-"}
                  />
                </Stack>
              </Stack>

              <Box mt="4">
                <Text as="h2" fontWeight="bold" fontSize="2xl">
                  Observações
                </Text>
              </Box>

              <Stack spacing="4" mt="4">
                <Stack
                  direction={["column", "column", "column", "row"]}
                  spacing="4"
                >
                  <Flex
                    px="1rem"
                    py="1rem"
                    bgColor="gray.50"
                    color="gray.900"
                    borderRadius="md"
                    align="center"
                    justify="space-between"
                  >
                    <Text as="span">{data?.obs || "-"}</Text>
                  </Flex>
                </Stack>
              </Stack>
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
}

export const getServerSideProps = withSSRAuth<{}>(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  var me = {};

  const response = await apiClient.get("/auth/me");
  me = response.data;

  return {
    props: {
      me: me,
    },
  };
});
