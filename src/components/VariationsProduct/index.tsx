import { Box, HStack, Image } from "@chakra-ui/react";
import { VariationsProduct } from "../../hooks/queries/useProducts";

import { useRouter } from "next/router";
import { defaultNoImage, spaceImages } from "../../global/parameters";

interface VariationsProductProps {
  variationsProduct: VariationsProduct[];
  currentReference: string;
  uri?: string;
  hrefBack?: string;
  onClick?: (code: number) => void;
}

export function VariationsProduct({
  variationsProduct,
  currentReference,
  uri,
  hrefBack,
  onClick,
}: VariationsProductProps) {
  const router = useRouter();

  function handleClickVariant(code: number) {
    if (uri) {
      router.push(`${uri}/${code}?hrefBack=${hrefBack}`);
    }
  }

  return (
    <HStack spacing={1} overflow="auto">
      {variationsProduct?.map((variation) => (
        <Box
          key={variation.codigo}
          as="a"
          w="4rem"
          minW="4rem"
          h="4rem"
          borderRadius="md"
          onClick={() => {
            if (currentReference !== variation.referencia) {
              handleClickVariant(variation.codigo);

              if (onClick) {
                onClick(variation.codigo);
              }
            }
          }}
          cursor={
            currentReference === variation.referencia ? "auto" : "pointer"
          }
          borderWidth={
            currentReference === variation.referencia ? "2px" : "1px"
          }
          borderColor={
            currentReference === variation.referencia ? "blue.500" : "gray.200"
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
      ))}
    </HStack>
  );
}
