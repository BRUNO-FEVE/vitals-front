"use client";

import { QuizList } from "@/app/triage/components/quiz-list";
import { useRouter } from "next/navigation";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface QuizContextType {
  quizList: ReactNode[];
  currentIndex: number;

  prev: () => void;
  next: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizList, setQuizList] = useState<ReactNode[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const router = useRouter();

  const prev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const next = () => {
    if (quizList.length - 1 !== currentIndex) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    setQuizList(QuizList);
  }, []);

  return (
    <QuizContext.Provider
      value={{
        quizList,
        currentIndex,
        prev,
        next,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
