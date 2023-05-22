import { Button, HStack, Input } from "@chakra-ui/react";

interface InputQuantityProps {
  inputProps: any;
  incrementButtonProps: any;
  decrementButtonProps: any;
}

export function InputQuantity({
  decrementButtonProps,
  incrementButtonProps,
  inputProps,
}: InputQuantityProps) {
  const inc = incrementButtonProps();
  const dec = decrementButtonProps();
  const input = inputProps();

  return (
    <HStack spacing={0} border={"1px"} borderRadius="md" borderColor="gray.200">
      <Button {...dec} variant="unstyled" color="red.500" fontSize="lg">
        -
      </Button>
      <Input {...input} textAlign="center" border={0} readOnly p="0" />
      <Button {...inc} variant="unstyled" color="red.500" fontSize="lg">
        +
      </Button>
    </HStack>
  );
}
