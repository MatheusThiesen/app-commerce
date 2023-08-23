import {
  Box,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { ChangeEvent, memo, useState } from "react";
import { IoSearch } from "react-icons/io5";

export interface SearchProps extends InputProps {
  setSearch: (t: string) => void;
  search: string;
  placeholder?: string;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "xs"
    | "full"
    | "2xs"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl";
}

const SearchComponent = ({
  setSearch,
  search,
  size = "lg",
  placeholder = "Buscar na Alpar do Brasil",
  ...rest
}: SearchProps) => {
  const [searchService, setSearchService] = useState(search);

  async function handleSearch() {
    setSearch(searchService);
  }
  async function handleBlur(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e?.target?.value);
  }
  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchService(e?.target?.value);
  }
  async function handleSubmit(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    handleSearch();
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <InputGroup size={"md"}>
        <InputLeftElement pointerEvents="none">
          <Icon as={IoSearch} color="gray.500" />
        </InputLeftElement>

        <Input
          name="search"
          placeholder={placeholder}
          bg="white"
          pr={["3.6rem", "3.6rem", "5.6rem"]}
          border="0"
          borderRadius="lg"
          _focus={{
            bgColor: "white",
          }}
          _active={{
            bgColor: "white",
          }}
          _hover={{
            bgColor: "white",
          }}
          colorScheme="whiteAlpha"
          onBlur={handleBlur}
          onChange={handleChange}
          value={searchService}
          {...(rest as any)}
        />
        <InputRightElement width={["3.5rem", "3.5rem", "5rem"]}>
          <Button
            colorScheme="whiteAlpha"
            size="sm"
            borderTopLeftRadius={0}
            borderBottomStartRadius={0}
            onClick={handleSearch}
            borderLeftWidth={1}
            borderLeftColor={"gray.100"}
            background="transparent"
          >
            <Text
              fontWeight="bold"
              fontSize={["14", "sm", "sm", "sm"]}
              color="gray.500"
            >
              Buscar
            </Text>
          </Button>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export const Search = memo(SearchComponent);
