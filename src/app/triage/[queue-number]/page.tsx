"use client";

import { motion, Variants } from "motion/react";
import React, { ReactNode, useEffect, useState, useCallback } from "react";
import { useQuiz } from "@/contexts/quiz-context";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

const anim: Variants = {
  hidden: {
    position: "absolute",
    display: "none",
    top: 0,
    left: 0,
    y: "100%",
    scale: 1,
    opacity: 1,
    zIndex: 0,
    transition: { duration: 0 },
  },
  waiting: {
    position: "relative",
    display: "flex",
    y: "0%",
    scale: 1,
    opacity: 1,
    zIndex: 10,
    transition: { delay: 0, duration: 0.7, ease: "easeInOut" },
  },
  slideUp: {
    position: "absolute",
    display: "flex",
    top: 0,
    left: 0,
    y: "-20%",
    scale: 0.9,
    opacity: 0.9,
    zIndex: 5,
    transition: { duration: 0.7, ease: "easeInOut" },
  },
};

export default function Page() {
  const { createList, quizList, currentIndex, setUser } = useQuiz();
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const queueNumber = params["queue-number"];

  const onLoad = useCallback(async () => {
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

      console.log("user: ", data);

      // Extract data from the new API response structure
      const patientData = data.data;

      setUser({
        queueNumber: patientData.queueNumber,
        name: patientData.user.name,
        cpf: patientData.user.cpf,
        dateOfBirth: patientData.user.dateOfBirth,
        returnUrl: patientData.returnUrl,
      });
      createList(patientData.questions, patientData.vitals);

      console.log("✅ Paciente carregado:", data);
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError("Erro de conexão com o servidor.");
    }
  }, [queueNumber, createList, setUser]);

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div
      className={cn(
        currentIndex !== 0 ? "bg-black" : "bg-brand-primary",
        "relative w-full h-full overflow-hidden overflow-x-hidden overflow-y-visible"
      )}
    >
      {quizList.map((unit: ReactNode, index) => (
        <motion.div
          key={index}
          className={cn(
            "bg-white",
            "w-screen h-[78vh] px-[10%] py-[5%] flex flex-col gap-4 overflow-hidden"
          )}
          variants={anim}
          initial="hidden"
          animate={
            index === currentIndex
              ? "waiting"
              : index < currentIndex
              ? currentIndex - index > 1
                ? "hidden"
                : "slideUp"
              : "hidden"
          }
        >
          {unit}
        </motion.div>
      ))}
    </div>
  );
}
