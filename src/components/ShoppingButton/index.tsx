import { Button, ButtonProps, Flex, Icon, Text } from "@chakra-ui/react";
import { AiOutlineShoppingCart } from "react-icons/ai";

interface ShoppingButtonProps extends ButtonProps {
  qtdItens: number;
}

export const ShoppingButton = ({ qtdItens, ...rest }: ShoppingButtonProps) => {
  return (
    <Button mr="4" variant="unstyled" position="relative" {...(rest as any)}>
      {qtdItens > 0 && (
        <Flex
          w="1.3rem"
          h="1.3rem"
          bg="white"
          borderRadius="full"
          position="absolute"
          top="-0.1rem"
          left="-1rem"
          justify="center"
          align="center"
        >
          <Text fontSize={"small"} color={"gray.900"}>
            {qtdItens}
          </Text>
        </Flex>
      )}

      <Icon as={AiOutlineShoppingCart} color="white" fontSize={"2rem"} />
    </Button>
  );
};
