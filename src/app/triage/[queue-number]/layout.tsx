import React, { ReactNode } from "react";
import Header from "./components/header";
import { QuizProvider } from "@/contexts/quiz-context";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen h-screen bg-brand-primary">
      <QuizProvider>
        <Header />

        {children}
      </QuizProvider>
    </div>
  );
}
