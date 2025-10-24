"use client";

import { Button } from "@/components/button";
import { useQuiz, QuestionType } from "@/contexts/quiz-context";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export type VitalsType =
  | "temperature"
  | "heartbeat/oxygen"
  | "pressure"
  | "weight"
  | "height";

export interface VitalsItem {
  id: string;
  type: VitalsType;
  value?: string;
}

// Helper function to get vital label in Portuguese
const getVitalLabel = (type: VitalsType): string => {
  const labels: Record<VitalsType, string> = {
    height: "Altura",
    temperature: "Temperatura",
    "heartbeat/oxygen": "Batimentos/Oxigênio",
    pressure: "Pressão",
    weight: "Peso",
  };
  return labels[type];
};

// Helper function to format vital value with unit
const formatVitalValue = (type: VitalsType, value?: string): string => {
  if (!value) return "—";

  switch (type) {
    case "height":
      return `${value} cm`;
    case "temperature":
      return `${value} °C`;
    case "heartbeat/oxygen":
      return value; // Already formatted as "BPM / SpO2%"
    case "pressure":
      return `${value} mmHg`;
    case "weight":
      return `${value} kg`;
    default:
      return value;
  }
};

export default function Page() {
  const { user, vitals, questions } = useQuiz();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Drag scroll state and ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  console.log(questions);

  // Drag scroll handlers
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartY(e.pageY - container.offsetTop);
      setScrollTop(container.scrollTop);
      container.style.cursor = "grabbing";
      container.style.userSelect = "none";
    };

    const handleTouchStart = (e: TouchEvent) => {
      setIsDragging(true);
      setStartY(e.touches[0].pageY - container.offsetTop);
      setScrollTop(container.scrollTop);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const y = e.pageY - container.offsetTop;
      const walk = y - startY;
      container.scrollTop = scrollTop - walk;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const y = e.touches[0].pageY - container.offsetTop;
      const walk = y - startY;
      container.scrollTop = scrollTop - walk;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      container.style.cursor = "grab";
      container.style.removeProperty("user-select");
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        setIsDragging(false);
        container.style.cursor = "grab";
        container.style.removeProperty("user-select");
      }
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Set initial cursor
    container.style.cursor = "grab";

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDragging, startY, scrollTop]);

  const onSumit = async () => {
    if (!user) {
      console.error("No user data available");
      setSubmitError("Dados do usuário não disponíveis");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Submit to API
      const response = await axios.put(
        `/api/patient/${user.queueNumber}`,
        {
          hospitalPassword: user.queueNumber, // Using queueNumber as hospitalPassword
          questions: questions,
          vitals: vitals,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      if (!result.success) {
        console.error("Submission failed:", result);
        setSubmitError(result.error || "Erro ao enviar os dados");
        return;
      }

      console.log("Submission successful:", result);
      handleNavigation();
    } catch (error) {
      console.error("Error submitting triage results:", error);
      setSubmitError("Erro de conexão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigation = () => {
    router.push("/end");
  };

  const formattedDate = user
    ? new Date(user.dateOfBirth).toLocaleDateString("pt-BR")
    : "";

  // Recursive function to render questions and their nested questions
  const renderQuestion = (question: QuestionType, level: number = 0) => {
    if (!question.answer) {
      return null;
    }

    const indentClass = level > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : "";

    let questionElement;

    if (question.type === "yes_no") {
      questionElement = (
        <div
          key={question.id}
          className={`flex flex-row justify-between ${indentClass}`}
        >
          <span className="opacity-50">{question.question}</span>
          <span className="font-mono">
            {question.answer === "yes" ? "Sim" : "Não"}
          </span>
        </div>
      );
    } else if (
      question.type === "single_selection" ||
      question.type === "slider"
    ) {
      const selectedOption = question.options?.find(
        (option) => option.value === question.answer
      );

      questionElement = (
        <div key={question.id} className={`flex flex-col gap-1 ${indentClass}`}>
          <span className="opacity-50">{question.question}</span>
          <span className="font-mono">
            {selectedOption?.label || question.answer}
          </span>
        </div>
      );
    } else if (question.type === "multi_selection") {
      const answers = Array.isArray(question.answer)
        ? question.answer
        : [question.answer];
      const selectedLabels = question.options
        ?.filter((option) => answers.includes(option.value))
        .map((option) => option.label);

      questionElement = (
        <div key={question.id} className={`flex flex-col gap-1 ${indentClass}`}>
          <span className="opacity-50">{question.question}</span>
          <span className="font-mono">
            {selectedLabels?.join(", ") || question.answer}
          </span>
        </div>
      );
    }

    // Find nested questions based on the selected answer
    const selectedOption = question.options?.find(
      (option) => option.value === question.answer
    );

    const nestedQuestions = selectedOption?.nested_questions || [];

    return (
      <React.Fragment key={question.id}>
        {questionElement}
        {nestedQuestions.map((nestedQ) => renderQuestion(nestedQ, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="w-full h-screen flex flex-row">
      {/* Review Answers  */}
      <div
        ref={scrollContainerRef}
        className="bg-white w-2/3 h-full flex flex-col gap-10 py-4 px-12 pr-20 overflow-y-scroll touch-pan-y"
      >
        <div className="">
          <h1 className="font-bold text-4xl text-start">
            Revise suas respostas
          </h1>
          <p className="text-sm text-gray-600 font-mono">
            Confira as informações fornecidas antes de prosseguir
          </p>
        </div>

        {questions.map((question) => renderQuestion(question))}

        <div className="flex flex-col gap-4">
          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {submitError}
            </div>
          )}
          <Button
            label={isSubmitting ? "Enviando..." : "Confirmar e Enviar"}
            direction="right"
            onClick={onSumit}
            buttonBgColor={isSubmitting ? "bg-gray-500" : "bg-black"}
            contentBgColor="bg-white"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="w-1/3 font-mono text-white">
        {/* User Info Section */}
        <div className="w-full h-fit pl-3 pt-4 pb-6 bg-black flex flex-col gap-3">
          <p>
            <span className="opacity-75 text-xs">NOME:</span> <br />
            {user?.name}
          </p>
          <p>
            <span className="opacity-75 text-xs">DATA DE NASCIMENTO:</span>
            <br />
            {formattedDate}
          </p>
          <p>
            <span className="opacity-75 text-xs">CPF:</span>
            <br />
            {user?.cpf}
          </p>
        </div>

        {/* Vitals Section */}
        <div className="pl-3 pt-2">
          <div className="flex flex-col gap-1">
            {vitals.map((vital) => (
              <p key={vital.id} className="font-mono text-sx">
                <span className="text-xs uppercase opacity-75">
                  {getVitalLabel(vital.type)}:{" "}
                </span>

                <br />

                {formatVitalValue(vital.type, vital.value)}
              </p>
            ))}
          </div>

          {/* Show message if no vitals data */}
          {vitals.length === 0 && (
            <p className="text-sm opacity-50">Nenhum sinal vital registrado</p>
          )}
        </div>
      </div>
    </div>
  );
}
