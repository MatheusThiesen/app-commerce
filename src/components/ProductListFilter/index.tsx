import { Stack } from "@chakra-ui/react";
import { memo } from "react";
import { FilterList } from "../../hooks/queries/useProducts";
import { FilterItem } from "../FilterItem";

interface ProductListFilterProps {
  filters: FilterList[];
  selectedFilter: SelectedFilter[];
  onChangeSelectedFilter: (a: SelectedFilter[]) => void;

  isOpen?: boolean;
}
export interface SelectedFilter {
  name: string;
  value: string | number;
  field: string | number;
}

export function ProductListFilterComponent({
  filters,
  onChangeSelectedFilter,
  selectedFilter,
  isOpen,
}: ProductListFilterProps) {
  return (
    <Stack flexDirection="column" spacing="2">
      {filters.map((filter, index) => (
        <FilterItem
          key={filter.name}
          AccordionItem={{
            // border: index - 1 === filter.data.length ? 0 : undefined,
            border: 0,
          }}
          title={filter.label}
          name={filter.name}
          data={filter.data.map((item) => ({
            name: item.name,
            value: item.value,
            field: item.name,
          }))}
          selectedFilter={selectedFilter}
          onChangeSelectedFilter={onChangeSelectedFilter}
          isOpen={isOpen}
        />
      ))}
    </Stack>
  );
}

export const ProductListFilter = memo(
  ProductListFilterComponent,
  (prevProps, nextProps) =>
    Object.is(prevProps.filters, nextProps.filters) &&
    Object.is(prevProps.selectedFilter, nextProps.selectedFilter)
);
