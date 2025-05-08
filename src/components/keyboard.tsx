import React from "react";
import { Button } from "./button";
import { CaseUpper, Delete, MoveRight } from "lucide-react";
import { useQueueNumber } from "@/contexts/password-context";

type KeyToken = "" | null | "submit" | "delete" | "shift" | `${number}`;

// define each row as exactly 5 "slots"
const layout: KeyToken[][] = [
  ["shift", "1", "2", "3", "delete"],
  [null, "4", "5", "6", null],
  ["0", "7", "8", "9", "submit"],
];

export default function Keyboard() {
  const { addDigit, removeDigit, submit } = useQueueNumber();

  const handlePress = (key: KeyToken) => {
    if (key === "delete") return removeDigit();
    if (key === "submit") return submit();
    if (key && key !== "shift") return addDigit(key);
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
              icon={<CaseUpper strokeWidth={1.3} />}
              direction="middle"
              onClick={() => {
                /* your shift logic here */
              }}
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

        // backspace / delete
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

        // a digit
        return (
          <Button
            key={i}
            label={key}
            direction="middle"
            onClick={() => handlePress(key)}
          />
        );
      })}
    </div>
  );
}
