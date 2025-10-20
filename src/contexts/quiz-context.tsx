/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { generateQuestionComponent } from "@/utils/generate-question-component";
import VitalsTemplate from "@/app/triage/[queue-number]/components/questions/vitals-template";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import Pressure from "@/app/triage/[queue-number]/components/questions/pressure";
import Height from "@/app/triage/[queue-number]/components/questions/height";

export type AnswerValue = string | string[];

// Vitals types
export type VitalsType =
  | "temperature"
  | "heartbeat/oxygen"
  | "pressure"
  | "weight"
  | "height";

export interface VitalsItem {
  id: string;
  type: VitalsType;
  value?: string; // The measured value
}

// Estrutura de uma Pergunta (Forward declaration para permitir aninhamento)
export interface TriagemQuestion {
  id: string;
  question: string;
  answer?: AnswerValue;
}
export interface YesNoQuestion extends TriagemQuestion {
  type: "yes_no";
  options?: QuizOption[];
}

export interface SliderQuestion extends TriagemQuestion {
  type: "slider";
  options: QuizOption[];
}

export interface SingleSelectionQuestion extends TriagemQuestion {
  type: "single_selection";
  options: QuizOption[];
}

export interface MultiSelectionQuestion extends TriagemQuestion {
  type: "multi_selection";
  options: QuizOption[];
}

// Tipos de Interação Simples
export type QuestionType =
  | SingleSelectionQuestion
  | MultiSelectionQuestion
  | SliderQuestion
  | YesNoQuestion;

// Estrutura de uma Opção de Resposta
export interface QuizOption {
  value: string; // Valor técnico
  label: string; // Texto visível
  nested_questions?: QuestionType[]; // Perguntas que dependem desta resposta
}

interface QuizQueueItem {
  question: QuestionType;
  lineage: string[];
}

interface User {
  queueNumber: string;
  name: string;
  dateOfBirth: number;
  cpf: string;
  returnUrl: string;
}

interface QuizContextType {
  user: User | undefined;
  setUser: (user: User) => void;

  createList: (questions: QuestionType[], vitals: string[]) => void;

  quizList: ReactNode[];
  currentIndex: number;
  questions: QuestionType[];
  vitals: VitalsItem[];

  prev: () => void;
  next: (value: AnswerValue) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [questionQueue, setQuestionQueue] = useState<QuizQueueItem[]>([]);
  const [quizList, setQuizList] = useState<ReactNode[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionTree, setQuestionTree] = useState<QuestionType[]>([]);
  const [vitalsList, setVitalsList] = useState<VitalsItem[]>([]);
  const [user, setUser] = useState<User | undefined>(undefined);

  const router = useRouter();

  const cloneQuestions = useCallback(
    (questions: QuestionType[]): QuestionType[] =>
      questions.map((question) => {
        const clonedQuestion: QuestionType = {
          ...question,
          answer: undefined,
        };

        if ("options" in clonedQuestion && clonedQuestion.options) {
          clonedQuestion.options = clonedQuestion.options.map((option) => ({
            ...option,
            nested_questions: option.nested_questions
              ? cloneQuestions(option.nested_questions)
              : undefined,
          }));
        }

        return clonedQuestion;
      }),
    []
  );

  const materializeQuestions = useCallback(
    (questions: QuestionType[], lineage: string[] = []) => {
      const queue: QuizQueueItem[] = [];
      const components: ReactNode[] = [];

      questions.forEach((question) => {
        const queueItem: QuizQueueItem = {
          question,
          lineage: [...lineage],
        };

        const component = generateQuestionComponent(queueItem.question);
        if (component) {
          queue.push(queueItem);
          components.push(component);
        }
      });

      return { queue, components };
    },
    []
  );

  const createList = useCallback(
    (questions: QuestionType[], vitals: string[]) => {
      const clonedQuestions = cloneQuestions(questions);
      const { queue, components } = materializeQuestions(clonedQuestions);

      // Create vitals items from the vitals array
      console.log("Creating vitals items from:", vitals);
      const vitalsItems: VitalsItem[] = vitals.map((vital, index) => {
        // Validate and normalize vital type
        const validVitals: VitalsType[] = [
          "temperature",
          "heartbeat/oxygen",
          "pressure",
          "weight",
          "height",
        ];

        const normalizedVital = validVitals.includes(vital as VitalsType)
          ? (vital as VitalsType)
          : "temperature"; // fallback to temperature if invalid

        return {
          id: `vital_${index}`,
          type: normalizedVital,
          value: undefined,
        };
      });
      console.log("Created vitals items:", vitalsItems);

      // Create vitals components
      const vitalsComponents: ReactNode[] = vitalsItems.map((vital, index) => {
        if (vital.type === "pressure") {
          return <Pressure key={vital.id} />;
        }

        if (vital.type === "height") {
          return <Height key={vital.id} />;
        }

        if (vital.type !== "weight") {
          return (
            <VitalsTemplate key={vital.id} index={index} type={vital.type} />
          );
        }
        return null;
      });

      // Interleave vitals and questions components
      const combinedComponents: ReactNode[] = [];
      const combinedQueue: QuizQueueItem[] = [];

      // Add vitals first, then questions
      vitalsItems.forEach((vital, index) => {
        if (vital.type === "weight") return;

        combinedComponents.push(vitalsComponents[index]);
        // Add a dummy queue item for vitals to maintain index alignment
        combinedQueue.push({
          question: {
            id: vital.id,
            type: "yes_no" as const, // Dummy type for vitals
            question: `Vital: ${vital.type}`,
            answer: undefined,
          },
          lineage: [],
        });
      });

      // Add questions after vitals
      components.forEach((component, index) => {
        combinedComponents.push(component);
        combinedQueue.push(queue[index]);
      });

      setQuestionTree(clonedQuestions);
      setVitalsList(vitalsItems);
      setQuestionQueue(combinedQueue);
      setQuizList(combinedComponents);
      setCurrentIndex(0);
    },
    [cloneQuestions, materializeQuestions]
  );

