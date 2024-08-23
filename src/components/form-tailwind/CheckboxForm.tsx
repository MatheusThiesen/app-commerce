"use client";

import { cn } from "@/lib/utils";

import { Control } from "react-hook-form";
import { ClassNameValue } from "tailwind-merge";
import { Checkbox } from "../ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";

interface CheckboxFormProps {
  data: ComboboxDataProps[];
  checks?: string[];
  name: string;

  label?: string;
  description?: string;
  disabled?: boolean;

  control: Control<any>;
  className?: ClassNameValue;
}

interface ComboboxDataProps {
  id: string;
  label: string;
}

export function CheckboxForm({
  data,
  name,
  className,
  label,
  description,
  control,
  checks,
  disabled = false,
}: CheckboxFormProps) {
  const normalizedData = checks
    ? data.sort((a, b) => {
        const aSelected = checks.includes(String(a.id));
        const bSelected = checks.includes(String(b.id));
        return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
      })
    : data;

  return (
    <FormItem className={cn(className)}>
      <div>
        {label && <FormLabel>{label}</FormLabel>}

        {description && <FormDescription>{description}</FormDescription>}
      </div>
      <Command className="bg-panel ">
        <CommandInput placeholder="Buscar..." />
        <CommandEmpty>Não há dados a serem exibidos.</CommandEmpty>

        <ScrollArea className="h-64 rounded-md ">
          <CommandGroup>
            {normalizedData.map((item) => (
              <FormField
                key={item.id}
                control={control}
                name={name}
                render={({ field }) => {
                  return (
                    <CommandItem key={item.id}>
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
                        <FormControl>
                          <Checkbox
                            disabled={disabled}
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: any) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    </CommandItem>
                  );
                }}
              />
            ))}
          </CommandGroup>
        </ScrollArea>
      </Command>

      <FormMessage />
    </FormItem>
  );
}
