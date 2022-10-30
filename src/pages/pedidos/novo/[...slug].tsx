import {
  Box,
  Button,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaMoneyCheckAlt, FaUser } from "react-icons/fa";
import { IoBagHandleSharp } from "react-icons/io5";
// import { useBottonNavigation } from "../../../hooks/useBottomNavigation";

import { TabOrder } from "../../../components/TabOrder";

export default function Pedido() {
  // const { widthNavigationY } = useBottonNavigation();
  const widthNavigationY = 1;
  const [headerSizeY, setHeaderSizeY] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  function handleNextTab() {
    setTabIndex((old) => old + 1);
  }

  return (
    <>
      {/* <Header getHeaderY={(value) => setHeaderSizeY(value)} isGoBack /> */}

      <Box pt={headerSizeY} pb={`calc(${widthNavigationY} + 4rem)`}>
        <Box p="4">
          <Tabs
            bg="white"
            p="2"
            borderRadius="md"
            variant="line"
            colorScheme="red"
            index={tabIndex}
            onChange={setTabIndex}
          >
            <TabList>
              <TabOrder title="Cliente" icon={FaUser} />
              <TabOrder title="Tabela de preço" icon={FaMoneyCheckAlt} />
              <TabOrder title="Pedido" icon={IoBagHandleSharp} />
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box>
                  {/* <Button>
                    <Text>Selecionar Cliente</Text>
                  </Button> */}

                  <Box>
                    <Tag size="lg" variant="solid" color="white" bg="red.500">
                      <TagLabel>35591</TagLabel>
                      <TagCloseButton />
                    </Tag>

                    <Box mt="1.5">
                      <Text>A LEANDRO BAZAR E PAPELARIA</Text>

                      <Text
                        fontWeight="light"
                        fontSize="small"
                        color="gray.500"
                      >
                        04.896.434/0001-72
                      </Text>
                      <Text
                        fontWeight="light"
                        fontSize="small"
                        color="gray.500"
                      >
                        AV. DORIVAL CÂNDIDO LUZ DE OLIVEIRA, 8018 -
                      </Text>
                      <Text
                        fontWeight="light"
                        fontSize="small"
                        color="gray.500"
                      >
                        BOM PRINCÍPIO,GRAVATAÍ - RS
                      </Text>
                    </Box>

                    <Button
                      mt="10"
                      w="full"
                      maxW={["full", "25rem"]}
                      colorScheme="red"
                      onClick={handleNextTab}
                    >
                      Avançar
                    </Button>
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box>
                  {/* <Button>
                    <Text>Selecionar Cliente</Text>
                  </Button> */}

                  <Box>
                    <Tag size="lg" variant="solid" color="white" bg="red.500">
                      <TagLabel>TABELA 28 DIAS</TagLabel>
                      <TagCloseButton />
                    </Tag>

                    <Box mt="1.5">
                      <Text>TABELA DE PREÇO</Text>

                      <Text
                        fontWeight="light"
                        fontSize="small"
                        color="gray.500"
                      >
                        TABELA 28 DIAS
                      </Text>
                    </Box>

                    <Button
                      mt="10"
                      w="full"
                      maxW={["full", "25rem"]}
                      colorScheme="red"
                      onClick={handleNextTab}
                    >
                      Avançar
                    </Button>
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel>
                <Box>
                  <Box>
                    <Button
                      mt="10"
                      w="full"
                      maxW={["full", "25rem"]}
                      colorScheme="red"
                    >
                      Finalizar pedido
                    </Button>
                  </Box>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </>
  );
}
