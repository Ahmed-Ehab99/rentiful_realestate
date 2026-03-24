"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";

interface MultiSelectProps {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((v) => v !== selectedValue));
    } else {
      onChange([...value, selectedValue]);
    }
  };

  const handleRemove = (removedValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== removedValue));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-h-10 w-full justify-between",
            value.length === 0 && "text-muted-foreground",
            className,
          )}
        >
          {value.length === 0 ? (
            placeholder
          ) : (
            <div className="flex flex-wrap gap-1">
              {value.length <= 3 ? (
                value.map((v) => {
                  const label = options.find((o) => o.value === v)?.label ?? v;
                  return (
                    <Badge
                      key={v}
                      variant="secondary"
                      className="pr-1 text-xs"
                    >
                      {label}
                      <div
                        className="hover:bg-muted-foreground/20 ml-1 cursor-pointer rounded-full p-0.5 transition-colors"
                        onClick={(e) => handleRemove(v, e)}
                        role="button"
                        aria-label={`Remove ${label}`}
                      >
                        <X className="size-3" />
                      </div>
                    </Badge>
                  );
                })
              ) : (
                <Badge variant="secondary" className="text-xs">
                  {value.length} selected
                </Badge>
              )}
            </div>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full min-w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}