/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { generateQuestionComponent } from "@/utils/generate-question-component";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export type AnswerValue = string | string[];

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

  createList: (questions: QuestionType[]) => void;

  quizList: ReactNode[];
  currentIndex: number;
  questions: QuestionType[];

  prev: () => void;
  next: (value: AnswerValue) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [questionQueue, setQuestionQueue] = useState<QuizQueueItem[]>([]);
  const [quizList, setQuizList] = useState<ReactNode[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionTree, setQuestionTree] = useState<QuestionType[]>([]);
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
    (questions: QuestionType[]) => {
      const clonedQuestions = cloneQuestions(questions);
      const { queue, components } = materializeQuestions(clonedQuestions);

      setQuestionTree(clonedQuestions);
      setQuestionQueue(queue);
      setQuizList(components);
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

      if (currentIndex < updatedList.length - 1) {
        setCurrentIndex((prevIndex) =>
          Math.min(prevIndex + 1, updatedList.length - 1)
        );

        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        console.log(questionTree);
        // Navigation to the end screen can happen here.

        try {
          // const answers = questionTree
          //   .flatMap((q) => {
          //     const collectAnswers = (question: QuestionType): any[] => {
          //       const base = question.answer
          //         ? [{ questionId: question.id, answer: question.answer }]
          //         : [];
          //       if ("options" in question && question.options) {
          //         const nested = question.options.flatMap((opt) =>
          //           opt.nested_questions
          //             ? opt.nested_questions.flatMap((nq) => collectAnswers(nq))
          //             : []
          //         );
          //         return [...base, ...nested];
          //       }
          //       return base;
          //     };
          //     return collectAnswers(q);
          //   })
          //   .filter((a) => a.answer !== undefined);

          if (!user) return;

          const payload = {
            hospitalPassword: user?.queueNumber,
            answers: questionTree,
          };

          const response = await axios.post(user.returnUrl, payload, {
            headers: { "Content-Type": "application/json" },
          });

          const data = (await response.data) as any;

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
    [currentIndex, materializeQuestions, questionQueue, quizList]
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
