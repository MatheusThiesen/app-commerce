import { Box, Flex, List, ListItem, Text } from "@chakra-ui/react";
import { memo } from "react";
export interface OrderByMobileProps {
  orderByItems: OrderByItem[];
  setOrderBy: (e: string | number) => void;
  currentOrderByValue?: string | number;
}

interface OrderByItem {
  name: string;
  value: string | number;
}

function OrderByMobileComponent({
  orderByItems,
  setOrderBy,
  currentOrderByValue,
}: OrderByMobileProps) {
  return (
    <List>
      {orderByItems.map((item, index) => (
        <ListItem
          bg="white"
          key={item.value}
          borderBottom="1px"
          borderTop={index <= 0 ? "1px" : "0px"}
          borderColor="gray.100"
          cursor="pointer"
          position="relative"
          onClick={() => {
            setOrderBy(item.value);
          }}
          _hover={{
            filter: "brightness(0.95)",
            cursor: "pointer",
          }}
        >
          {currentOrderByValue && currentOrderByValue === item.value && (
            <Flex position="absolute" w="2" h="100%" align="center" left="1">
              <Box w="100%" h="90%" bg="primary" borderRadius="sm" />
            </Flex>
          )}

          <Text px="5" py="5">
            {item.name}
          </Text>
        </ListItem>
      ))}
    </List>
  );
}

export const OrderByMobile = memo(OrderByMobileComponent);
