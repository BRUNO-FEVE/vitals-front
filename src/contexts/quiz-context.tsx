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
import { MOCK_USER } from "@/mock-data/user";
import { MOCK_VITALS } from "@/mock-data/vitals";
import { MOCK_QUESTIONS } from "@/mock-data/questions";

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
  value?: string;
}

// Question structure
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

export type QuestionType =
  | SingleSelectionQuestion
  | MultiSelectionQuestion
  | SliderQuestion
  | YesNoQuestion;

export interface QuizOption {
  value: string;
  label: string;
  nested_questions?: QuestionType[];
}

interface QuizQueueItem {
  question: QuestionType;
  lineage: string[];
}

export interface User {
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
  const [isInitialized, setIsInitialized] = useState(false);

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

      console.log("Creating vitals items from:", vitals);
      const vitalsItems: VitalsItem[] = vitals.map((vital, index) => {
        const validVitals: VitalsType[] = [
          "temperature",
          "heartbeat/oxygen",
          "pressure",
          "weight",
          "height",
        ];

        const normalizedVital = validVitals.includes(vital as VitalsType)
          ? (vital as VitalsType)
          : "temperature";

        return {
          id: `vital_${index}`,
          type: normalizedVital,
          value: undefined,
        };
      });
      console.log("Created vitals items:", vitalsItems);

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

      const combinedComponents: ReactNode[] = [];
      const combinedQueue: QuizQueueItem[] = [];

      vitalsItems.forEach((vital, index) => {
        if (vital.type === "weight") return;

        combinedComponents.push(vitalsComponents[index]);
        combinedQueue.push({
          question: {
            id: vital.id,
            type: "yes_no" as const,
            question: `Vital: ${vital.type}`,
            answer: undefined,
          },
          lineage: [],
        });
      });

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

      const isVital = currentQuestion.id.startsWith("vital_");

      if (isVital) {
        const vitalIndex = parseInt(currentQuestion.id.split("_")[1]);
        setVitalsList((prev) =>
          prev.map((vital, index) =>
            index === vitalIndex ? { ...vital, value: value as string } : vital
          )
        );
      } else {
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

        router.push(`/triage/${user?.queueNumber}/results`);
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
    console.log("Current user:", user);
  }, [user]);

  // Initialize test user and quiz data on mount (only in development)
  useEffect(() => {
    if (!isInitialized && process.env.NEXT_PUBLIC_ENVIRONMENT === "DEV") {
      console.log("🧪 [DEV MODE] Initializing test user:", MOCK_USER);
      setUser(MOCK_USER);

      console.log(
        "🧪 [DEV MODE] Initializing test quiz with questions and vitals"
      );
      createList(MOCK_QUESTIONS, MOCK_VITALS);

      setIsInitialized(true);
    }
  }, [isInitialized, createList]);

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
