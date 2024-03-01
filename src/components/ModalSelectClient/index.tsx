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
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useInView } from "react-intersection-observer";
import {
  Client as ClientProps,
  useClients,
} from "../../hooks/queries/useClients";
import { Client } from "../Client";
import { LoadingInfiniteScroll } from "../LoadingInfiniteScroll";
import { Search } from "../Search";

interface ModalSelectClientProps {
  isOpen: boolean;
  onClose: () => void;
  setClient: (c: ClientProps) => void;
}

export function ModalSelectClient({
  onClose,
  isOpen,
  setClient,
}: ModalSelectClientProps) {
  const { ref, inView } = useInView();
  const [search, setSearch] = useState("");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useClients({
      pagesize: 10,
      search: search,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

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
              <Text fontSize="2xl">Selecionar Cliente</Text>
            </Flex>

            <Search
              setSearch={setSearch}
              search={search}
              placeholder="Buscar cliente"
            />
          </Stack>
        </ModalHeader>

        <ModalBody bg="gray.50" px="1rem" borderBottomRadius="md">
          <LoadingInfiniteScroll
            isLoading={isLoading}
            isLoadingNextPage={isFetchingNextPage}
          >
            <Stack mb="1rem" mt="1rem">
              {data?.pages.map((page) =>
                page?.clients.map((client, i) =>
                  i === page?.clients?.length - 3 ? (
                    <Box
                      ref={ref}
                      key={client.codigo}
                      onClick={() => {
                        setClient(client);

                        onClose();
                      }}
                      _hover={{
                        filter: "brightness(0.95)",
                        cursor: "pointer",
                      }}
                    >
                      <Client client={client} />
                    </Box>
                  ) : (
                    <Box
                      key={client.codigo}
                      onClick={() => {
                        setClient(client);
                        onClose();
                      }}
                      _hover={{
                        filter: "brightness(0.95)",
                        cursor: "pointer",
                      }}
                    >
                      <Client client={client} />
                    </Box>
                  )
                )
              )}
            </Stack>
          </LoadingInfiniteScroll>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
