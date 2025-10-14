"use client";

import { generateQuestionComponent } from "@/utils/generate-question-component";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

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

interface QuizContextType {
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
    (value: AnswerValue) => {
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
      }
    },
    [currentIndex, materializeQuestions, questionQueue, quizList]
  );

  return (
    <QuizContext.Provider
      value={{
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
