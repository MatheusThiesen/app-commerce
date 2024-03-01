import {
  Box,
  Button,
  Link as CharkraLink,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import copy from "copy-to-clipboard";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiExternalLink } from "react-icons/fi";
import { IoIosShareAlt } from "react-icons/io";
import { IoBook } from "react-icons/io5";
import { RxClipboardCopy } from "react-icons/rx";

import { SelectedFilter } from "../components/ListFilter";
import { useLoading } from "../contexts/LoadingContext";
import { api } from "../service/apiClient";
import { getProducts } from "./queries/useProducts";

type GenerateCatalogProps = {
  filters?: string;
  orderBy: string;
  groupProduct?: boolean;
  stockLocation?: boolean;
};

export type CatalogProductProps = {
  reference: string;
};

type ProductCatalogData = {
  productsSelected: CatalogProductProps[];
  isActivated: boolean;
  onSelectedProduct: (i: CatalogProductProps) => void;
  onRemoveProduct: (i: CatalogProductProps) => void;
  onChangeActivated: React.Dispatch<React.SetStateAction<boolean>>;
  onRemoveAllProduct: () => void;
  onSelectedAllProduct: (
    filters: SelectedFilter[],
    orderby: string,
    groupProduct: boolean
  ) => void;
  onGenerateCatalog: (t: GenerateCatalogProps) => void;
};

type ProductCatalogProviderProps = {
  children: ReactNode;
};

const ProductCatalogContext = createContext({} as ProductCatalogData);

export function ProductCatalogProvider({
  children,
}: ProductCatalogProviderProps) {
  const toast = useToast();
  const toastIdRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setLoading } = useLoading();

  const [productsSelected, setProductsSelected] = useState<
    CatalogProductProps[]
  >([]);
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [catalogLink, setCatalogLink] = useState<string>("");

  function handleSelectedProduct(produto: CatalogProductProps) {
    setProductsSelected((stateDate) => [...stateDate, produto]);
  }
  function handleRemoveProduct({ reference }: CatalogProductProps) {
    const removeProduct = productsSelected.filter(
      (produto) => produto.reference !== reference
    );
    setProductsSelected(removeProduct);
  }
  function handleRemoveAllProduct() {
    setProductsSelected([]);
  }

  async function handleGenerateCatalog({
    orderBy,
    groupProduct,
    stockLocation,
    filters,
  }: GenerateCatalogProps) {
    //@ts-ignore
    toastIdRef.current = toast({
      position: "top-right",
      render: () => (
        <Box
          bg="blue.400"
          p="3"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" justifyContent="start">
            <Icon as={IoBook} color="white" mr="3" fontSize="20px" />
            <Text as="span" color="white" fontSize="md">
              Gerando catálogo
            </Text>
          </Box>
          <Spinner ml="3" size="md" color="white" />
        </Box>
      ),
      duration: 999999,
    });

    try {
      const response = await api.post("/catalog", {
        referencesProduct: productsSelected.map((product) => product.reference),
        orderBy: orderBy,
        groupProduct: groupProduct,
        stockLocation: stockLocation,
        filters: filters,
      });

      if (toastIdRef.current) {
        toast.update(toastIdRef.current, {
          description: "Catálogo gerado!",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
      }

      setCatalogLink(
        `${window.location.protocol}//${window.location.host}/catalogo/${response.data}`
      );
      onOpen();
      handleRemoveAllProduct();
    } catch (error) {
      if (toastIdRef.current) {
        toast.update(toastIdRef.current, {
          description: "Ocorreu um erro ao gerar Catálogo.",
          status: "error",
          isClosable: true,
        });
      }
    }
  }
  async function handleSelectedAllProduct(
    filters: SelectedFilter[],
    orderby: string,
    groupProduct: boolean
  ) {
    setLoading(true);

    const responseProducts = await getProducts({
      page: 1,
      filters: filters,
      orderby: orderby,
      pagesize: 9999999,
      distinct: groupProduct ? "codigoAlternativo" : "referencia",
    });

    const normalizedProducts = responseProducts.products.map((product) => ({
      reference: product.referencia,
    }));

    setProductsSelected(
      normalizedProducts.filter((f) => !productsSelected.includes(f))
    );

    setLoading(false);
  }

  function handleCopyClipboard() {
    copy(catalogLink);

    toast({
      title: "Link copiado",
      status: "info",
      position: "top",
      isClosable: true,
    });
  }

  async function handleShare() {
    try {
      await navigator.share({
        title: "Catálogo",
        url: catalogLink,
      });
    } catch (err) {
      toast({
        description: "Ocorreu um erro ao gerar Catálogo.",
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  }

  useEffect(() => {
    if (productsSelected.length >= 1) {
      if (!isActivated) {
        setIsActivated(true);
      }
    } else {
      setIsActivated(false);
    }
  }, [productsSelected]);

  return (
    <ProductCatalogContext.Provider
      value={{
        productsSelected: productsSelected,
        isActivated: isActivated,
        onSelectedProduct: handleSelectedProduct,
        onRemoveProduct: handleRemoveProduct,
        onChangeActivated: setIsActivated,
        onRemoveAllProduct: handleRemoveAllProduct,
        onGenerateCatalog: handleGenerateCatalog,
        onSelectedAllProduct: handleSelectedAllProduct,
      }}
    >
      {children}

      {catalogLink && (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent>
            <ModalHeader>Catálogo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box borderRadius={"md"} bg="gray.50" p="2">
                <CharkraLink h="full" isExternal href={catalogLink}>
                  {catalogLink}
                </CharkraLink>
              </Box>
            </ModalBody>

            <ModalFooter>
              {navigator.share !== undefined && (
                <Button mr={3} onClick={handleShare}>
                  <Text display={["none", "none", "none", "flex"]}>
                    Compartilhar
                  </Text>
                  <Icon as={IoIosShareAlt} ml={[0, 0, 0, 3]} />
                </Button>
              )}

              <Button mr={3} onClick={handleCopyClipboard}>
                Copiar
                <Icon as={RxClipboardCopy} ml={3} />
              </Button>
              <CharkraLink h="full" isExternal href={catalogLink}>
                <Button colorScheme="red">
                  Abrir Catálogo
                  <Icon as={FiExternalLink} ml={3} />
                </Button>
              </CharkraLink>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </ProductCatalogContext.Provider>
  );
}

export const useProductCatalog = () => useContext(ProductCatalogContext);
