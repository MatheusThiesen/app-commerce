import {
  Button,
  Icon,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { ChangeEvent, memo, useState } from "react";
import { IoSearch } from "react-icons/io5";

export interface SearchProps extends InputProps {
  setSearch: (t: string) => void;
  search: string;
}

const SearchComponent = ({ setSearch, search, ...rest }: SearchProps) => {
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

  return (
    <InputGroup size="lg">
      <Input
        name="search"
        placeholder="Buscar aqui"
        bg="white"
        pr="5.3rem"
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
      <InputRightElement width="4.5rem" mr="2">
        <Button colorScheme="red" h="1.75rem" size="sm" onClick={handleSearch}>
          <Icon as={IoSearch} mr="1" />
          <Text fontWeight="bold" fontSize="sm">
            Buscar
          </Text>
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export const Search = memo(SearchComponent);
