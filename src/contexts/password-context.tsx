"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context value type
interface PasswordContextType {
  password: string;
  addDigit: (digit: string) => void;
  removeDigit: () => void;
  setPassword: (newPassword: string) => void;
}

const PasswordContext = createContext<PasswordContextType | undefined>(
  undefined
);

interface PasswordProviderProps {
  children: ReactNode;
}

export const PasswordProvider: React.FC<PasswordProviderProps> = ({
  children,
}) => {
  const [password, setPasswordState] = useState<string>("");

  const addDigit = (digit: string) => {
    if (/^[a-zA-Z0-9]$/.test(digit) && password.length < 3) {
      setPasswordState((prev) => prev + digit);
    }
  };

  const removeDigit = () => {
    setPasswordState((prev) => prev.slice(0, -1));
  };

  const setPassword = (newPassword: string) => {
    if (/^[a-zA-Z0-9]{0,3}$/.test(newPassword)) {
      setPasswordState(newPassword);
    }
  };

  return (
    <PasswordContext.Provider
      value={{ password, addDigit, removeDigit, setPassword }}
    >
      {children}
    </PasswordContext.Provider>
  );
};

export const usePassword = (): PasswordContextType => {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error("usePassword must be used within a PasswordProvider");
  }
  return context;
};