  const prev = useCallback(() => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, []);

  const next = useCallback(
    async (value: AnswerValue) => {
      const currentItem = questionQueue[currentIndex];
      const currentQuestion = currentItem?.question;

      if (!currentItem || !currentQuestion) {
        return;
      }

      // Handle vitals differently - they don't have nested questions
      const isVital = currentQuestion.id.startsWith("vital_");

      if (isVital) {
        // Update vitals value
        const vitalIndex = parseInt(currentQuestion.id.split("_")[1]);
        setVitalsList((prev) =>
          prev.map((vital, index) =>
            index === vitalIndex ? { ...vital, value: value as string } : vital
          )
        );
      } else {
        // Handle regular questions
        currentQuestion.answer = value;
        let updatedQueue = questionQueue.map((item) => ({ ...item }));
        let updatedList = [...quizList];

        const removalStart = currentIndex + 1;
        while (
          removalStart < updatedQueue.length &&
          updatedQueue[removalStart].lineage.includes(currentQuestion.id)
        ) {
          const candidate = updatedQueue[removalStart];
          candidate.question.answer = undefined;
          updatedQueue.splice(removalStart, 1);
          updatedList.splice(removalStart, 1);
        }

        let nestedQuestions: QuestionType[] | undefined;

        if ("options" in currentQuestion) {
          const matchedOption = currentQuestion.options?.find(
            (option) => option.value === value
          );

          nestedQuestions = matchedOption?.nested_questions;
        }

        if (nestedQuestions && nestedQuestions.length > 0) {
          const lineage = [...currentItem.lineage, currentQuestion.id];
          const materializedNested = materializeQuestions(
            nestedQuestions,
            lineage
          );

          if (materializedNested.queue.length > 0) {
            updatedQueue = [
              ...updatedQueue.slice(0, removalStart),
              ...materializedNested.queue,
              ...updatedQueue.slice(removalStart),
            ];
            updatedList = [
              ...updatedList.slice(0, removalStart),
              ...materializedNested.components,
              ...updatedList.slice(removalStart),
            ];
          }
        }

        setQuestionQueue(updatedQueue);
        setQuizList(updatedList);
        setQuestionTree((prev) => [...prev]);
      }

      if (currentIndex < quizList.length - 1) {
        setCurrentIndex((prevIndex) =>
          Math.min(prevIndex + 1, quizList.length - 1)
        );

        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        console.log("Question tree:", questionTree);
        console.log("Vitals list:", vitalsList);
        // Navigation to the end screen can happen here.

        try {
          if (!user) return;

          // Collect all answers from questions
          const collectAnswers = (question: QuestionType): any[] => {
            const base = question.answer
              ? [{ questionId: question.id, answer: question.answer }]
              : [];
            if ("options" in question && question.options) {
              const nested = question.options.flatMap((opt) =>
                opt.nested_questions
                  ? opt.nested_questions.flatMap((nq) => collectAnswers(nq))
                  : []
              );
              return [...base, ...nested];
            }
            return base;
          };

          const questionAnswers = questionTree
            .flatMap((q) => collectAnswers(q))
            .filter((a) => a.answer !== undefined);

          // Add vitals as answers
          const vitalsAnswers = vitalsList
            .filter((vital) => vital.value !== undefined)
            .map((vital) => ({
              questionId: vital.id,
              answer: vital.value,
            }));

          const allAnswers = [...vitalsAnswers, ...questionAnswers];

          const payload = {
            hospitalPassword: user?.queueNumber,
            answers: allAnswers,
          };

          // Use the new API endpoint
          const response = await fetch("/api/submitTriage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (data.success) {
            console.log("✅ Triage results submitted successfully:", data);
            router.push("/end"); // ✅ Redirect using Next.js router
          } else {
            console.error("❌ Failed to submit triage:", data);
            alert("Erro ao enviar resultados da triagem. Tente novamente.");
          }
        } catch (error) {
          console.error("🚨 Network or processing error:", error);
          alert("Erro de rede ao enviar resultados da triagem.");
        }
      }
    },
    [
      currentIndex,
      materializeQuestions,
      questionQueue,
      quizList,
      questionTree,
      vitalsList,
      user,
      router,
    ]
  );

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <QuizContext.Provider
      value={{
        user,
        setUser,
        createList,
        quizList,
        currentIndex,
        questions: questionTree,
        vitals: vitalsList,
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
