import { Stack } from "@chakra-ui/react";
import { memo } from "react";
import { FilterList } from "../../@types/api-queries";
import { FilterItem } from "../FilterItem";

export interface ListFilterProps {
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

export function ListFilterComponent({
  filters,
  onChangeSelectedFilter,
  selectedFilter,
  isOpen,
}: ListFilterProps) {
  return (
    <Stack flexDirection="column" spacing="2">
      {filters.map((filter) => (
        <FilterItem
          key={filter.name}
          AccordionItem={{
            border: 0,
          }}
          title={filter.label}
          name={filter.name}
          data={filter.data}
          selectedFilter={selectedFilter}
          onChangeSelectedFilter={onChangeSelectedFilter}
          isOpen={isOpen}
        />
      ))}
    </Stack>
  );
}

export const ListFilter = memo(ListFilterComponent);
