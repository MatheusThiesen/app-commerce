import { Box } from "@chakra-ui/react";
import { FilterList } from "../../@types/api-queries";
import { FilterSelectedList } from "../FilterSelectedList";
import { ListFilter, SelectedFilter } from "../ListFilter";
import { ModalList } from "../ModalList";

interface ModelFilterProps {
  dataFilters: FilterList[];
  filters: SelectedFilter[];
  setFilters: (i: SelectedFilter[]) => void;

  isOpen: boolean;
  onClose: () => void;
}

export const ModelFilter = ({
  isOpen,
  onClose,
  dataFilters,
  filters,
  setFilters,
}: ModelFilterProps) => {
  return (
    <ModalList title="Filtros" isOpen={isOpen} onClose={onClose}>
      <Box borderRadius="md">
        <FilterSelectedList filters={filters} setFilters={setFilters} />

        <Box p="6">
          {dataFilters && (
            <ListFilter
              filters={dataFilters}
              selectedFilter={filters}
              onChangeSelectedFilter={(a) => {
                setFilters(a);
              }}
            />
          )}
        </Box>
      </Box>
    </ModalList>
  );
};
