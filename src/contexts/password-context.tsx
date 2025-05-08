"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context value type
interface QueueNumberContextType {
  queueNumber: string;
  addDigit: (digit: string) => void;
  removeDigit: () => void;
  setQueueNumber: (newQueueNumber: string) => void;
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

  const addDigit = (digit: string) => {
    if (/^[a-zA-Z0-9]$/.test(digit) && queueNumber.length < 3) {
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

  return (
    <QueueNumberContext.Provider
      value={{ queueNumber, addDigit, removeDigit, setQueueNumber }}
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
