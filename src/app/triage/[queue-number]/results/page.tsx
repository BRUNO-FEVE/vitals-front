"use client";

import { Button } from "@/components/button";
import { useQuiz, QuestionType } from "@/contexts/quiz-context";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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

interface TriageAnswer {
  questionId: string;
  answer: string | string[];
}

export default function Page() {
  const { user, vitals, questions } = useQuiz();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  console.log(questions);

  const onSumit = async () => {
    if (!user) {
      console.error("No user data available");
      setSubmitError("Dados do usuário não disponíveis");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Collect all answers from questions and vitals
      const allAnswers: TriageAnswer[] = [];

      // Add vitals answers
      vitals.forEach((vital) => {
        if (vital.value) {
          allAnswers.push({
            questionId: vital.id,
            answer: vital.value,
          });
        }
      });

      // Add question answers (recursively collect from nested questions)
      const collectQuestionAnswers = (
        questions: QuestionType[]
      ): TriageAnswer[] => {
        const answers: TriageAnswer[] = [];

        questions.forEach((question) => {
          if (question.answer !== undefined) {
            answers.push({
              questionId: question.id,
              answer: question.answer,
            });
          }

          // Check for nested questions in options
          if (question.options) {
            question.options.forEach((option) => {
              if (option.nested_questions) {
                answers.push(
                  ...collectQuestionAnswers(option.nested_questions)
                );
              }
            });
          }
        });

        return answers;
      };

      const questionAnswers = collectQuestionAnswers(questions);
      allAnswers.push(...questionAnswers);

      console.log("Submitting answers:", allAnswers);

      // Submit to API
      const response = await axios.put(
        `/api/patient/${user.queueNumber}`,
        {
          hospitalPassword: user.queueNumber, // Using queueNumber as hospitalPassword
          answers: allAnswers,
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

  return (
    <div className="w-full h-screen flex flex-row">
      <div className="bg-white w-2/3 h-full flex flex-col gap-10 py-4 px-12 pr-20 overflow-y-scroll">
        <div className="">
          <h1 className="font-bold text-4xl text-start">
            Revise suas respostas
          </h1>
          <p className="text-sm text-gray-600 font-mono">
            Confira as informações fornecidas antes de prosseguir
          </p>
        </div>

        {questions.map((question) => {
          if (!question.answer) {
            return;
          }

          if (question.type !== "yes_no") {
            return (
              <div key={question.id} className="flex flex-row justify-between">
                <span className="opacity-50 whitespace-nowrap">
                  {question.question}
                </span>
                <p className="font-mono">
                  {
                    question.options?.filter(
                      (option) => option.value === question.answer
                    )[0].label
                  }
                </p>
              </div>
            );
          }

          if (question.type === "yes_no") {
            return (
              <div key={question.id} className="flex flex-row justify-between">
                <span className="opacity-50">{question.question}</span>
                <span className="font-mono">
                  {question.answer === "yes" ? "Sim" : "Não"}
                </span>
              </div>
            );
          }
        })}

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
        <div className="pl-3 pt-4">
          <div className="flex flex-col gap-3">
            {vitals
              .filter((vital) => vital.type !== "weight") // Exclude weight as per your original logic
              .map((vital) => (
                <p key={vital.id} className="font-mono">
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
