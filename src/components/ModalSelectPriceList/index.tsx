import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IoArrowBack } from "react-icons/io5";
import { PriceList } from "../../contexts/StoreContext";
import { usePriceList } from "../../hooks/queries/usePriceList";
import { OrderByMobile } from "../OrderByMobile";

interface ModalSelectPriceListProps {
  isOpen: boolean;
  onClose: () => void;
  setPriceList: (c: PriceList) => void;
  currentValue?: number;
}

export function ModalSelectPriceList({
  onClose,
  isOpen,
  setPriceList,
  currentValue,
}: ModalSelectPriceListProps) {
  const { data } = usePriceList();

  function handleSelectPriceList(codigo: number | string) {
    const findPriceList = data?.priceLists.find(
      (f) => f.codigo === Number(codigo)
    );

    if (findPriceList) {
      setPriceList({
        codigo: findPriceList.codigo,
        descricao: findPriceList.descricao,
      });
      onClose();
    }
  }

  return (
    <Modal
      onClose={onClose}
      size={["full", "full", "full", "4xl"]}
      isOpen={isOpen}
      scrollBehavior="inside"
    >
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent>
        <ModalHeader>
          <Stack>
            <Box>
              <Button
                variant="unstyled"
                onClick={() => {
                  onClose();
                }}
                display={"flex"}
                alignItems="center"
              >
                <Icon as={IoArrowBack} fontSize="1.8rem" mr="2" />
                Fechar
              </Button>
            </Box>

            <Flex align="center" justify="center">
              <Text fontSize="2xl">Selecionar Lista de Preço</Text>
            </Flex>
          </Stack>
        </ModalHeader>

        <ModalBody bg="gray.50" borderBottomRadius="md" p="0">
          <OrderByMobile
            orderByItems={
              data?.priceLists.map((item) => ({
                name: item.descricao,
                value: item.codigo,
              })) ?? []
            }
            currentOrderByValue={currentValue}
            setOrderBy={handleSelectPriceList}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
