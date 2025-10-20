# Quiz Context Documentation

## Overview

The Quiz Context (`src/contexts/quiz-context.tsx`) is a React context that manages the entire triage process, handling both questions and vitals measurements. It provides a unified interface for managing the quiz flow, user data, and submission of results.

## Key Features

- **Dual Content Management**: Handles both questions and vitals in a single flow
- **Dynamic Question Tree**: Supports nested questions based on user responses
- **Vitals Integration**: Automatically measures vitals before questions
- **State Management**: Manages quiz progress, user data, and navigation
- **API Integration**: Submits combined results to the new API endpoint

## Data Structures

### Types

```typescript
// Vitals types
export type VitalsType =
  | "temperature"
  | "heartbeat/oxygen"
  | "pressure"
  | "weight";

export interface VitalsItem {
  id: string;
  type: VitalsType;
  value?: string; // The measured value
}

// Question types (unchanged from original)
export interface TriagemQuestion {
  id: string;
  question: string;
  answer?: AnswerValue;
}

export type QuestionType =
  | SingleSelectionQuestion
  | MultiSelectionQuestion
  | SliderQuestion
  | YesNoQuestion;

// User interface
interface User {
  queueNumber: string;
  name: string;
  dateOfBirth: number;
  cpf: string;
  returnUrl: string;
}
```

### Context Interface

```typescript
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
```

## Core Functions

### `createList(questions: QuestionType[], vitals: string[])`

**Purpose**: Creates the complete quiz flow combining vitals and questions.

**Process**:

1. **Clone Questions**: Creates a deep copy of questions to avoid mutations
2. **Create Vitals Items**: Converts vitals array into structured `VitalsItem[]`
3. **Generate Components**: Creates React components for both vitals and questions
4. **Interleave Content**: Places vitals first, then questions in the flow
5. **Initialize State**: Sets up the quiz queue, components list, and resets index

**Flow Order**:

```
Vitals (in order) → Questions (in order) → Nested Questions (dynamic)
```

**Example**:

```typescript
const questions = [
  { id: "q1", type: "yes_no", question: "Do you have chest pain?" },
  // ... more questions
];

const vitals = ["temperature", "heartbeat/oxygen", "pressure"];

createList(questions, vitals);
// Creates: [TemperatureVital, HeartbeatVital, PressureVital, Q1, Q2, ...]
```

### `next(value: AnswerValue)`

**Purpose**: Advances the quiz and handles both vitals and question responses.

**Vitals Handling**:

- Updates the corresponding `VitalsItem.value` with the measured value
- Automatically advances to the next item
- No nested content logic (vitals are linear)

**Question Handling**:

- Updates the question's answer
- Removes dependent nested questions if answer changes
- Adds new nested questions based on the selected option
- Maintains question lineage for proper nesting

**Submission Process**:
When reaching the end of the quiz:

1. **Collect Question Answers**: Recursively gathers all answered questions
2. **Collect Vitals Values**: Gathers all measured vitals
3. **Combine Results**: Merges vitals and question answers
4. **Submit to API**: Uses `/api/submitTriage` endpoint
5. **Navigate**: Redirects to success page on completion

### `prev()`

**Purpose**: Navigates backward through the quiz.

**Behavior**:

