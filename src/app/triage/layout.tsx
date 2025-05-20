import React, { ReactNode } from "react";
import Header from "./components/header";
import { QuizProvider } from "@/contexts/quiz-context";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen h-screen bg-brand-primary">
      <QuizProvider>
        <Header
          patient={{
            name: "Bruno Augusto Lopes Fevereiro",
            dateOfBirth: "10/07/2002",
          }}
        />

        {children}
      </QuizProvider>
    </div>
  );
}
