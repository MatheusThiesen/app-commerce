import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
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

  children?: ReactNode;
  placement?: "right" | "left";
}

export const ModalFilter = ({
  isOpen,
  onClose,
  dataFilters,
  filters,
  setFilters,
  placement,
  children,
}: ModelFilterProps) => {
  return (
    <ModalList
      title="Filtros"
      isOpen={isOpen}
      onClose={onClose}
      placement={placement}
    >
      <Box borderRadius="md">
        <FilterSelectedList filters={filters} setFilters={setFilters} />

        <Box p="6">
          {children}

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
