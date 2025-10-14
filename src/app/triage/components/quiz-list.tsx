// /* eslint-disable react/jsx-key */
// import { ReactNode } from "react";
// import VitalsTemplate from "./questions/vitals-template";
// import { AnimatedText } from "@/components/animated-text";
// import YesOrNoQuestionTemplate from "./questions/yes-or-no-question-template";
// import SlideQuestion from "./questions/slide-question";
// import EndQuiz from "./end-quiz";
// import { QuizOption } from "@/contexts/quiz-context";

// const POSSIBLE_ANSWERS: QuizOption[] = [];

// export const QuizList: ReactNode[] = [
//   <VitalsTemplate
//     index={0}
//     title={
//       <>
//         Medindo batimentos <br /> cardíacos oxigenação
//       </>
//     }
//   />,
//   <SlideQuestion
//     question="Qual seu nível de dor?"
//     options={POSSIBLE_ANSWERS}
//   />,
//   <YesOrNoQuestionTemplate
//     question={
//       <>
//         <AnimatedText delay={1.8} text={"Você"} />{" "}
//         <AnimatedText delay={2.1} text={"teve"} />{" "}
//         <AnimatedText delay={2.6} text={"febre?"} />{" "}
//       </>
//     }
//   />,

//   // <YesOrNoQuestionTemplate
//   //   question={
//   //     <>
//   //       <AnimatedText delay={1.8} text={"Quantas"} />{" "}
//   //       <AnimatedText delay={2.1} text={"horas"} />{" "}
//   //       <AnimatedText delay={2.6} text={"atrás?"} />{" "}
//   //     </>
//   //   }
//   // />,

//   <EndQuiz />,
// ];
