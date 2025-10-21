# Submit Functionality Documentation

## Overview

This document describes the implementation of the submit functionality in the triage results page (`/src/app/triage/[queue-number]/results/page.tsx`). The submit functionality collects all quiz answers (both questions and vitals measurements) and submits them to the hospital's API endpoint.

## Implementation Details

### Core Function: `onSumit`

The `onSumit` function is responsible for:

1. **Data Collection**: Gathering all answers from questions and vitals
2. **Data Formatting**: Converting the data to the API-expected format
3. **API Submission**: Sending the data to `/api/submitTriage`
4. **Error Handling**: Managing submission errors and user feedback
5. **Navigation**: Redirecting to the end page on successful submission

### Data Collection Process

#### 1. Vitals Data Collection

```typescript
// Add vitals answers
vitals.forEach((vital) => {
  if (vital.value) {
    allAnswers.push({
      questionId: vital.id,
      answer: vital.value,
    });
  }
});
```

**Vitals Structure**:

- Each vital has an `id` (e.g., `vital_0`, `vital_1`)
- Each vital has a `type` (temperature, heartbeat/oxygen, pressure, weight, height)
- Each vital has a `value` (the measured value)

#### 2. Questions Data Collection

```typescript
const collectQuestionAnswers = (questions: QuestionType[]): TriageAnswer[] => {
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
          answers.push(...collectQuestionAnswers(option.nested_questions));
        }
      });
    }
  });

  return answers;
};
```

**Question Types Supported**:

- `yes_no`: Yes/No questions
- `single_selection`: Single choice questions
- `multi_selection`: Multiple choice questions
- `slider`: Slider-based questions

**Nested Questions**: The system supports nested questions that appear based on previous answers. The recursive function ensures all nested questions are collected.

### API Submission

#### Request Format

```typescript
const response = await fetch("/api/submitTriage", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    hospitalPassword: user.queueNumber, // Using queueNumber as hospitalPassword
    answers: allAnswers,
  }),
});
```

#### Request Body Structure

```json
{
  "hospitalPassword": "ABC123",
  "answers": [
    {
      "questionId": "vital_0",
      "answer": "98.6"
    },
    {
      "questionId": "vital_1",
      "answer": "72 BPM / 98%"
    },
    {
      "questionId": "q1",
      "answer": "yes"
    },
    {
      "questionId": "q2",
      "answer": "medium"
    }
  ]
}
```

### Error Handling

#### 1. User Data Validation

```typescript
if (!user) {
  console.error("No user data available");
  setSubmitError("Dados do usuário não disponíveis");
  return;
}
```

#### 2. API Error Handling

```typescript
if (!response.ok) {
  console.error("Submission failed:", result);
  setSubmitError(result.error || "Erro ao enviar os dados");
  return;
}
```

#### 3. Network Error Handling

```typescript
catch (error) {
  console.error("Error submitting triage results:", error);
  setSubmitError("Erro de conexão. Tente novamente.");
}
```

### User Interface Updates

#### Loading State

```typescript
const [isSubmitting, setIsSubmitting] = useState(false);
```

- Button shows "Enviando..." during submission
- Button is disabled during submission
- Button color changes to gray during submission

#### Error Display

```typescript
const [submitError, setSubmitError] = useState<string | null>(null);
```

- Error messages are displayed in a red alert box
- Errors are cleared when a new submission is attempted
- User-friendly error messages in Portuguese

### Data Flow

```
1. User clicks "Confirmar e Enviar"
2. onSumit() function is called
3. Data collection begins:
   - Vitals data is collected from vitals array
   - Questions data is collected recursively from questions array
4. Data is formatted into TriageAnswer[] format
5. API call is made to /api/submitTriage
6. Response is handled:
   - Success: Navigate to /end page
   - Error: Display error message to user
7. Loading state is reset
```

### Integration with Quiz Context

The submit functionality integrates with the Quiz Context (`/src/contexts/quiz-context.tsx`) to access:

- `user`: Patient information (name, dateOfBirth, cpf, queueNumber, returnUrl)
- `vitals`: Array of vitals measurements with their values
- `questions`: Array of questions with their answers (including nested questions)

### API Endpoint Details

The submit functionality calls the `/api/submitTriage` endpoint which:

1. **Validates** the request body structure
2. **Retrieves** patient data using the hospital password
3. **Creates** a triage result object
4. **Sends** results to the hospital's callback URL
5. **Removes** patient data from storage after successful submission
6. **Returns** success/error response

### Security Considerations

1. **Data Validation**: All inputs are validated before submission
2. **Error Handling**: Sensitive error information is not exposed to users
3. **Data Cleanup**: Patient data is removed after successful submission
4. **Authentication**: Uses hospital password for API authentication

### Testing

To test the submit functionality:

1. Complete a full triage quiz with questions and vitals
2. Navigate to the results page
3. Click "Confirmar e Enviar"
4. Check browser console for submission logs
5. Verify navigation to the end page on success
6. Test error scenarios (network issues, invalid data)

### Debug Information

The implementation includes comprehensive logging:

```typescript
console.log("Submitting answers:", allAnswers);
console.log("Submission successful:", result);
console.error("Submission failed:", result);
console.error("Error submitting triage results:", error);
```

### Future Enhancements

1. **Retry Logic**: Implement automatic retry for failed submissions
2. **Offline Support**: Cache submissions for offline scenarios
3. **Progress Indicators**: Show detailed progress during submission
4. **Data Validation**: Client-side validation before submission
5. **Analytics**: Track submission success rates and error patterns

## File Structure

```
src/app/triage/[queue-number]/results/
├── page.tsx                    # Main results page with submit functionality
└── components/                 # Additional components if needed

src/contexts/
└── quiz-context.tsx            # Quiz context providing data access

src/app/api/submitTriage/
└── route.ts                    # API endpoint for submission
```

## Dependencies

- React hooks: `useState` for state management
- Next.js: `useRouter` for navigation
- Quiz Context: `useQuiz` for data access
- Custom Button component for UI

## Error Messages

All error messages are in Portuguese for better user experience:

- "Dados do usuário não disponíveis" - No user data available
- "Erro ao enviar os dados" - Error sending data
- "Erro de conexão. Tente novamente." - Connection error, try again

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Author**: AI Assistant
