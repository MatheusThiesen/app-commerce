import {
  Accordion as AccordionChakra,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionItemProps,
  AccordionPanel,
  Box,
  Checkbox,
  Flex,
  Icon,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import SelectMultiple, { MultiValue } from "react-select";
import { SelectedFilter } from "../ProductListFilter";

interface ItemProps {
  name: string;
  value: number | string;
  field: string | number;
}

interface FilterItemProps {
  title: string;
  name: string;
  data: ItemProps[];
  isOpen?: boolean;

  selectedFilter: SelectedFilter[];
  onChangeSelectedFilter: (a: SelectedFilter[]) => void;

  AccordionItem?: AccordionItemProps;
}

export function FilterItem({
  title,
  data,
  name,
  selectedFilter,
  onChangeSelectedFilter,
  AccordionItem: AccordionItemProps,
  isOpen,
}: FilterItemProps) {
  const [search, setSearch] = useState("");

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function onChecked(item: ItemProps): boolean | undefined {
    const findOne = selectedFilter.some(
      (f) => f.value === item.value && f.name === name
    );

    return findOne ? true : false;
  }

  function handleSelectedFilter({
    item,
    checked,
  }: {
    item: ItemProps;
    checked: boolean;
  }): void {
    if (checked) {
      const date = selectedFilter;
      const newItem: ItemProps = {
        name: name,
        value: item.value,
        field: item.name,
      };
      onChangeSelectedFilter([...date, newItem]);
    } else {
      const date = selectedFilter.filter((f) => f.value !== item.value);
      onChangeSelectedFilter([...date]);
    }
  }

  function handleSearchSelected(
    e: MultiValue<{
      value: string | number;
      label: string;
    }>
  ) {
    const date = selectedFilter;
    const filtersName = selectedFilter.filter((f) => f.name === name);

    //Remover filtros
    const removeFilters = filtersName.filter(
      (f) => !e.map((t) => t.value).includes(f.value)
    );
    console.log("removeFilters", removeFilters);

    //Adicionar filtros
    const addFilters = e.filter(
      (f) => !filtersName.map((t) => t.value).includes(f.value)
    );
    console.log("addFilters", addFilters);

    const newItems: ItemProps[] = addFilters.map((item) => ({
      name: name,
      value: item.value,
      field: item.label,
    }));

    console.log("newItems", newItems);
    console.log(date, "date");

    onChangeSelectedFilter([...date, ...newItems]);
  }

  const filteredList = data.filter((i) =>
    search
      ? i.name
          .toString()
          .toLowerCase()
          .trim()
          .includes(search.toString().toLocaleLowerCase().trim())
      : data
  );

  if (["-referencia"].includes(name)) {
    return (
      <Box bg="white" p="4" borderRadius="md">
        <Box flex="1" textAlign="left">
          <Text fontSize="md" color="gray.800" fontWeight="bold">
            {title}
          </Text>
        </Box>

        <Box mt="4">
          <SelectMultiple
            placeholder="Buscar..."
            isMulti
            onChange={handleSearchSelected}
            name={name}
            options={filteredList.map((filter) => ({
              value: filter.value,
              label: filter.name,
            }))}
          />
        </Box>
      </Box>
    );
  } else {
  }

  return (
    <AccordionChakra
      defaultIndex={isOpen ? [0] : [1]}
      allowMultiple
      allowToggle
      w="full"
      bg="white"
      borderRadius="md"
    >
      <AccordionItem borderTop="0" {...(AccordionItemProps as any)}>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Text fontSize="md" color="gray.800" fontWeight="bold">
              {title}
            </Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel pb={2} pt={2}>
          {data.length > 6 && (
            <Flex
              h="2rem"
              mb="4"
              p="2"
              borderRadius="md"
              borderWidth="1.5px"
              align="center"
            >
              <Input
                name={"search" + title}
                border="0"
                h="full"
                w="90%"
                variant="unstyled"
                onChange={onChange}
                value={search}
              />

              <Icon as={IoIosSearch} />
            </Flex>
          )}

          <Stack spacing={1} maxH="150" overflowY="scroll">
            {filteredList.map((item) => {
              const isChecked = onChecked(item);
              return (
                <Checkbox
                  key={item.value}
                  isChecked={isChecked}
                  value={item.value}
                  onChange={(e) =>
                    handleSelectedFilter({
                      item: item,
                      checked: e.target.checked,
                    })
                  }
                >
                  <Text fontSize="sm" color="gray.600">
                    {item.name}
                  </Text>
                </Checkbox>
              );
            })}
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </AccordionChakra>
  );
}
