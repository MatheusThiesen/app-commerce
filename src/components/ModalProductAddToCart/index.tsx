import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { useLoading } from "../../contexts/LoadingContext";
import { useStore } from "../../contexts/StoreContext";
import { defaultNoImage, spaceImages } from "../../global/parameters";
import { StockLocation, useProductOne } from "../../hooks/queries/useProducts";
import { InputQuantity } from "../Form/InputQuantity";
import { VariationsProduct } from "../VariationsProduct";

interface Props {
  productCode: number | undefined;
  onClose: () => void;
}

export function ModalProductAddToCart({ onClose, productCode }: Props) {
  const { priceList, addItem, client, orders } = useStore();
  const { setLoading } = useLoading();
  const toast = useToast();

  const [currentProductCode, setCurrentProductCode] = useState(productCode);
  const [quantity, setQuantity] = useState(0);
  const [stockLocationSelected, setStockLocationSelected] = useState<
    StockLocation | undefined
  >();

  const { data: product, isLoading } = useProductOne(
    Number(currentProductCode),
    client?.codigo
  );

  async function handleAddProductStore() {
    if (!product || !stockLocationSelected) {
      return toast({
        title: "Informe o produto e disponibilidade",
        status: "warning",
        position: "top",
        isClosable: true,
      });
    }

    addItem({
      product,
      qtd: quantity,
      stockLocation: stockLocationSelected,
      brand: product.marca,
    });
    toast({
      title: "Produto adicionado no carrinho",
      status: "success",
      position: "top",
      isClosable: true,
    });

    setQuantity(0);
  }

  async function handleUpdateProductCode(cod: number) {
    setQuantity(0);
    setStockLocationSelected(undefined);
    setCurrentProductCode(cod);
  }

  async function handleOnClose() {
    setCurrentProductCode(undefined);
    setQuantity(0);
    setStockLocationSelected(undefined);
    onClose();
  }

  useEffect(() => {
    setCurrentProductCode(productCode);
  }, [productCode]);

  useEffect(() => {
    if (product && stockLocationSelected) {
      const findOrder = orders.find(
        (f) => f.stockLocation.periodo === stockLocationSelected.periodo
      );

      if (!findOrder) return setQuantity(0);

      const findItem = findOrder.items.find(
        (f) => f.product.codigo === product.codigo
      );

      if (!findItem) return setQuantity(0);

      setQuantity(findItem.qtd);
    }
  }, [product, stockLocationSelected, orders]);

  useEffect(() => {
    setLoading(isLoading && !!currentProductCode);
  }, [isLoading, currentProductCode]);

  return (
    <Modal
      isOpen={isLoading === false && !!currentProductCode}
      onClose={handleOnClose}
      onOverlayClick={handleOnClose}
      onEsc={handleOnClose}
      isCentered
    >
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent>
        <ModalHeader>{product?.descricao}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p="6">
          <Flex flexDirection="column" align="center" justify="center" flex={1}>
            <Image
              h="36"
              src={`${spaceImages}/Produtos/${
                product?.imagemPreview
                  ? product.imagemPreview
                  : product?.referencia + "_01"
              }_smaller`}
              objectFit="contain"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = defaultNoImage;
              }}
            />
          </Flex>

          <Text as="p" color="gray.600" fontSize="md" fontWeight="md" mt="2">
            {`${priceList?.descricao} ${
              product?.listaPreco?.find(
                (f) => Number(f.codigo) === Number(priceList?.codigo)
              )?.valorFormat ?? "-"
            }`}
          </Text>
          <Text as="span" fontSize="2xl" fontWeight="medium">
            PDV {product?.precoVendaFormat ?? "-"}
          </Text>

          <Text as="p" fontSize="small" mt="2" fontWeight="light">
            Cor:{" "}
            <Text as="span" fontSize="small" mt="2" fontWeight="bold">
              {product?.corPrimaria?.descricao}
              {product?.corSecundaria?.cor.descricao
                ? ` e ${product?.corSecundaria?.cor.descricao}`
                : ""}
            </Text>
          </Text>

          {product?.variacoes && product?.variacoes?.length >= 1 && (
            <VariationsProduct
              variationsProduct={product.variacoes}
              currentReference={product?.referencia ?? ""}
              onClick={(variantCode) =>
                handleUpdateProductCode(Number(variantCode))
              }
            />
          )}

          <Stack mt="4" spacing="4">
            <Stack direction="row" w="full">
              <Box flex={1}>
                <Text fontWeight="light">Grade</Text>
                <Select
                  onChange={(e) => {
                    handleUpdateProductCode(Number(e.target.value));
                  }}
                  value={product?.codigo}
                >
                  {product?.grades?.map((grid) => (
                    <option key={grid.codigo} value={grid.codigo}>
                      {grid.descricaoAdicional}
                    </option>
                  ))}
                </Select>
              </Box>

              {product?.locaisEstoque && (
                <Box flex={1}>
                  <Text fontWeight="light">Disponibilidade</Text>
                  <Select
                    value={stockLocationSelected?.periodo ?? "0"}
                    onChange={(e) => {
                      const findStockLocation = product?.locaisEstoque?.find(
                        (f) => String(f.periodo) === String(e?.target.value)
                      );

                      setStockLocationSelected(findStockLocation);
                    }}
                  >
                    <option value="0">Selecione...</option>
                    {product.locaisEstoque?.map((stockLocation) => (
                      <option value={stockLocation.periodo}>
                        {stockLocation.descricao}
                      </option>
                    ))}
                  </Select>
                </Box>
              )}
            </Stack>

            {stockLocationSelected && (
              <Box w="8rem">
                <InputQuantity
                  value={quantity}
                  step={product?.qtdEmbalagem}
                  max={stockLocationSelected?.quantidade}
                  min={product?.qtdEmbalagem}
                  onDecremental={(qtd) => setQuantity(qtd)}
                  onIncremental={(qtd) => setQuantity(qtd)}
                />
                <Text
                  mt="1"
                  as={"span"}
                  fontSize="sm"
                  fontWeight="light"
                  color="gray.500"
                  display="block"
                  textAlign="center"
                >
                  {stockLocationSelected?.quantidade
                    ? `${stockLocationSelected?.quantidade} disponível`
                    : "-"}
                </Text>
              </Box>
            )}
          </Stack>

          <Button
            colorScheme="blue"
            mt="6"
            size="lg"
            w="full"
            leftIcon={<Icon as={FaCartPlus} fontSize={30} />}
            aria-disabled={!stockLocationSelected || !(Number(quantity) > 0)}
            disabled={!stockLocationSelected || !(Number(quantity) > 0)}
            onClick={() =>
              !stockLocationSelected || !(Number(quantity) > 0)
                ? () => {}
                : handleAddProductStore()
            }
          >
            Adicionar ao carrinho
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
