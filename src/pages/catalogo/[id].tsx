import { Button, Flex, Icon, Spinner, Text, useToast } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { MdPictureAsPdf } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { Me } from "../../@types/me";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { PageCatalog } from "../../components/PageCatalog";
import { CatalogApiResponse, getCatalog } from "../../hooks/queries/useCatalog";
import { setupAPIClient } from "../../service/api";

interface CatalogProps {
  me?: Me;
}

export default function Catalog({ me }: CatalogProps) {
  const history = useRouter();
  const toast = useToast();
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const router = useRouter();
  const { id } = router.query;
  // const { data, isLoading } = useCatalog({ id: String(id) });
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<CatalogApiResponse | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const catalog = await getCatalog({ id: String(id) });
        if (catalog) setData(catalog);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast({
          description: "Ocorreu um erro ao gerar Catálogo.",
          status: "error",
          isClosable: true,
          position: "top",
        });
        history.push("/");
      }
    })();
  }, []);

  const pageStyle = `


    @page { size: A4 landscape; }

    .break { 
      page-break-before: always; 
      margin-bottom: 2rem;
      
     }
    
    `;
  return (
    <>
      <style>{pageStyle}</style>

      <Head>
        <title>Catálogo | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation user={me ? { name: me.email } : undefined} />

      {isLoading && (
        <Flex h="100vh" w="100%" justify="center" align="center">
          <Spinner ml="4" size="xl" />
        </Flex>
      )}
      {data && (
        <Flex
          pt={["6.5rem", "6.5rem", "6.5rem", "7rem"]}
          pb={["7rem"]}
          align="center"
          w="full"
          flexDir="column"
        >
          <Button
            w="3.4rem"
            h="3.4rem"
            position="fixed"
            bottom="6.5rem"
            right={"5"}
            colorScheme="red"
            borderRadius="full"
            onClick={handlePrint}
          >
            <Icon as={MdPictureAsPdf} fontSize={"2rem"} />
            <Text
              position="absolute"
              bottom="-1.745rem"
              bg="gray.700"
              p="1"
              borderRadius="md"
              fontSize={"0.875rem"}
              opacity={0.8}
            >
              Exportar
            </Text>
          </Button>

          <div
            style={{
              maxWidth: "90%",
            }}
            ref={componentRef}
          >
            {data.products.map((product) => (
              <PageCatalog
                key={product.reference}
                product={product}
                date={data.dateToString ?? "-"}
              />
            ))}
          </div>
        </Flex>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };

  const apiClient = setupAPIClient(ctx);

  try {
    const response = await apiClient.get("/auth/me");

    return {
      props: {
        me: response.data,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
