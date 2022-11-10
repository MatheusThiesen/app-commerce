import { Box, Icon, Spinner, Text, useToast } from "@chakra-ui/react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoBook } from "react-icons/io5";

import { SelectedFilter } from "../components/ProductListFilter";
import { api } from "../service/apiClient";
import { getProducts } from "./queries/useProducts";

type GenerateCatalogProps = {
  orderBy: string;
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
  onSelectedAllProduct: (filters: SelectedFilter[], orderby: string) => void;
  onGenerateCatalog: (t: GenerateCatalogProps) => void;
};

type ProductCatalogProviderProps = {
  children: ReactNode;
};

const ProductCatalogContext = createContext({} as ProductCatalogData);

const spaceImages = "https://alpar.sfo3.digitaloceanspaces.com";

export function ProductCatalogProvider({
  children,
}: ProductCatalogProviderProps) {
  const toast = useToast();
  const toastIdRef = useRef();

  const [productsSelected, setProductsSelected] = useState<
    CatalogProductProps[]
  >([]);
  const [isActivated, setIsActivated] = useState<boolean>(false);

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
  async function handleGenerateCatalog({ orderBy }: GenerateCatalogProps) {
    //@ts-ignore
    toastIdRef.current = toast({
      position: "top-right",
      duration: 100000,
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
    });

    try {
      const response = await api.post("/products/catalog", {
        referencesProduct: productsSelected.map((product) => product.reference),
        orderBy: orderBy,
      });

      if (toastIdRef.current) {
        toast.update(toastIdRef.current, {
          description: "Catálogo gerado!",
          status: "success",
          isClosable: true,
        });
        setTimeout(() => {
          if (toastIdRef.current) {
            toast.close(toastIdRef.current);
          }
        }, 3000);
      }

      const contentHtml = response.data;

      var win = window.open();

      if (win) {
        win?.document.write(contentHtml);
        setTimeout(() => {
          // win?.print();
          // win?.close();
        }, 3000);
      }
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
    orderby: string
  ) {
    const responseProducts = await getProducts({
      page: 1,
      filters: filters,
      orderby: orderby,
      pagesize: 5000,
    });

    const normalizedProducts = responseProducts.products.map((product) => ({
      reference: product.referencia,
    }));

    setProductsSelected(
      normalizedProducts.filter((f) => !productsSelected.includes(f))
    );
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
    </ProductCatalogContext.Provider>
  );
}

export const useProductCatalog = () => useContext(ProductCatalogContext);
