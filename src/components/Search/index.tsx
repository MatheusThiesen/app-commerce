import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
} from "@chakra-ui/react";
import { ChangeEvent, memo, useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useDebounce } from "use-debounce";

export interface SearchProps extends InputProps {
  handleChangeSearch: (search: string) => void;
  currentSearch: string;

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
  currentSearch,
  handleChangeSearch,
  size = "lg",
  placeholder = "Buscar na Alpar do Brasil",
  ...rest
}: SearchProps) => {
  const [search, setSearch] = useState(currentSearch);
  const [debouncedSearch] = useDebounce<string>(search, 1200);

  async function handleSubmit(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    handleChangeSearch(search);
  }

  useEffect(() => {
    handleChangeSearch(debouncedSearch ?? "");
  }, [debouncedSearch]);

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <InputGroup size={"md"} position="relative">
        <InputLeftElement pointerEvents="none">
          <Icon as={IoSearch} color="gray.500" />
        </InputLeftElement>

        <Input
          name="search"
          placeholder={placeholder}
          bg="white"
          pr={["3.6rem", "3.6rem", "5.6rem"]}
          border="0"
          borderRadius="1.5rem"
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
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          {...(rest as any)}
        />
      </InputGroup>
    </Box>
  );
};

export const Search = memo(SearchComponent);
