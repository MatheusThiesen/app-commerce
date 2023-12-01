import {
  Box,
  Button,
  Flex,
  Icon,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import { memo, useState } from "react";

import { IoIosArrowDroprightCircle } from "react-icons/io";
import { Input } from "../Form/Input";

interface Props {
  defaultMin?: number;
  defaultMax?: number;

  onChangeRange: (value: number[]) => void;
}

function FilterRangeAmountComponent({
  defaultMin = 0,
  defaultMax = 10000,
  onChangeRange,
}: Props) {
  const [min, setMin] = useState(defaultMin);
  const [max, setMax] = useState(defaultMax);

  function onChange([currentMin, currentMax]: number[]) {
    setMin(currentMin);
    setMax(currentMax);
  }
  function onChangeInputText(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value.replace(/\D/g, "")) / 100;

    if (e.target.name === "min") {
      setMin(value);
    }
    if (e.target.name === "max") {
      setMax(value);
    }
  }

  return (
    <Box>
      <RangeSlider
        aria-label={["min", "max"]}
        min={defaultMin}
        max={defaultMax}
        onChange={onChange}
        value={[min, max]}
      >
        <RangeSliderTrack bg="red.100" py="1">
          <RangeSliderFilledTrack bg="red.500" py="1" />
        </RangeSliderTrack>
        <RangeSliderThumb boxSize={5} index={0} boxShadow="dark-lg" />
        <RangeSliderThumb boxSize={5} index={1} boxShadow="dark-lg" />
      </RangeSlider>

      <Flex columnGap="4">
        <Input
          label="Mínimo"
          name="min"
          size="sm"
          borderRadius="lg"
          value={min.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })}
          onChange={onChangeInputText}
        />
        <Input
          label="Máximo"
          name="max"
          size="sm"
          borderRadius="lg"
          value={max.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })}
          onChange={onChangeInputText}
        />
      </Flex>

      <Flex justify="flex-end">
        <Button
          size="sm"
          mt="4"
          leftIcon={<Icon fontSize="16" as={IoIosArrowDroprightCircle} />}
          onClick={() => onChangeRange([min, max])}
        >
          Buscar
        </Button>
      </Flex>
    </Box>
  );
}

export const FilterRangeAmount = memo(FilterRangeAmountComponent);
