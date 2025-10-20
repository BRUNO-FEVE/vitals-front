"use client";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context value type
interface QueueNumberContextType {
  queueNumber: string;
  addDigit: (digit: string) => void;
  removeDigit: () => void;
  setQueueNumber: (newQueueNumber: string) => void;
  submit: () => void;
}

const QueueNumberContext = createContext<QueueNumberContextType | undefined>(
  undefined
);

interface QueueNumberProviderProps {
  children: ReactNode;
}

export const QueueNumberProvider: React.FC<QueueNumberProviderProps> = ({
  children,
}) => {
  const [queueNumber, setQueueNumberState] = useState<string>("");
  const router = useRouter();

  const MAX_QUEUE_NUMBER_LENGTH = 3;

  const addDigit = (digit: string) => {
    if (
      /^[a-zA-Z0-9]$/.test(digit) &&
      queueNumber.length < MAX_QUEUE_NUMBER_LENGTH
    ) {
      setQueueNumberState((prev) => prev + digit);
    }
  };

  const removeDigit = () => {
    setQueueNumberState((prev) => prev.slice(0, -1));
  };

  const setQueueNumber = (newQueueNumber: string) => {
    if (/^[a-zA-Z0-9]{0,3}$/.test(newQueueNumber)) {
      setQueueNumberState(newQueueNumber);
    }
  };

  const submit = async () => {
    if (queueNumber.length === 3) {
      try {
        const response = await fetch(`/api/patient/${queueNumber}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          // Dispatch failed-password event
          window.dispatchEvent(new Event("failed-password"));
          console.error("❌ Paciente não encontrado ou erro na resposta");
          return;
        }

        // Extract user data from the new API response structure
        router.push(`/confirm/${queueNumber}`);
        console.log("✅ Paciente carregado:", data);
      } catch (err) {
        // Dispatch failed-password event on any error
        window.dispatchEvent(new Event("failed-password"));
        console.error("❌ Erro na requisição:", err);
      }
    }
  };

  return (
    <QueueNumberContext.Provider
      value={{ queueNumber, addDigit, removeDigit, setQueueNumber, submit }}
    >
      {children}
    </QueueNumberContext.Provider>
  );
};

export const useQueueNumber = (): QueueNumberContextType => {
  const context = useContext(QueueNumberContext);
  if (!context) {
    throw new Error("useQueueNumber must be used within a QueueNumberProvider");
  }
  return context;
};
