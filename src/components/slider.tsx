import React, { useEffect, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

interface SliderProps {
  setValue: (value: string) => void;
  range: string[];
}

export default function Slider({ range, setValue }: SliderProps) {
  const [internalValue, setInternalValue] = useState<number[]>();

  const RANGE_FOR_EACH = 100 / range.length;

  useEffect(() => {
    if (internalValue && internalValue[0] === 100) {
      setValue(range[range.length - 1]);
    } else if (internalValue && internalValue[0] !== undefined) {
      setValue(range[Math.floor(internalValue[0] / RANGE_FOR_EACH)]);
    }
  }, [internalValue, RANGE_FOR_EACH, range, setValue]);

  return (
    <SliderPrimitive.Root
      value={internalValue}
      onValueChange={setInternalValue}
      className="relative flex h-5 w-full touch-none select-none items-center"
      defaultValue={[50]}
      max={100}
      step={1}
    >
      <SliderPrimitive.Track className="relative h-[5px] grow bg-white border border-black">
        <SliderPrimitive.Range className="absolute h-[10px] bg-black top-0 bottom-0 my-auto" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block h-8 w-5 border hover:border-none border-black bg-white hover:bg-brand-primary focus:outline-none"
        aria-label="Volume"
      />
    </SliderPrimitive.Root>
  );
}
