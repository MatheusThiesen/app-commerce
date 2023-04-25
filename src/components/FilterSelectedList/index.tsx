import {
  Box,
  Button,
  Flex,
  Icon,
  List,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/react";
import { memo } from "react";
import { TiDelete } from "react-icons/ti";
import { SelectedFilter } from "../ListFilter";

interface FilterSelectedListProps {
  filters: SelectedFilter[];
  setFilters: (i: SelectedFilter[]) => void;
}

function FilterSelectedListComponent({
  filters,
  setFilters,
}: FilterSelectedListProps) {
  function handleRemoveOneFilter(filter: SelectedFilter) {
    const removeFilter = filters.filter((f) => f !== filter);

    setFilters(removeFilter);
  }

  function handleClearFilter() {
    setFilters([]);
  }

  if (filters.length <= 0) return null;

  return (
    <Stack pb="4" bg="white" p="4" borderRadius="md" mb="4">
      <Box>
        <Text fontWeight="bold" fontSize="lg">
          Filtros selecionados ({filters.length})
        </Text>
      </Box>
      <List spacing={1}>
        {filters.map((item) => (
          <ListItem key={item.name}>
            <Flex align="center" justify="space-between" px="2">
              <Text fontSize="sm" color="gray.500">
                {item.field}
              </Text>
              <Button
                type="button"
                onClick={() => handleRemoveOneFilter(item)}
                variant="unstyled"
                fontWeight={"light"}
                borderRadius="full"
                size={"xs"}
              >
                <Icon as={TiDelete} fontSize="2xl" color="gray.800" />
              </Button>
            </Flex>
          </ListItem>
        ))}
      </List>
      <Button
        type="button"
        size="sm"
        variant="solid"
        onClick={handleClearFilter}
      >
        Limpa Filtro
      </Button>
    </Stack>
  );
}

export const FilterSelectedList = memo(FilterSelectedListComponent);
