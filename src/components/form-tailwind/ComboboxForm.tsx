"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";

interface ComboboxFormProps {
  data: ComboboxDataProps[];

  label?: string;
  defaultValue?: string;
  className?: ClassNameValue;

  onChange?: (e: ComboboxDataProps | null) => void;
}

interface ComboboxDataProps {
  value: string;
  label: string;
}

export function ComboboxForm({
  data,
  className,
  label,
  defaultValue,
  onChange,
}: ComboboxFormProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue ?? "");

  React.useEffect(() => {
    if (onChange) {
      if (value) {
        const findValue = data.find(
          (item) => item.value.toUpperCase() === value.toLocaleUpperCase()
        );

        onChange(findValue ?? null);
      } else {
        onChange(null);
      }
    }
  }, [value, onChange, data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {label && <Label className="text-sm font-normal mb-1">{label}</Label>}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between relative", className)}
        >
          {value
            ? data.find(
                (item) => item.value.toUpperCase() === value.toLocaleUpperCase()
              )?.label
            : "Selecionar..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 h-max-[30vh] h-[30vh] overflow-scroll"
        align="end"
      >
        <Command>
          <CommandInput placeholder="Buscar..." className="h-9" />
          <CommandEmpty>Não há dados a serem exibidos.</CommandEmpty>

          <ScrollArea>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
