"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bars } from "./components/bars";
import { TitleSection } from "./components/title-section";
import { InputArea } from "./components/input-area";
import { usePassword } from "@/contexts/password-context";

export default function Page() {
  type Stage = "INITIAL" | "IDENTIFY";
  type LabelState = "hidden" | "open" | "outOfFocus";

  const [stage, setStage] = useState<Stage>("INITIAL");
  const [senhaLabelVariant, setSenhaLabelVariant] =
    useState<LabelState>("hidden");
  const [animationDuration, setAnimationDuration] = useState<number>(1.2);

  const { password } = usePassword();

  // Update label on password change
  useEffect(() => {
    setSenhaLabelVariant(password.length > 0 ? "outOfFocus" : "open");
  }, [password]);

  // Shorten animation after initial open
  useEffect(() => {
    if (stage === "IDENTIFY") {
      const timer = setTimeout(() => setAnimationDuration(0.4), 1000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const isInitial = stage === "INITIAL";

  return (
    <motion.div className="w-screen h-screen bg-brand-primary group">
      <Bars isInitial={isInitial} />
      <TitleSection
        stage={stage}
        senhaLabelVariant={senhaLabelVariant}
        animationDuration={animationDuration}
        password={password}
      />
      <InputArea stage={stage} onClick={() => setStage("IDENTIFY")} />
    </motion.div>
  );
}
