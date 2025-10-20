"use client";

import { Check, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatedText } from "@/components/animated-text";
import { AnimatePresence, motion, Variants } from "motion/react";

export default function Page() {
  const [user, setUser] = useState<
    { name: string; dateOfBirth: string } | undefined
  >(undefined);
  const [buttonOnFocus, setButtonOnFocus] = useState<"left" | "right">("right");
  const [isLeaving, setIsLeaving] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const queueNumber = params["queue-number"];

  const onLoad = async () => {
    try {
      const response = await fetch(`/api/patient/${queueNumber}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Erro desconhecido ao carregar paciente");
        return;
      }

      // Extract user data from the new API response structure
      const userData = data.data.user;
      setUser({
        name: userData.name,
        dateOfBirth: new Date(userData.dateOfBirth).toISOString(), // Convert timestamp to ISO string
      });

      console.log("✅ Paciente carregado:", data);
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError("Erro de conexão com o servidor.");
    }
  };

  const buttonVariants: Variants = {
    right: { right: 0 },
    left: { left: 0 },
  };

  function handleClick() {
    // decide where to go

    let target;
    if (!error && buttonOnFocus === "right") {
      target = `/triage/${queueNumber}`;
    } else {
      target = "/";
    }

    setNextPath(target);

    // trigger exit animation
    setIsLeaving(true);
  }

  const formattedDate = user
    ? new Date(user.dateOfBirth).toLocaleDateString("pt-BR")
    : "";

  useEffect(() => {
    onLoad();
  }, []);

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
                  {error ? (
                    <p className="text-red-400 font-bold text-lg">{error}</p>
                  ) : user ? (
                    <p className="font-bold text-xl m-0">
                      {user.name}
                      <br />
                      <span className="font-normal text-base">
                        Data de Nascimento{" "}
                      </span>
                      {formattedDate}
                    </p>
                  ) : (
                    <p className="text-gray-400">Carregando dados...</p>
                  )}
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
                  "z-20 absolute bottom-0  w-1/2 h-1/2 bg-white mix-blend-difference transition-all",
                  `${error ? "cursor-not-allowed" : "cursor-pointer"}`
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
