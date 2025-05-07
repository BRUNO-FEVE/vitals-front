"use client";

import React from "react";
import { MoveRight } from "lucide-react";

interface InputAreaProps {
  stage: "INITIAL" | "IDENTIFY";
  onClick: () => void;
  onChange: (value: string) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({
  stage,
  onClick,
  onChange,
}) => (
  <>
    <label
      htmlFor="wait-password"
      className="w-full h-2/5 flex flex-row items-center justify-end pr-20 group relative"
      onClick={onClick}
    >
      {stage === "INITIAL" && (
        <MoveRight
          size={32}
          strokeWidth={0.75}
          className="absolute top-0 bottom-0 my-auto right-1/12 text-white pr-1.5"
        />
      )}
    </label>
    <input
      type="text"
      className="sr-only"
      id="wait-password"
      onChange={(e) => onChange(e.target.value)}
    />
  </>
);
