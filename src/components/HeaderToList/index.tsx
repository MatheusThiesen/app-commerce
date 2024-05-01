import { Flex, Spinner, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { OrderBy, OrderByProps } from "../OrderBy";

interface HeaderToListProps {
  title: string;
  total?: number;
  isLoading?: boolean;
  orderBy?: OrderByProps;
  children?: ReactNode;
}

export const HeaderToList = ({
  title,
  isLoading = false,
  total,
  orderBy,
  children,
}: HeaderToListProps) => {
  return (
    <Flex display={["none", "none", "none", "block"]}>
      <Flex>
        <Text
          as="h1"
          fontSize="4xl"
          fontWeight="bold"
          color="gray.700"
          lineHeight="2rem"
        >
          {title}
          {isLoading && <Spinner ml="4" size="md" />}
        </Text>

        {children}
      </Flex>

      <Flex justifyContent="space-between" mt="1" mb="2">
        <Text fontSize="md" color="gray.600">
          {total && `Total ${total} resultados`}
        </Text>

        {orderBy && (
          <OrderBy
            onChange={orderBy.onChange}
            currentValue={orderBy.currentValue}
            data={orderBy.data}
          />
        )}
      </Flex>
    </Flex>
  );
};
