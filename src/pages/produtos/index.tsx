import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Slide,
  Spinner,
  Stack,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import * as ExcelJS from "exceljs";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { IoBook } from "react-icons/io5";
import { SiMicrosoftexcel } from "react-icons/si";

import { ListProducts } from "@/components/ListProducts";
import { ShoppingButton } from "@/components/ShoppingButton";
import { Switch as SwitchUI } from "@/components/ui/switch";
import { useStore } from "@/contexts/StoreContext";
import { Accordion } from "../../components/Accordion";
import { Cart } from "../../components/Cart";
import { FilterRangeAmount } from "../../components/FilterRangeAmount";
import { FilterSelectedList } from "../../components/FilterSelectedList";
import { HeaderNavigation } from "../../components/HeaderNavigation";
import { HeaderToList } from "../../components/HeaderToList";
import { ListFilter, SelectedFilter } from "../../components/ListFilter";
import { ModalFilter } from "../../components/ModalFilter";
import { ModalOrderBy } from "../../components/ModalOrderBy";
import { PanelLayout } from "../../components/PanelLayout";
import { Search } from "../../components/Search";
import { useAuth } from "../../contexts/AuthContext";
import {
  CLIENT_EMAILS_ACCEPT_STORE,
  spaceImages,
} from "../../global/parameters";
import { getProducts, productsOrderBy } from "../../hooks/queries/useProducts";
import { useProductsFilters } from "../../hooks/queries/useProductsFilters";
import { useLocalStore } from "../../hooks/useLocalStore";
import { useProductCatalog } from "../../hooks/useProductCatalog";
import { useQueryParams } from "../../hooks/useQueryParams";
import {
  queryParamsToFiltersNormalized,
  useQueryParamsFilterList,
} from "../../hooks/useQueryParamsFilterList";
import getImageByUrl from "../../utils/getImageByUrl";
import { groupByObj } from "../../utils/groupByObj";

