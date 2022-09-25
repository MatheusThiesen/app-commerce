import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoChevronForwardSharp, IoCubeOutline } from "react-icons/io5";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { Model } from "../../components/Model";
import { ProductCarousel } from "../../components/ProductCarousel";

export default function Produto() {
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
          <Box w="full" mb="2">
            <Breadcrumb
              spacing="8px"
              separator={<IoChevronForwardSharp color="gray.500" />}
            >
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Produtos</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink href="#">Calçados</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Box>

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
                banners={[
                  {
                    id: "1",
                    name: "Tenis Nike",
                    uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/CW3411402_01",
                  },
                  {
                    id: "2",
                    name: "Logo Nike",
                    uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/CW3411402_02",
                  },
                  {
                    id: "3",
                    name: "Logo Nike",
                    uri: "https://alpar.sfo3.digitaloceanspaces.com/Produtos/CW3411402_03",
                  },
                ]}
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
                NIKE TENIS DOWNSHIFTER 11
              </Text>
              <Text as="p" fontSize="sm" fontWeight="light" color="gray.600">
                Referência DA87243
              </Text>
              <Text as="span" fontSize="2xl" fontWeight="medium">
                PDV R$ 299,99
              </Text>
              <Text as="p" fontSize="small" mt="2" fontWeight="medium">
                Cor: Azul e Branco
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
