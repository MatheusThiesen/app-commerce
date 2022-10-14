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
import { SelectedFilter } from "../ProductListFilter";

interface ItemProps {
  name: string;
  value: number | string;
}

interface FilterItemProps {
  title: string;
  data: ItemProps[];

  selectedFilter: SelectedFilter[];
  onChangeSelectedFilter: (a: SelectedFilter[]) => void;

  AccordionItem?: AccordionItemProps;
}

export function FilterItem({
  title,
  data,
  selectedFilter,
  onChangeSelectedFilter,
  AccordionItem: AccordionItemProps,
}: FilterItemProps) {
  const [search, setSearch] = useState("");

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function onChecked(item: ItemProps): boolean | undefined {
    const findOne = selectedFilter.some((f) => f.value === item.value);
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
      onChangeSelectedFilter([...date, item]);
    } else {
      const date = selectedFilter.filter((f) => f.value !== item.value);
      onChangeSelectedFilter([...date]);
    }
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

  return (
    <AccordionChakra defaultIndex={[0]} allowMultiple allowToggle w="full">
      <AccordionItem borderTop="0" {...(AccordionItemProps as any)}>
        <Text>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Text fontSize="md" color="gray.800" fontWeight="bold">
                {title}
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Text>
        <AccordionPanel pb={2} pt={2}>
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
