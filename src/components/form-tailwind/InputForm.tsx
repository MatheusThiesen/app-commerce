import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input as InputUi } from "../ui/input";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
}

export function InputForm({
  control,
  name,
  label,
  placeholder,
  description,

  ...rest
}: Props) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <InputUi placeholder={placeholder} {...rest} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
