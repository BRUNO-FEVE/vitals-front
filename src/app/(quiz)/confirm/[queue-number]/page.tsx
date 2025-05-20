"use client";

import { Check, X } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatedText } from "@/components/animated-text";
import { AnimatePresence, motion, Variants } from "motion/react";

export default function Page() {
  const [buttonOnFocus, setButtonOnFocus] = useState<"left" | "right">("right");
  const [isLeaving, setIsLeaving] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const router = useRouter();

  const obj = {
    name: "Bruno Augusto Lopes Fevereiro",
    "date-of-birth": "10/07/2002",
  };

  const buttonVariants: Variants = {
    right: { right: 0 },
    left: { left: 0 },
  };

  function handleClick() {
    // decide where to go
    const target = buttonOnFocus === "right" ? "/triage" : "/";
    setNextPath(target);

    // trigger exit animation
    setIsLeaving(true);
  }

  return (
    <div className="bg-brand-primary w-screen h-screen flex justify-center items-center">
      <AnimatePresence
        // when exit animation completes, navigate
        onExitComplete={() => {
          if (nextPath) router.push(nextPath);
        }}
      >
        {!isLeaving && (
          <motion.div
            key="card"
            className="bg-white w-[95%] h-[90%] relative flex flex-col justify-end"
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }} // slide all the way down
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h1 className="absolute text-8xl font-extralight top-0 left-4 leading-[95%]">
              <AnimatedText text="CONFIRME" />
              <br />
              <AnimatedText delay={0.35} text="OS" />
              <br />
              <AnimatedText delay={0.45} text="DADOS" />
            </h1>

            <div className="relative w-full h-1/2 grid grid-cols-2 grid-rows-2 gap-0">
              <div className="w-full h-full"></div>
              <div className="h-full w-full">
                <motion.div
                  className="w-full bg-black text-white font-mono p-3"
                  initial={{ y: "100%", height: "100%" }}
                  animate={{ y: 0, height: "105%" }}
                  transition={{
                    delay: 1,
                    duration: 0.8,
                    ease: "easeInOut",
                    type: "spring",
                    bounce: 0.3,
                  }}
                >
                  <p className="font-bold text-xl m-0">
                    {obj.name}
                    <br />
                    <span className="font-normal text-base">
                      Data de Nascimento{" "}
                    </span>
                    {obj["date-of-birth"]}
                  </p>
                </motion.div>
              </div>

              <button
                onMouseEnter={() => setButtonOnFocus("left")}
                className="z-20 h-full w-full bg-white flex justify-center items-center border-t-[0.5px] border-black"
                onClick={handleClick}
              >
                <X strokeWidth={1} />
              </button>
              <button
                onMouseEnter={() => setButtonOnFocus("right")}
                className="z-20 h-full w-full bg-white flex justify-center items-center border-t-[0.5px] border-black"
                onClick={handleClick}
              >
                <Check strokeWidth={1} />
              </button>

              <motion.div
                initial={"right"}
                variants={buttonVariants}
                animate={buttonOnFocus}
                transition={{ duration: 0.2, ease: "circInOut" }}
                className={cn(
                  "z-20 absolute bottom-0  w-1/2 h-1/2 bg-white mix-blend-difference transition-all"
                )}
                onClick={handleClick}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
