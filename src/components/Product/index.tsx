import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoMdHeartEmpty } from "react-icons/io";

interface ProductProps {
  id: string;
  name: string;
  priceSale: string;
  reference: string;
  uri: string;
}
interface ProductComponentProps {
  product: ProductProps;
}

export function Product({ product }: ProductComponentProps) {
  const { id, name, reference, priceSale, uri } = product;

  const MotionBox = motion(Box);
  return (
    <MotionBox
      bg="white"
      px="4"
      py="4"
      borderRadius="2"
      boxShadow="base"
      // transition="box-shadow .4s ease-in-out,-webkit-box-shadow .2s ease-in-out;"
      _hover={{
        textDecoration: "none",
      }}
      whileHover={{ boxShadow: "0px 10px 15px 4px rgba(0,0,0,0.20)" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      whileTap={{ scale: 0.95 }}
    >
      <Flex
        position="relative"
        flexDir="column"
        pt="2rem"
        alignItems="start"
        h="full"
      >
        <Box position="absolute" top="0" right="0">
          <Button h="2.5rem" w="2.5rem" p="0" borderRadius="full">
            <Icon
              as={IoMdHeartEmpty} //IoIosHeart
              fontSize="20"
            />
          </Button>
        </Box>
        <Link href={`/produtos/${id}`} passHref>
          <ChakraLink _hover={{}}>
            <Flex w="full" flexDirection="column" align="center">
              <Image
                height="10rem"
                src={uri}
                objectFit="contain"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src =
                    "https://alpar.sfo3.digitaloceanspaces.com/Alpar/no-image.jpg";
                }}
              />
            </Flex>

            <Box>
              <Text mt="4" mb="4" fontSize="md" fontWeight="light">
                {name}
              </Text>

              <Text fontSize="small" color="gray.600" fontWeight="light">
                Referência {reference}
              </Text>
              <Text fontSize="sm" fontWeight="bold">
                PDV {priceSale}
              </Text>
            </Box>
          </ChakraLink>
        </Link>
      </Flex>
    </MotionBox>
  );
}