export default function Produtos() {
  const toast = useToast();
  const toastIdRef = useRef();
  const router = useRouter();

  const { setQueryParams } = useQueryParams({ router });
  const { isOpen, onToggle } = useDisclosure();

  const { totalItems } = useStore();

  const {
    isActivated: isActivatedCatalog,
    productsSelected: productsSelectedCatalog,
    onRemoveAllProduct: onRemoveAllProductCatalog,
    onSelectedAllProduct: onSelectedAllProductCatalog,
    onGenerateCatalog,
  } = useProductCatalog();

  const {
    isOpen: isOpenFilter,
    onOpen: onOpenFilter,
    onClose: onCloseFilter,
  } = useDisclosure();
  const {
    isOpen: isOpenOrderBy,
    onOpen: onOpenOrderBy,
    onClose: onCloseOrderBy,
  } = useDisclosure();

  const { data: scrollPosition, onRemove: onRemoveScrollPosition } =
    useLocalStore("@ScrollY-Products");

  const { user } = useAuth();

  const [search, setSearch] = useState<string>(() => {
    return router.query.search ? String(router.query.search) : "";
  });
  const [orderBy, setOrderBy] = useState<string>(() => {
    return router.query.orderby
      ? String(router.query.orderby)
      : "precoVenda.desc";
  });
  const [filters, setFilters] = useState<SelectedFilter[]>(() => {
    return queryParamsToFiltersNormalized(router.query);
  });
  const [groupProduct, setGroupProduct] = useState<
    undefined | string | "codigoAlternativo" | "referencia"
  >(() => {
    return router.query.distinct ? String(router.query.distinct) : "";
  });
  const [stockLocation, setStockLocation] = useState(false);
  const [isVisibleFilters, setIsVisibleFilters] = useState(true);

  const {
    isOpen: isOpenOrder,
    onOpen: onOpenOrder,
    onClose: onCloseOrder,
  } = useDisclosure();

  useQueryParamsFilterList({
    router,
    filters,
  });

  const { data: productsFilters, isLoading: isLoadingProductsFilters } =
    useProductsFilters({});

  async function handleExportList({ noImage = false }: { noImage?: boolean }) {
    //@ts-ignore
    toastIdRef.current = toast({
      position: "top-right",
      duration: 1000 * 60 * 60 * 1,
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
              Gerando relatório
            </Text>
          </Box>
          <Spinner ml="3" size="md" color="white" />
        </Box>
      ),
    });

    try {
      const responseProducts = await getProducts({
        page: 1,
        filters: filters,
        orderby: orderBy,
        pagesize: 10000,
        search: search,
        isReport: true,
      });

      const stocks: { descricao: string; periodo: string }[] = [];

      for (const product of responseProducts.products) {
        if (product.locaisEstoque) {
          for (const stock of product.locaisEstoque) {
            const findStock = stocks.find((s) => s.periodo === stock.periodo);

            if (!findStock)
              stocks.push({
                descricao: stock.descricao,
                periodo: stock.periodo,
              });
          }
        }
      }

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("My Sheet");

      sheet.getRow(1).height = 25;
      sheet.getRow(1).font = {
        name: "Roboto",
        family: 4,
        size: 16,
        bold: true,
      };

      const columns = [
        {
          header: "Foto",
          key: "image",
          width: 20,
        },

        {
          header: "Cód. Produto",
          key: "productCod",
          width: 25,

          alignment: {
            horizontal: "center",
            vertical: "middle",
          },
        },
        {
          header: "Cód. Agrupador",
          key: "alterativeCode",
          width: 24,
        },
        {
          header: "Referência",
          key: "reference",
          width: 20,
        },
        {
          header: "Descrição",
          key: "description",
          width: 30,
        },
        {
          header: "Cor",
          key: "colors",
          width: 12,
        },
        {
          header: "Marca",
          key: "brand",
          width: 10,
        },
        {
          header: "Coleção",
          key: "collection",
          width: 15,
        },
        {
          header: "Linha",
          key: "line",
          width: 10,
        },
        {
          header: "Grupo",
          key: "group",
          width: 10,
        },
        {
          header: "Subgrupo",
          key: "subgroup",
          width: 18,
        },
        {
          header: "Gênero",
          key: "genre",
          width: 13,
        },
        {
          header: "Grade/Tamanho",
          key: "grid",
          width: 26,
        },
        {
          header: "PDV Sugerido",
          key: "pdv",
          width: 25,
        },

        ...stocks.map((stock) => ({
          header: stock.descricao,
          key: stock.periodo,
          width: 23,
        })),

        {
          header: "Acondicionamento",
          key: "packageQuantity",
          width: 30,
        },

        {
          header: "Lista 28 DDL",
          key: "list28",
          width: 26,
        },
        {
          header: "Lista 42 DDL",
          key: "list42",
          width: 26,
        },
        {
          header: "Lista 56 DDL",
          key: "list56",
          width: 26,
        },
        {
          header: "Quantidade Grades",
          key: "qtd",
          width: 30,
        },
        {
          header: "Total",
          key: "total",
          width: 26,
          numFmt: "numFmt = '$#,##0.00;[Red]-$#,##0.00';",
        },
      ];

      //@ts-ignore
      sheet.columns = noImage
        ? columns.filter((f) => f.key !== "image")
        : columns;

      const getImages: { reference: string; imageBase64: string }[] = [];

      if (!noImage) {
        const promiseAllImages = Promise.all(
          groupByObj(responseProducts.products, (p) => p.referencia).map(
            async (productGroup) => {
              const reference = productGroup.value as string;

              const product = productGroup.data[0];

              const getImageBase64 = await getImageByUrl(
                `${spaceImages}/Produtos/${
                  product?.imagemPreview
                    ? product.imagemPreview
                    : product.referencia + "_01"
                }_smaller`
              );

              getImages.push({
                reference: reference,
                imageBase64: getImageBase64,
              });
            }
          )
        );
        await promiseAllImages;
      }

      const promise = Promise.all(
        responseProducts.products.map(async (product, index) => {
          let data = {};

          if (product.locaisEstoque) {
            for (const stock of product.locaisEstoque) {
              data = { ...data, [stock.periodo]: stock.quantidade };
            }
          }

          sheet.addRow({
            productCod: product.codigo ?? "-",
            alterativeCode: product.codigoAlternativo ?? "-",
            reference: product.referencia ?? "-",
            description: product.descricao ?? "-",
            colors:
              product?.corPrimaria && product?.corSecundaria
                ? `${product?.corPrimaria.descricao} / ${product.corSecundaria.cor.descricao}`
                : product?.corPrimaria
                ? `${product?.corPrimaria.descricao}`
                : "-",
            brand: product.marca.descricao ?? "-",
            collection: product.colecao?.descricao ?? "-",
            line: product.linha?.descricao ?? "-",
            group: product.grupo?.descricao ?? "-",
            subgroup: product.subGrupo?.descricao ?? "-",
            genre: product.genero?.descricao ?? "-",
            grid: product.descricaoAdicional ?? "-",
            pdv: product.precoVenda ?? "-",
            packageQuantity: product?.qtdEmbalagem
              ? product.qtdEmbalagem // `- ${product.qtdEmbalagem} +`
              : "-",
            list28: product.precoTabela28,
            list42: product.precoTabela42,
            list56: product.precoTabela56,
            ...data,
          });

          if (!noImage) {
            const imageId = workbook.addImage({
              base64:
                getImages.find((f) => f.reference === product.referencia)
                  ?.imageBase64 ?? "",
              extension: "jpeg",
            });

            sheet.addImage(imageId, {
              tl: { col: 0, row: index + 1 },
              ext: { width: 110, height: 85 },
              editAs: "oneCells",
            });
          }
        })
      );

      let columnLocationTotal = "";
      let columnLocationQtd = "";
      let columnLocationList28 = "";
      let columnLocationPackageQuantity = "";

      let columnCurrent: number[] = [];

      sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
        row.eachCell({ includeEmpty: true }, function (cell, columnNumber) {
          //@ts-ignore
          let columnKey = cell["_column"]["_key"];

          if (rowNumber === 1) {
            if (["list42", "list56"].includes(columnKey)) {
              columnCurrent.push(columnNumber);
            }

            if (columnKey === "pdv") {
              columnCurrent.push(columnNumber);
            }

            if (columnKey === "total") {
              columnCurrent.push(columnNumber);

              // @ts-ignore
              columnLocationTotal = cell["_address"].replaceAll(
                /[^a-zA-Z]/g,
                ""
              );
            }
            if (columnKey === "qtd") {
              // @ts-ignore
              columnLocationQtd = cell["_address"].replaceAll(/[^a-zA-Z]/g, "");
            }
            if (columnKey === "list28") {
              columnCurrent.push(columnNumber);

              // @ts-ignore
              columnLocationList28 = cell["_address"].replaceAll(
                /[^a-zA-Z]/g,
                ""
              );
            }
            if (columnKey === "packageQuantity") {
              // @ts-ignore
              columnLocationPackageQuantity = cell["_address"].replaceAll(
                /[^a-zA-Z]/g,
                ""
              );
            }
          }
        });
      });

      columnCurrent.forEach(
        (index) =>
          (sheet.getColumn(index).numFmt = "R$#,##0.00;[Red]-R$#,##0.00")
      );

      responseProducts.products.forEach((_, index) => {
        const column = index + 2;

        // @ts-ignore
        sheet.getCell(`${columnLocationTotal}${column}`).value = {
          formula: `${columnLocationQtd}${column} * ${columnLocationPackageQuantity}${column} * SUM(${columnLocationList28}${column})`,
        };
      });

      sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
        row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
          //@ts-ignore
          let columnKey = cell["_column"]["_key"];

          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };

          if (rowNumber !== 1) {
            row.height = 90;
          }

          if (rowNumber === 1) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "4473c5" },
            };

            cell.font.color = { argb: "ffffff" };

            if (["qtd", "total"].includes(columnKey)) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "22a883" },
              };
            }
          }

          // cell.border = {
          //   top: { style: "thin" },
          //   left: { style: "thin" },
          //   bottom: { style: "thin" },
          //   right: { style: "thin" },
          // };
        });
      });

      await promise;

      workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "produtos.xlsx";
        anchor.click();
        window.URL.revokeObjectURL(url);
      });

      if (toastIdRef.current) {
        toast.update(toastIdRef.current, {
          description: "relatório gerado!",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);

      if (toastIdRef.current) {
        toast.update(toastIdRef.current, {
          description: "Ocorreu um erro ao gerar Catálogo.",
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      }
    }
  }

  useEffect(() => {
    if (isActivatedCatalog && !isOpen) {
      onToggle();
    }
    if (!isActivatedCatalog && isOpen) {
      onToggle();
    }
  }, [isActivatedCatalog]);

  useEffect(() => {
    if (orderBy)
      setQueryParams({
        type: "set",
        data: { field: "orderby", value: orderBy },
      });
  }, [orderBy]);
  useEffect(() => {
    setQueryParams({ type: "set", data: { field: "search", value: search } });
  }, [search]);
  useEffect(() => {
    setQueryParams({
      type: "set",
      data: { field: "distinct", value: groupProduct },
    });
  }, [groupProduct]);

  useEffect(() => {
    const scrollY = Number(scrollPosition);
    if (!isNaN(scrollY)) {
      window.scrollTo({ top: scrollY, behavior: "smooth" });
      onRemoveScrollPosition();
    }
  }, [scrollPosition]);

  return (
    <>
      <Head>
        <title>Produtos | App Alpar do Brasil</title>
      </Head>

      <HeaderNavigation
        title="Produtos"
        contentHeight={2.5}
        content={
          <Flex
            w="full"
            justify="space-around"
            display={["flex", "flex", "flex", "none"]}
          >
            <Button
              bg="white"
              borderRadius={0}
              w="full"
              onClick={onOpenOrderBy}
            >
              Ordenação
            </Button>
            <Button
              bg="white"
              borderRadius={0}
              borderLeft="1px solid #ccc"
              w="full"
              onClick={onOpenFilter}
            >
              Filtros
              {filters.length > 0 && (
                <Flex
                  borderRadius="full"
                  bg="primary"
                  ml="1.5"
                  h="1.6rem"
                  w="1.6rem"
                  align="center"
                  justify="center"
                >
                  <Text fontSize="smaller" color="white">
                    {filters.length}
                  </Text>
                </Flex>
              )}
            </Button>
          </Flex>
        }
        Right={
          user.eCliente ? (
            CLIENT_EMAILS_ACCEPT_STORE.includes(user.email) && (
              <ShoppingButton
                onClick={onOpenOrder}
                qtdItens={totalItems}
                disabledTitle
              />
            )
          ) : (
            <Box display={["block", "block", "block", "none"]}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<SiMicrosoftexcel />}
                  fontSize="1.5rem"
                  color="white"
                  ml="-1"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                />
                <MenuList>
                  <MenuItem fontSize="md" onClick={() => handleExportList({})}>
                    Exportar listagem com Imagem
                  </MenuItem>
                  <MenuItem
                    fontSize="md"
                    onClick={() => handleExportList({ noImage: true })}
                  >
                    Exportar listagem sem Imagem
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          )
        }
        Center={
          <Box width={"100%"} paddingX={["0.5rem", "0.5rem", "0.5rem", "0"]}>
            <Search
              size={"md"}
              handleChangeSearch={(search) => {
                setSearch(search);
              }}
              currentSearch={search}
              placeholder="Buscar na Alpar do Brasil por produtos"
            />
          </Box>
        }
      />

      <PanelLayout isLoading={isLoadingProductsFilters}>
        {isVisibleFilters && (
          <Flex
            w="18rem"
            mr="8"
            display={["none", "none", "none", "flex"]}
            flexDirection="column"
          >
            <Flex
              justify="space-between"
              bg="white"
              p="4"
              mb="2"
              borderRadius="md"
            >
              <Text fontWeight="bold">Agrupar produtos</Text>
              <Switch
                isChecked={!!groupProduct}
                onChange={(e) =>
                  setGroupProduct(
                    e.target.checked ? "codigoAlternativo" : undefined
                  )
                }
                size="lg"
                colorScheme="red"
              />
            </Flex>

            <Box borderRadius="md">
              <FilterSelectedList filters={filters} setFilters={setFilters} />

              {productsFilters?.filters.find((f) => f.name === "salePrices")
                ?.name && (
                <Accordion isOpen={false} title="Preço de venda" mb="2">
                  <FilterRangeAmount
                    onChangeRange={([min, max]) => {
                      const newFilters = [
                        {
                          name: "salePrices",
                          field: `PDV mínimo (${min.toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })})`,
                          value: min,
                        },
                        {
                          name: "salePrices",
                          field: `PDV máximo (${max.toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })})`,
                          value: max,
                        },
                      ];
                      const normalized = filters.filter(
                        (f) => f.name !== "salePrices"
                      );
                      setFilters([...normalized, ...newFilters]);
                    }}
                    defaultMin={
                      Number(
                        productsFilters?.filters.find(
                          (f) => f.name === "salePrices"
                        )?.data[0].value
                      ) ?? 0
                    }
                    defaultMax={
                      Number(
                        productsFilters?.filters.find(
                          (f) => f.name === "salePrices"
                        )?.data[1].value
                      ) ?? 0
                    }
                  />
                </Accordion>
              )}

              {productsFilters?.filters && (
                <ListFilter
                  filters={productsFilters.filters?.filter(
                    (f) => !["salePrices"].includes(f.name)
                  )}
                  selectedFilter={filters}
                  onChangeSelectedFilter={(a) => {
                    setFilters(a);
                  }}
                />
              )}
            </Box>
          </Flex>
        )}

        <Box w="full">
          <HeaderToList
            title="Produtos"
            orderBy={{
              onChange: setOrderBy,
              currentValue: orderBy,
              data: productsOrderBy,
            }}
          >
            {!isVisibleFilters && (
              <Button
                borderRadius={0}
                onClick={onOpenFilter}
                variant="outline"
                rounded="md"
                ml="4"
              >
                Filtros
                {filters.length > 0 && (
                  <Flex
                    borderRadius="full"
                    bg="primary"
                    ml="1.5"
                    h="1.6rem"
                    w="1.6rem"
                    align="center"
                    justify="center"
                  >
                    <Text fontSize="smaller" color="white">
                      {filters.length}
                    </Text>
                  </Flex>
                )}
              </Button>
            )}

            {!user.eCliente && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<SiMicrosoftexcel />}
                  variant="outline"
                  color="gray.800"
                  fontSize="1.5rem"
                  ml="2"
                />
                <MenuList>
                  <MenuItem fontSize="md" onClick={() => handleExportList({})}>
                    Exportar listagem com Imagem
                  </MenuItem>
                  <MenuItem
                    fontSize="md"
                    onClick={() => handleExportList({ noImage: true })}
                  >
                    Exportar listagem sem Imagem
                  </MenuItem>
                </MenuList>
              </Menu>
            )}

            <Flex
              justify="center"
              align="center"
              flexDir="row"
              ml="auto"
              mr="4"
            >
              <Text as={"span"} fontSize="sm" fontWeight="normal">
                OCULTAR FILTROS
              </Text>
              <SwitchUI
                className="ml-2 "
                checked={!isVisibleFilters}
                onCheckedChange={(e) => setIsVisibleFilters(!e)}
              />
            </Flex>
          </HeaderToList>

          <ListProducts
            orderby={orderBy}
            distinct={groupProduct ? "codigoAlternativo" : undefined}
            search={search}
            isCatalog={!user.eCliente}
            isButtonAddCart={
              user.eCliente && CLIENT_EMAILS_ACCEPT_STORE.includes(user.email)
            }
            filters={filters}
          />
        </Box>
      </PanelLayout>

      <ModalFilter
        isOpen={isOpenFilter}
        onClose={onCloseFilter}
        dataFilters={
          productsFilters?.filters?.filter(
            (f) => !["salePrices"].includes(f.name)
          ) ?? []
        }
        filters={filters}
        setFilters={setFilters}
      >
        <>
          <Flex
            justify="space-between"
            bg="white"
            p="4"
            mb="2"
            borderRadius="md"
          >
            <Text fontWeight="bold">Agrupar produtos</Text>
            <Switch
              isChecked={!!groupProduct}
              onChange={(e) =>
                setGroupProduct(
                  e.target.checked ? "codigoAlternativo" : undefined
                )
              }
              size="lg"
              colorScheme="red"
            />
          </Flex>

          {productsFilters?.filters.find((f) => f.name === "salePrices")
            ?.name && (
            <Accordion isOpen={false} title="Preço de venda" mb="2">
              <FilterRangeAmount
                onChangeRange={([min, max]) => {
                  const newFilters = [
                    {
                      name: "salePrices",
                      field: `PDV mínimo (${min.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })})`,
                      value: min,
                    },
                    {
                      name: "salePrices",
                      field: `PDV máximo (${max.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })})`,
                      value: max,
                    },
                  ];
                  const normalized = filters.filter(
                    (f) => f.name !== "salePrices"
                  );
                  setFilters([...normalized, ...newFilters]);
                }}
                defaultMin={
                  Number(
                    productsFilters?.filters.find(
                      (f) => f.name === "salePrices"
                    )?.data[0].value
                  ) ?? 0
                }
                defaultMax={
                  Number(
                    productsFilters?.filters.find(
                      (f) => f.name === "salePrices"
                    )?.data[1].value
                  ) ?? 0
                }
              />
            </Accordion>
          )}
        </>
      </ModalFilter>

      <ModalOrderBy
        isOpen={isOpenOrderBy}
        onClose={onCloseOrderBy}
        orderByItems={productsOrderBy}
        currentOrderByValue={orderBy}
        setOrderBy={(orderByValue) => {
          setOrderBy(String(orderByValue));
          onCloseOrderBy();
        }}
      />

      <Slide direction="bottom" in={isOpen} style={{ zIndex: 10 }}>
        <Box p={["100px", "100px", "100px", "50px"]}>
          <Flex
            bg="white"
            position="fixed"
            bottom={["3.5rem", "3.5rem", "3.5rem", 0]}
            left="0"
            w="full"
            justify={"center"}
            boxShadow="dark-lg"
          >
            <Flex
              maxW="900px"
              w="full"
              px={["4", "4", "4", "8"]}
              py={["4", "4", "4", "6"]}
              justify="space-between"
            >
              <Box>
                <Text fontSize={["lg", "lg", "lg", "3xl"]} fontWeight="bold">
                  CATÁLOGO
                </Text>

                <Text
                  display={["block", "block", "block", "none"]}
                  color="gray.500"
                >{`${productsSelectedCatalog.length} produtos selecionados`}</Text>
              </Box>

              <Flex justify="center" align="center" columnGap="2">
                <Text fontWeight="light" fontSize="md">
                  Mostrar estoque
                </Text>
                <Switch
                  isChecked={!!stockLocation}
                  onChange={(e) => setStockLocation(e.target.checked)}
                  size="sm"
                  colorScheme="red"
                />
              </Flex>

              <Stack>
                <Text
                  display={["none", "none", "none", "block"]}
                  color="gray.500"
                >{`${productsSelectedCatalog.length} produtos selecionados`}</Text>

                <Stack
                  direction={["column", "column", "column", "row"]}
                  spacing="4"
                >
                  <Button
                    type="button"
                    size={"sm"}
                    variant="link"
                    color="gray.800"
                    onClick={() =>
                      onGenerateCatalog({
                        orderBy: orderBy,
                        groupProduct: groupProduct === "codigoAlternativo",
                        stockLocation: stockLocation,
                        filters: JSON.stringify(
                          filters.filter((f) =>
                            [
                              "linhaCodigo",
                              "colecaoCodigo",
                              "grupoCodigo",
                              "locaisEstoque",
                              "concept",
                            ].includes(f.name)
                          )
                        ),
                      })
                    }
                  >
                    GERAR
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    color="gray.800"
                    onClick={() =>
                      onSelectedAllProductCatalog(
                        filters,
                        orderBy,
                        groupProduct === "codigoAlternativo"
                      )
                    }
                  >
                    MARCAR TODOS
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    color="gray.800"
                    onClick={onRemoveAllProductCatalog}
                  >
                    DESMARCAR TODOS
                  </Button>
                </Stack>
              </Stack>
            </Flex>
          </Flex>
        </Box>
      </Slide>

      <Cart isOpen={isOpenOrder} onClose={onCloseOrder} />
    </>
  );
}
