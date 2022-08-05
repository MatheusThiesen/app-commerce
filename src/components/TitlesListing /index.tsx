import { Box, Text } from "@chakra-ui/react";

interface TitlesListingProps {
  title: string;
}

export function TitlesListing({ title }: TitlesListingProps) {
  return (
    <Box
      bg="gray.100"
      w="full"
      h="full"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      px="1.5rem"
    >
      <Text color="gray.600" fontSize={"small"} fontWeight="bold">
        {title}
      </Text>
    </Box>
  );
}
