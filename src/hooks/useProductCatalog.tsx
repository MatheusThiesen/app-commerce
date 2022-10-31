import { createContext, ReactNode, useContext, useState } from "react";
import { ProductProps } from "../components/Product";
import { SelectedFilter } from "../components/ProductListFilter";
import { api } from "../service/apiClient";
import { getProducts } from "./queries/useProducts";

type ProductCatalogData = {
  productsSelected: ProductProps[];
  isActivated: boolean;
  onSelectedProduct: (i: ProductProps) => void;
  onRemoveProduct: (i: ProductProps) => void;
  onChangeActivated: React.Dispatch<React.SetStateAction<boolean>>;
  onRemoveAllProduct: () => void;
  onSelectedAllProduct: (filters: SelectedFilter[]) => void;
  onGenerateCatalog: () => void;
};

type ProductCatalogProviderProps = {
  children: ReactNode;
};

const ProductCatalogContext = createContext({} as ProductCatalogData);

const spaceImages = "https://alpar.sfo3.digitaloceanspaces.com";

export function ProductCatalogProvider({
  children,
}: ProductCatalogProviderProps) {
  const [productsSelected, setProductsSelected] = useState<ProductProps[]>([]);
  const [isActivated, setIsActivated] = useState<boolean>(false);

  function handleSelectedProduct(produto: ProductProps) {
    setProductsSelected((stateDate) => [...stateDate, produto]);
  }
  function handleRemoveProduct({ cod }: ProductProps) {
    const removeProduct = productsSelected.filter(
      (produto) => produto.cod !== cod
    );
    setProductsSelected(removeProduct);
  }
  function handleRemoveAllProduct() {
    setProductsSelected([]);
  }
  async function handleGenerateCatalog() {
    const response = await api.post("/products/catalog", {
      codProducts: productsSelected.map((product) => product.cod),
    });

    const contentHtml = response.data;

    var win = window.open();

    if (win) {
      win?.document.write(contentHtml);
      setTimeout(() => {
        win?.print();
        win?.close();
      }, 500);
    }
  }

  async function handleSelectedAllProduct(filters: SelectedFilter[]) {
    const responseProducts = await getProducts({
      page: 1,
      filters: filters,
      pagesize: 500,
    });

    const normalizedProducts = responseProducts.products.map((product) => ({
      cod: product.codigo,
      name: product.descricao,
      descriptionAdditional: product.descricaoAdicional,
      reference: product.referencia,
      priceSale: product.precoVendaFormat,
      uri: `${spaceImages}/Produtos/${product.referencia}_01`,
    }));

    setProductsSelected(
      normalizedProducts.filter((f) => !productsSelected.includes(f))
    );
  }

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
