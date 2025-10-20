"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bars } from "./components/bars";
import { TitleSection } from "./components/title-section";
import { InputArea } from "./components/input-area";
import { useQueueNumber } from "@/contexts/password-context";
import { RotateCcwKey } from "lucide-react";

export default function Page() {
  type Stage = "INITIAL" | "IDENTIFY";
  type LabelState = "hidden" | "open" | "outOfFocus";

  const [stage, setStage] = useState<Stage>("INITIAL");
  const [queueNumberLabelVariant, setQueueNumberLabelVariant] =
    useState<LabelState>("hidden");
  const [animationDuration, setAnimationDuration] = useState<number>(1.2);
  const [showToast, setShowToast] = useState(false);
  const { queueNumber } = useQueueNumber();

  // Update label on queueNumber change
  useEffect(() => {
    setQueueNumberLabelVariant(queueNumber.length > 0 ? "outOfFocus" : "open");
  }, [queueNumber]);

  // Shorten animation after initial open
  useEffect(() => {
    if (stage === "IDENTIFY") {
      const timer = setTimeout(() => setAnimationDuration(0.4), 1000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Listen for failed-password event
  useEffect(() => {
    const handleFailedPassword = () => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    };

    window.addEventListener("failed-password", handleFailedPassword);
    return () =>
      window.removeEventListener("failed-password", handleFailedPassword);
  }, []);

  const isInitial = stage === "INITIAL";

  useEffect(() => {
    if (queueNumber.length === 3) {
      setStage("IDENTIFY");
    }
  }, [queueNumber]);

  return (
    <motion.div className="w-screen h-screen bg-brand-primary group relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 20 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.5, ease: "backInOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-red-500/40 backdrop-blur-xl text-white px-6 py-4 rounded-2xl border border-red-500/60 flex items-center gap-3">
              <RotateCcwKey />
              <p className="font-normal text-sm font-mono tracking-wide">
                Senha incorreta. Tente novamente.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Bars isInitial={isInitial} />
      <TitleSection
        stage={stage}
        senhaLabelVariant={queueNumberLabelVariant}
        animationDuration={animationDuration}
        queueNumber={queueNumber}
      />
      <InputArea stage={stage} onClick={() => setStage("IDENTIFY")} />
    </motion.div>
  );
}
