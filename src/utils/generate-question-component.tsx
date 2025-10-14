import MultiSelectionQuestion from "@/app/triage/[queue-number]/components/questions/multi-selection-question";
import SingleSelectionQuestion from "@/app/triage/[queue-number]/components/questions/single-selection-question";
import SlideQuestion from "@/app/triage/[queue-number]/components/questions/slide-question";
import YesOrNoQuestionTemplate from "@/app/triage/[queue-number]/components/questions/yes-or-no-question-template";
import { QuestionType } from "@/contexts/quiz-context";

export function generateQuestionComponent(question: QuestionType) {
  switch (question.type) {
    case "yes_no":
      return (
        <YesOrNoQuestionTemplate
          question={question.question}
          options={question.options}
        />
      );
    case "single_selection":
      return (
        <SingleSelectionQuestion
          question={question.question}
          options={question.options}
        />
      );
    case "multi_selection":
      return (
        <MultiSelectionQuestion
          question={question.question}
          options={question.options}
        />
      );
    case "slider":
      return (
        <SlideQuestion
          question={question.question}
          options={question.options}
        />
      );

    default:
      break;
  }
}
