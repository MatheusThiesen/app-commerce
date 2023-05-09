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
import Router from "next/router";
import { IoArrowBack } from "react-icons/io5";
import { PriceList, pricesList } from "../../contexts/StoreContext";
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
  function handleSelectPriceList(codigo: number | string) {
    const findPriceList = pricesList.find((f) => f.value === Number(codigo));

    if (findPriceList) {
      setPriceList({
        codigo: findPriceList.value,
        descricao: findPriceList.name,
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
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Stack>
            <Box>
              <Button
                variant="unstyled"
                onClick={() => {
                  Router.back();
                  setTimeout(() => {
                    onClose();
                  }, 200);
                }}
                display={"flex"}
                alignItems="center"
              >
                <Icon as={IoArrowBack} fontSize="1.8rem" mr="2" />
                Voltar
              </Button>
            </Box>

            <Flex align="center" justify="center">
              <Text fontSize="2xl">Selecionar Lista de Preço</Text>
            </Flex>
          </Stack>
        </ModalHeader>

        <ModalBody bg="gray.50" borderBottomRadius="md" p="0">
          <OrderByMobile
            OrderByItems={pricesList}
            currentOrderByValue={currentValue}
            setOrderBy={handleSelectPriceList}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
