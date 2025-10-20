import React from "react";
import { cn } from "@/lib/utils";
import Height from "../triage/[queue-number]/components/questions/height";

export default function Page() {
  return (
    <div
      className={cn(
        "bg-white",
        "relative w-full h-full overflow-hidden overflow-x-hidden overflow-y-visible"
      )}
    >
      <Height />
    </div>
  );
}
