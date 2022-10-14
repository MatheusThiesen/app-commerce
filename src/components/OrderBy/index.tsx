import { Flex, Select, Text } from "@chakra-ui/react";
interface OrderByProps {
  data: OrderByItem[];
  currentValue: string;
  onChange: (v: string) => void;
}

interface OrderByItem {
  name: string;
  value: string;
}

export function OrderBy({ data, onChange, currentValue }: OrderByProps) {
  return (
    <Flex align="center" color="gray.600">
      <Text fontSize="md" mr="1" whiteSpace="nowrap">
        Ordenar por
      </Text>
      <Select
        fontSize="md"
        value={currentValue}
        onChange={(e) => onChange(e.target.value)}
      >
        {data.map((item) => (
          <option key={item.value} value={item.value}>
            {item.name}
          </option>
        ))}
      </Select>
    </Flex>
  );
}
