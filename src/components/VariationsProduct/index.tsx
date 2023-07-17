import { Box, HStack, Image } from "@chakra-ui/react";
import { VariationsProduct } from "../../hooks/queries/useProducts";

import Link from "next/link";
import { defaultNoImage, spaceImages } from "../../global/parameters";

interface VariationsProductProps {
  variationsProduct: VariationsProduct[];
  currentReference: string;
  uri: string;
  onClick?: () => void;
}

export function VariationsProduct({
  variationsProduct,
  currentReference,
  uri,
  onClick,
}: VariationsProductProps) {
  return (
    <HStack spacing={1} overflow="auto">
      {variationsProduct?.map((variation) => (
        <Link
          href={`${uri}/${variation.codigo}`}
          key={variation.codigo}
          passHref
        >
          <Box
            as="a"
            w="4rem"
            minW="4rem"
            h="4rem"
            borderRadius="md"
            onClick={onClick && onClick}
            cursor={
              currentReference === variation.referencia ? "auto" : "pointer"
            }
            borderWidth={
              currentReference === variation.referencia ? "2px" : "1px"
            }
            borderColor={
              currentReference === variation.referencia
                ? "blue.500"
                : "gray.200"
            }
          >
            <Image
              w="full"
              h="full"
              objectFit="contain"
              src={`${spaceImages}/Produtos/${
                variation.imagens && variation.imagens[0]
                  ? variation.imagens[0].nome
                  : variation.referencia + "_01"
              }_smaller`}
              alt={variation.descricao}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = defaultNoImage;
              }}
            />
          </Box>
        </Link>
      ))}
    </HStack>
  );
}
