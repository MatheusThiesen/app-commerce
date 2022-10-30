import { Box, Flex, List, ListItem, Text } from "@chakra-ui/react";
import { memo } from "react";
interface OrderByMobileProps {
  OrderByItems: OrderByItem[];
  setOrderBy: (e: string) => void;
  currentOrderByValue: string;
}

interface OrderByItem {
  name: string;
  value: string;
}

function OrderByMobileComponent({
  OrderByItems,
  setOrderBy,
  currentOrderByValue,
}: OrderByMobileProps) {
  return (
    <List>
      {OrderByItems.map((item, index) => (
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
        >
          {currentOrderByValue === item.value && (
            <Flex position="absolute" w="2" h="100%" align="center" left="1">
              <Box w="100%" h="90%" bg="red.500" borderRadius="sm" />
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
