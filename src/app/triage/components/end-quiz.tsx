"use client";

import { useQuiz } from "@/contexts/quiz-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function EndQuiz() {
  const { currentIndex, quizList } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    if (quizList.length - 1 === currentIndex) {
      setTimeout(() => {
        router.push("/");
        window.location.reload();
      }, 2000);
    }
  }, [currentIndex]);

  return (
    <div className="bg-black w-full h-full text-white flex justify-center items-center font-bold font-mono">
      Fim da Triagem
    </div>
  );
}
