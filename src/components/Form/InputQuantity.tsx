import { Button, HStack, Input } from "@chakra-ui/react";

interface InputQuantityProps {
  step?: number;
  min?: number;
  max?: number;
  value: number;

  onIncremental: (quantity: number) => void;
  onDecremental: (quantity: number) => void;
}

export function InputQuantity({
  max,
  min,
  step = 1,
  value,
  onIncremental,
  onDecremental,
}: InputQuantityProps) {
  function onDisabledDecrementalButtonClick(): boolean {
    if (min === undefined) return false;
    const valueDecremented = value - step;
    if (valueDecremented >= min) return false;
    return true;
  }

  function onDisabledIncrementalButtonClick(): boolean {
    if (max === undefined) return false;
    const valueIncremented = value + step;
    if (valueIncremented <= max) return false;
    return true;
  }

  return (
    <HStack spacing={0} border={"1px"} borderRadius="md" borderColor="gray.200">
      <Button
        variant="unstyled"
        color="primary"
        fontSize="lg"
        onClick={
          onDisabledDecrementalButtonClick()
            ? () => {}
            : () => onDecremental(value - step)
        }
        aria-disabled={onDisabledDecrementalButtonClick()}
        disabled={onDisabledDecrementalButtonClick()}
      >
        -
      </Button>
      <Input textAlign="center" border={0} readOnly p="0" value={value} />
      <Button
        variant="unstyled"
        color="primary"
        fontSize="lg"
        onClick={
          onDisabledIncrementalButtonClick()
            ? () => {}
            : () => onIncremental(value + step)
        }
        aria-disabled={onDisabledIncrementalButtonClick()}
        disabled={onDisabledIncrementalButtonClick()}
      >
        +
      </Button>
    </HStack>
  );
}
