import { Box, Button, Flex, Text } from "@chakra-ui/react";

interface InputFakeProps {
  label?: string;
  value: string;

  onUpdate?: () => void;
}

export const InputFake = ({ label, value, onUpdate }: InputFakeProps) => {
  return (
    <Box>
      {!!label && (
        <Text mb="2" color="gray.600" fontSize="sm">
          {label}
        </Text>
      )}

      <Flex
        h="12"
        px="1rem"
        bgColor="gray.50"
        color="gray.900"
        borderRadius="md"
        align="center"
        justify="space-between"
      >
        <Text as="span">{value}</Text>

        {onUpdate && (
          <Button
            type="button"
            variant="unstyled"
            color="red.500"
            onClick={onUpdate}
          >
            ALTERAR
          </Button>
        )}
      </Flex>
    </Box>
  );
};
