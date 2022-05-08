import { Flex, Image, Link as ChakraLink, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProductProps {
  id: string;
  name: string;
  uri: string;
}
interface ProductComponentProps {
  product: ProductProps;
}

export function Product({ product }: ProductComponentProps) {
  const { id, name, uri } = product;

  const MotionLink = motion(ChakraLink);
  return (
    <Link href={`/produtos/${id}`} passHref>
      <MotionLink
        bg="white"
        px="2"
        py="4"
        borderRadius="6"
        boxShadow="base"
        // transition="box-shadow .4s ease-in-out,-webkit-box-shadow .2s ease-in-out;"
        _hover={{
          textDecoration: "none",
        }}
        whileHover={{ boxShadow: "0px 10px 15px 4px rgba(0,0,0,0.20)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        whileTap={{ scale: 0.9 }}
      >
        <Flex
          flexDir="column"
          justifyContent="space-between"
          alignItems="center"
          h="full"
        >
          <Image
            src={uri}
            maxH="240"
            objectFit="contain"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src =
                "https://alpar.sfo3.digitaloceanspaces.com/Alpar/no-image.jpg";
            }}
          />
          <Text mt="4" fontSize="sm" fontWeight="light">
            {name}
          </Text>
        </Flex>
      </MotionLink>
    </Link>
  );
}
