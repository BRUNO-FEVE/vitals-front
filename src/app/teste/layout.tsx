import React, { ReactNode } from "react";
import { QuizProvider } from "@/contexts/quiz-context";
import Header from "../triage/[queue-number]/components/header";

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
