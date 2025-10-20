import React, { useState } from "react";
import { Button } from "./button";
import { CaseUpper, Delete, MoveRight, Binary } from "lucide-react";
import { useQueueNumber } from "@/contexts/password-context";

type KeyToken =
  | ""
  | null
  | "submit"
  | "delete"
  | "shift"
  | `${number}`
  | string;

// Number layout
const numberLayout: KeyToken[][] = [
  ["shift", "1", "2", "3", "delete"],
  [null, "4", "5", "6", null],
  ["0", "7", "8", "9", "submit"],
];

// Letter layout
const letterLayout: KeyToken[][] = [
  ["shift", "A", "B", "C", "delete"],
  [null, "D", "E", "F", null],
  ["G", "H", "I", "J", "submit"],
];

export default function Keyboard() {
  const { addDigit, removeDigit, submit } = useQueueNumber();
  const [isLetterMode, setIsLetterMode] = useState(false);

  const layout = isLetterMode ? letterLayout : numberLayout;

  const handlePress = (key: KeyToken) => {
    if (key === "delete") return removeDigit();
    if (key === "submit") return submit();
    if (key === "shift") {
      setIsLetterMode(!isLetterMode);
      return;
    }
    if (key) return addDigit(key);
  };

  return (
    <div className="grid grid-cols-5 z-40">
      {layout.flat().map((key, i) => {
        // completely empty slot
        if (key === null) {
          return <Button key={i} disabledPadding />;
        }

        // shift key
        if (key === "shift") {
          return (
            <Button
              key={i}
              icon={
                isLetterMode ? (
                  <Binary strokeWidth={1.3} />
                ) : (
                  <CaseUpper strokeWidth={1.3} />
                )
              }
              direction="middle"
              onClick={() => handlePress("shift")}
              animate
            />
          );
        }

        // backspace / delete
        if (key === "delete") {
          return (
            <Button
              key={i}
              icon={<Delete strokeWidth={1.3} />}
              direction="left"
              onClick={() => handlePress("delete")}
            />
          );
        }

        // submit
        if (key === "submit") {
          return (
            <Button
              key={i}
              icon={<MoveRight strokeWidth={1.3} />}
              isPrimary
              direction="right"
              onClick={() => handlePress("submit")}
            />
          );
        }

        // a digit or letter
        return (
          <Button
            key={i}
            label={key}
            direction="middle"
            onClick={() => handlePress(key)}
            animate
          />
        );
      })}
    </div>
  );
}