- Decrements `currentIndex` by 1
- Minimum index is 0 (can't go before first item)
- Maintains all current state (doesn't undo answers)

## State Management

### Primary State

```typescript
const [questionQueue, setQuestionQueue] = useState<QuizQueueItem[]>([]);
const [quizList, setQuizList] = useState<ReactNode[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [questionTree, setQuestionTree] = useState<QuestionType[]>([]);
const [vitalsList, setVitalsList] = useState<VitalsItem[]>([]);
const [user, setUser] = useState<User | undefined>(undefined);
```

### State Relationships

- **`questionQueue`**: Contains metadata for navigation and question management
- **`quizList`**: React components rendered in the UI
- **`currentIndex`**: Current position in the quiz flow
- **`questionTree`**: Original question structure for answer collection
- **`vitalsList`**: Vitals measurements and their values
- **`user`**: Patient information for submission

## Quiz Flow Logic

### 1. Initialization

```typescript
// In triage page
const patientData = await fetchPatientData();
createList(patientData.questions, patientData.vitals);
```

### 2. Vitals Measurement

- Each vital component runs for 10 seconds
- Shows progress bar and measurement UI
- Automatically calls `next()` with the measured value
- Values are stored in `vitalsList`

### 3. Question Flow

- User answers questions
- Nested questions appear based on selections
- Previous answers can be changed (removes dependent questions)
- All answers stored in `questionTree`

### 4. Submission

```typescript
const allAnswers = [
  ...vitalsAnswers, // { questionId: "vital_0", answer: "98.6" }
  ...questionAnswers, // { questionId: "q1", answer: "yes" }
];
```

## Integration Points

### API Integration

- **Patient Retrieval**: Uses `/api/patient/:hospitalPassword`
- **Submission**: Uses `/api/submitTriage` with new standardized format
- **Error Handling**: Proper error states and user feedback

### Component Integration

- **VitalsTemplate**: Automatically included for each vital type
- **Question Components**: Generated via `generateQuestionComponent()`
- **Navigation**: Smooth scrolling and animations

### UI Integration

- **Progress Tracking**: `currentIndex` for progress indicators
- **State Persistence**: All answers maintained during navigation
- **Error States**: Proper error handling and user feedback

## Usage Examples

### Basic Setup

```typescript
const { createList, next, prev, currentIndex, user } = useQuiz();

// Initialize quiz with questions and vitals
useEffect(() => {
  if (patientData) {
    createList(patientData.questions, patientData.vitals);
  }
}, [patientData]);
```

### Navigation

```typescript
// Next question/vital
const handleAnswer = (answer: string) => {
  next(answer);
};

// Previous question/vital
const handlePrevious = () => {
  prev();
};
```

### State Access

```typescript
const {
  currentIndex, // Current position
  quizList, // All components
  user, // Patient data
  vitals, // Vitals measurements
  questions, // Question tree
} = useQuiz();
```

## Error Handling

### Network Errors

- API call failures are caught and logged
- User-friendly error messages displayed
- Graceful fallback to error states

### Validation Errors

- Invalid responses handled gracefully
- State consistency maintained
- User feedback provided

### State Errors

- Boundary checks for array access
- Safe navigation between items
- Proper cleanup on unmount

## Performance Considerations

### Optimization Strategies

- **Memoization**: Callbacks wrapped with `useCallback`
- **Deep Cloning**: Efficient question cloning
- **Component Reuse**: Vitals components reused with different props
- **State Updates**: Batched updates for better performance

### Memory Management

- **Cleanup**: Proper cleanup of intervals and listeners
- **State Reset**: Complete state reset on new quiz creation
- **Garbage Collection**: Automatic cleanup of removed nested questions

## Future Enhancements

### Potential Improvements

1. **Offline Support**: Cache questions and vitals for offline use
2. **Progress Persistence**: Save progress to localStorage
3. **Analytics**: Track completion rates and user behavior
4. **Accessibility**: Enhanced screen reader support
5. **Internationalization**: Multi-language support

### Extensibility

- **New Vitals Types**: Easy to add new vital measurements
- **Custom Components**: Support for custom question types
- **Validation Rules**: Configurable validation per question
- **Conditional Logic**: More complex conditional question flows

## Troubleshooting

### Common Issues

1. **Vitals Not Showing**: Check if vitals array is properly passed to `createList()`
2. **Questions Not Appearing**: Verify question structure matches expected format
3. **Submission Fails**: Check API endpoint and payload format
4. **Navigation Issues**: Ensure `currentIndex` is within bounds

### Debug Information

```typescript
// Enable debug logging
console.log("Question tree:", questionTree);
console.log("Vitals list:", vitalsList);
console.log("Current index:", currentIndex);
console.log("Quiz list length:", quizList.length);
```

---

**Last Updated**: December 2024
**Version**: 2.0.0 (Vitals Integration)
