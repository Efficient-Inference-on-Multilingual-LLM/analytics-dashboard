import React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";

interface LayerSliderProps {
  title: string;
  value: number[];
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number[]) => void;
  showLabel?: boolean;
  showTooltip?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
  disabled?: boolean;
}

const LayerSlider = ({
  title,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  showLabel = true,
  showTooltip = true,
  formatValue = (val) => `${val}%`,
  className = "",
  disabled = false,
}: LayerSliderProps) => {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <div className={cn("w-full", className)}>
      <Label className="text-sm px-1">{title}</Label>
      <div
        className="relative"
        onPointerEnter={() => setIsInteracting(true)}
        onPointerLeave={() => setIsInteracting(false)}
      >
        {showTooltip && (
          <div className="absolute pointer-events-none h-6 inset-x-0 -top-8">
            {value.map((val, index) => {
              const percent = ((val - min) / (max - min)) * 100;
              return (
                <div
                  key={index}
                  style={{ left: `${percent}%` }}
                  className={cn(
                    "absolute transition-opacity duration-150",
                    isInteracting ? "opacity-100" : "opacity-0",
                  )}
                >
                  <span className="rounded-md px-2 py-1 whitespace-nowrap text-xs font-medium ring-1 ring-foreground/10 shadow-md">
                    {formatValue(val)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <Slider
          value={value}
          min={min}
          max={max}
          step={step}
          onValueChange={onChange}
          disabled={disabled}
        />
      </div>

      {showLabel && (
        <div className="flex justify-between text-xs">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      )}
    </div>
  );
};

export default LayerSlider;
