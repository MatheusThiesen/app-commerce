import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import { ClassNameValue } from "tailwind-merge";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  data: SelectItemProps[];
  className?: ClassNameValue;
}

export interface SelectItemProps {
  value: string;
  label: string;
}

export const SelectForm = ({
  name,
  label,
  control,
  data,
  description,
  className,
}: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          {label && <FormLabel>{label}</FormLabel>}

          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.map((item) => (
                <SelectItem value={item.value} key={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
