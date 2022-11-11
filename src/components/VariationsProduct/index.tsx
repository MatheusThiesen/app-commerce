import { Box, HStack, Image } from "@chakra-ui/react";
import { VariationsProduct } from "../../hooks/queries/useProducts";

import Link from "next/link";

interface VariationsProductProps {
  variationsProduct: VariationsProduct[];
  currentReference: string;
}

export function VariationsProduct({
  variationsProduct,
  currentReference,
}: VariationsProductProps) {
  const spaceImages = "https://alpar.sfo3.digitaloceanspaces.com";
  return (
    <HStack spacing={1}>
      {variationsProduct?.map((variation) => (
        <Link
          href={`/produtos/${variation.codigo}`}
          key={variation.codigo}
          passHref
        >
          <Box
            as="a"
            w="4rem"
            h="4rem"
            borderRadius="md"
            // onClick={() => setImages([])}
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
              src={`${spaceImages}/Produtos/${variation.referencia}_01`}
              alt={variation.descricao}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src =
                  "https://alpar.sfo3.digitaloceanspaces.com/Alpar/no-image.jpg";
              }}
            />
          </Box>
        </Link>
      ))}
    </HStack>
  );
}
