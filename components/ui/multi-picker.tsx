import React from "react";
import { Label } from "./label";
import { Check, X, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MultiPickerProps {
  label: string;
  selected: string[];
  options: { value: string; label: string }[];
  onChange: (v: string[]) => void;
}

const MultiPicker = ({
  label,
  selected,
  options,
  onChange,
}: MultiPickerProps) => {
  const toogle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <Label className="text-sm px-1">{label}</Label>
        {selected.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between h-8 text-xs font-normal"
          >
            <span className="truncate text-left">
              {selected.length === 0 ? (
                <span className="text-muted-foreground">All</span>
              ) : (
                `${selected.length} selected`
              )}
            </span>
            <ChevronDown className="h-3 w-3 opacity-60 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}…`}
              className="h-8 text-xs"
            />
            <CommandList>
              <CommandEmpty className="text-xs py-4 text-center text-muted-foreground">
                No options
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toogle(option.value)}
                  >
                    <Check
                      className={`mr-2 h-3 w-3 ${selected.includes(option.value) ? "opacity-100" : "opacity-0"}`}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selected.length > 0 && selected.length <= 4 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selected.map((value) => (
            <Badge
              key={value}
              variant="secondary"
              className="text-xs h-5 px-1.5 font-mono cursor-pointer"
              onClick={() => toogle(value)}
            >
              {value} <X className="h-2.5 w-2.5 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiPicker;
