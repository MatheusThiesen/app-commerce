import { Box, Button, Flex, FlexProps, Text } from "@chakra-ui/react";

interface InputFakeProps extends FlexProps {
  label?: string;
  value: string;

  onUpdate?: () => void;
}

export const InputFake = ({
  label,
  value,
  onUpdate,
  ...rest
}: InputFakeProps) => {
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
        {...(rest as any)}
      >
        <Text as="span">{value}</Text>

        {onUpdate && (
          <Button
            type="button"
            variant="unstyled"
            color="primary"
            onClick={onUpdate}
          >
            ALTERAR
          </Button>
        )}
      </Flex>
    </Box>
  );
};
