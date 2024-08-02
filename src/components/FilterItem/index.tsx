import {
  AccordionButton,
  Accordion as AccordionChakra,
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
import { useCallback, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { SelectedFilter } from "../ListFilter";

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
      (f) => f.name === name && f.value === item.value
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

  const filteredList = data.filter((i) =>
    search
      ? i.name
          .toString()
          .toLowerCase()
          .trim()
          .includes(search.toString().toLocaleLowerCase().trim())
      : data
  );

  const RenderRow = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const item = filteredList[index];
      const isChecked = onChecked(item);

      if (!item) return null;

      return (
        <Checkbox
          style={style}
          key={item.value}
          isChecked={isChecked}
          value={item.value}
          size="lg"
          onChange={(e) =>
            handleSelectedFilter({
              item: item,
              checked: e.target.checked,
            })
          }
        >
          <Text fontSize="sm" color="gray.600" whiteSpace="nowrap">
            {item.name}
          </Text>
        </Checkbox>
      );
    },
    [filteredList]
  );

  return (
    <AccordionChakra
      defaultIndex={isOpen ? [0] : [1]}
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
              px="2"
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

          {filteredList.length <= 6 ? (
            <Stack spacing={1} maxH="150" overflowY="scroll">
              {filteredList.map((item) => {
                const isChecked = onChecked(item);
                return (
                  <Checkbox
                    key={item.value}
                    isChecked={isChecked}
                    size="lg"
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
          ) : (
            <List
              height={150}
              itemCount={filteredList.length}
              itemSize={25}
              width={100}
              style={{
                width: "100%",
              }}
            >
              {RenderRow}
            </List>
          )}
        </AccordionPanel>
      </AccordionItem>
    </AccordionChakra>
  );
}
