import { Box, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { defaultNoImage, spaceImages } from "../../global/parameters";
import { VariationsProduct as VariationsProductQueryHook } from "../../hooks/queries/useProducts";

interface VariationsProductProps {
  variationsProduct: VariationsProductQueryHook[];
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
          <LazyLoadImage
            className="w-full h-full object-contain object-center"
            src={`${spaceImages}/Produtos/${
              variation.imagemPreview
                ? variation.imagemPreview
                : variation.referencia + "_01"
            }_smaller`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = defaultNoImage;
            }}
            effect="blur"
            wrapperProps={{
              style: { transitionDelay: "0.2s" },
            }}
          />
        </Box>
      ))}
    </HStack>
  );
}
