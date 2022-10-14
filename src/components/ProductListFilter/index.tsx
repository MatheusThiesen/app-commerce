import { Flex } from "@chakra-ui/react";
import { memo } from "react";
import { FilterList } from "../../hooks/queries/useProducts";
import { FilterItem } from "../FilterItem";

interface ProductListFilterProps {
  filters: FilterList[];
  selectedFilter: SelectedFilter[];
  onChangeSelectedFilter: (a: SelectedFilter[]) => void;
}
export interface SelectedFilter {
  name: string;
  value: string | number;
}

export function ProductListFilterComponent({
  filters,
  onChangeSelectedFilter,
  selectedFilter,
}: ProductListFilterProps) {
  return (
    <Flex flexDirection="column">
      {filters.map((filter, index) => (
        <FilterItem
          key={filter.name}
          AccordionItem={{
            border: index - 1 === filter.data.length ? 0 : undefined,
          }}
          title={filter.label}
          data={filter.data.map((item) => ({
            name: item.name,
            value: item.value,
          }))}
          selectedFilter={selectedFilter}
          onChangeSelectedFilter={onChangeSelectedFilter}
        />
      ))}
    </Flex>
  );
}

export const ProductListFilter = memo(
  ProductListFilterComponent,
  (prevProps, nextProps) =>
    Object.is(prevProps.filters, nextProps.filters) &&
    Object.is(prevProps.selectedFilter, nextProps.selectedFilter)
);
