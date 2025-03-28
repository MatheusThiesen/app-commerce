import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { Switch } from "../ui/switch";

interface InputSwitchProps {
  name: string;
  label?: string;
  error?: string | null;

  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const InputSwitchBase = ({
  name,
  label,
  error = null,
  checked,
  onCheckedChange,
}: InputSwitchProps) => {
  return (
    <FormControl isInvalid={!!error} className="flex">
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <Box position="relative">
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </Box>

      {!!error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export const InputSwitch = forwardRef(InputSwitchBase);
