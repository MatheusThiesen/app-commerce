import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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
    const response = await api.post("/products/catalog", {
      referencesProduct: productsSelected.map((product) => product.reference),
      orderBy: orderBy,
    });

    const contentHtml = response.data;

    var win = window.open();

    if (win) {
      win?.document.write(contentHtml);
      setTimeout(() => {
        // win?.print();
        // win?.close();
      }, 3000);
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
      pagesize: 300,
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
