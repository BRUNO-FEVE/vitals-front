/* eslint-disable react/jsx-key */
import { ReactNode } from "react";
import VitalsTemplate from "./vitals-template";
import { AnimatedText } from "@/components/animated-text";
import YesOrNoQuestionTemplate from "./yes-or-no-question-template";
import PainLevelQuestion from "./pain-level-question";
import EndQuiz from "./end-quiz";

export const QuizList: ReactNode[] = [
  <VitalsTemplate index={0} />,
  <PainLevelQuestion />,
  <YesOrNoQuestionTemplate
    question={
      <>
        <AnimatedText delay={1.8} text={"Você"} />{" "}
        <AnimatedText delay={2.1} text={"teve"} />{" "}
        <AnimatedText delay={2.6} text={"febre?"} />{" "}
      </>
    }
  />,

  // <YesOrNoQuestionTemplate
  //   question={
  //     <>
  //       <AnimatedText delay={1.8} text={"Quantas"} />{" "}
  //       <AnimatedText delay={2.1} text={"horas"} />{" "}
  //       <AnimatedText delay={2.6} text={"atrás?"} />{" "}
  //     </>
  //   }
  // />,

  <EndQuiz />,
];
