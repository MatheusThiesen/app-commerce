import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Flex,
  Icon,
  Link as CharkraLink,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoChevronForwardSharp, IoCubeOutline } from "react-icons/io5";
import xml2js from "xml2js";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { Model } from "../../components/Model";
import { ProductCarousel } from "../../components/ProductCarousel";
import { getProductOne, Product } from "../../hooks/queries/useProducts";
import { withSSRAuth } from "../../utils/withSSRAuth";

type ResponseXmlToJson = {
  ListBucketResult: {
    Contents: {
      Key: string[];
    }[];
  };
};

const spaceImages = "https://alpar.sfo3.digitaloceanspaces.com";

interface ProdutoProps {
  product?: Product;
  images?: string[];
}

export default function Produto(props: ProdutoProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Head>
        <title>Produtos - App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation isInativeEventScroll isGoBack title="Detalhes" />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="65%" px="0">
          <ModalHeader>Objeto 3D</ModalHeader>
          <ModalCloseButton />
          <ModalBody p="0">
            <Model />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Flex flexDir="column" align="center" width="full" mt="8">
        <Flex flexDir="column" width="full" maxW="1200px" px="4" align="center">
          <Flex w="full" mb="2" align="center">
            <CharkraLink h="full" color="gray.600">
              <Link href="/produtos">Voltar à listagem</Link>
            </CharkraLink>

            <Divider h="1rem" mx="2" orientation="vertical" />

            <Breadcrumb
              spacing="8px"
              separator={<IoChevronForwardSharp color="gray.500" />}
            >
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link href="/produtos">Produtos </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link href="/produtos?genero=masculino">Calçados </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Flex>

          <Flex
            flexDir={["row"]}
            p="4"
            w="full"
            bg="white"
            borderRadius="md"
            shadow="md"
          >
            <Box w="60%" pr="8">
              <ProductCarousel
                bg="white"
                h="300"
                banners={
                  props.images?.map((image, index) => ({
                    id: index.toString(),
                    name: props.product?.descricao ?? "-",
                    uri: image,
                  })) ?? []
                }
              />
            </Box>

            <Box
              w="40%"
              px="4"
              pt="6"
              border="1px"
              borderColor="gray.200"
              borderRadius="lg"
            >
              <Text as="h1" fontSize="2xl" fontWeight="bold">
                {props.product?.descricao}
              </Text>
              <Text as="p" fontSize="sm" fontWeight="light" color="gray.600">
                Referência {props.product?.referencia}
              </Text>
              <Text as="span" fontSize="2xl" fontWeight="medium">
                PDV {props.product?.precoVendaFormat}
              </Text>
              <Text as="p" fontSize="small" mt="2" fontWeight="medium">
                {/* Cor: Azul e Branco */}
              </Text>
            </Box>
          </Flex>
        </Flex>

        <Box py="0.5rem" display="flex" justifyContent="end" gap="0.5rem">
          <Button
            h="2.5rem"
            w="2.5rem"
            p="0"
            borderRadius="full"
            onClick={onOpen}
          >
            <Icon as={IoCubeOutline} fontSize="20" />
          </Button>
          <Button h="2.5rem" w="2.5rem" p="0" borderRadius="full">
            <Icon
              as={IoMdHeartEmpty} //IoIosHeart
              fontSize="20"
            />
          </Button>
        </Box>
      </Flex>
    </>
  );
}

export const getServerSideProps = withSSRAuth<{}>(async (ctx) => {
  const product = await getProductOne(Number(ctx.query.codigo), ctx);

  var images: string[] = [];

  if (product) {
    const response = await axios(
      `${spaceImages}/?prefix=Produtos%2F${product.referencia}&max-keys=10`,
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
    const xmlToJson = (await xml2js.parseStringPromise(
      response.data
    )) as ResponseXmlToJson;
    images = xmlToJson?.ListBucketResult?.Contents?.map(
      (key) => spaceImages + "/" + key?.Key[0]
    );
  }

  return {
    props: { product, images },
  };
});
