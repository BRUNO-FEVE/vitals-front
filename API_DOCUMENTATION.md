# Hospital Triage API Documentation

This document describes the API endpoints for the hospital triage system.

## Overview

The API allows hospitals to register new patients and their triage questions, and enables the triage application to retrieve patient data and submit results back to the hospital.

## Base URL

All API endpoints are prefixed with `/api/`

## Endpoints

### 1. Create New Patient

**POST** `/api/newPatient`

Creates a new patient record with triage questions.

#### Request Body

```json
{
  "hospitalPassword": "HOSP1234",
  "user": {
    "name": "João Silva",
    "dateOfBirth": 915148800000,
    "cpf": "12345678900"
  },
  "questions": [
    {
      "id": "q1",
      "type": "yes_no",
      "question": "Você está sentindo dor de cabeça?",
      "options": [
        { "id": "yes", "label": "Sim" },
        { "id": "no", "label": "Não" }
      ]
    },
    {
      "id": "q2",
      "type": "single_selection",
      "question": "Qual é a intensidade da dor?",
      "options": [
        { "id": "low", "label": "Leve" },
        { "id": "medium", "label": "Moderada" },
        { "id": "high", "label": "Forte" }
      ]
    }
  ],
  "returnUrl": "https://hospital-api.com/triage/result"
}
```

#### Response

**Success (201 Created):**

```json
{
  "message": "Patient data stored successfully",
  "patientId": "12345678900",
  "hospitalPassword": "HOSP1234",
  "questionsCount": 2,
  "returnUrl": "https://hospital-api.com/triage/result"
}
```

**Error (400 Bad Request):**

```json
{
  "error": "Invalid request body. Please check the structure and required fields.",
  "details": "Required fields: hospitalPassword (string), user (object with name, dateOfBirth, cpf), questions (array), returnUrl (string)"
}
```

**Error (401 Unauthorized):**

```json
{
  "error": "Invalid hospital password"
}
```

**Error (409 Conflict):**

```json
{
  "error": "Patient data already exists for this hospital password"
}
```

### 2. Get Patient Data

**GET** `/api/patient/[hospitalPassword]`

Retrieves patient data and questions using the hospital password.

#### Response

**Success (200 OK):**

```json
{
  "user": {
    "name": "João Silva",
    "dateOfBirth": 915148800000,
    "cpf": "12345678900"
  },
  "questions": [
    {
      "id": "q1",
      "type": "yes_no",
      "question": "Você está sentindo dor de cabeça?",
      "options": [
        { "id": "yes", "label": "Sim" },
        { "id": "no", "label": "Não" }
      ]
    }
  ],
  "createdAt": 1703123456789
}
```

**Error (404 Not Found):**

```json
{
  "error": "Patient data not found or expired"
}
```

### 3. Submit Triage Results

**POST** `/api/submitTriage`

Submits completed triage results to the hospital's callback URL.

#### Request Body

```json
{
  "hospitalPassword": "HOSP1234",
  "answers": [
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

#### Response

**Success (200 OK):**

```json
{
  "message": "Triage results submitted successfully",
  "patientId": "12345678900",
  "answersCount": 2,
  "sentTo": "https://hospital-api.com/triage/result"
}
```

**Error (404 Not Found):**

```json
{
  "error": "Patient data not found or expired"
}
```

## Data Types

### Question Types

- `yes_no`: Yes/No questions
- `single_selection`: Single choice questions
- `multi_selection`: Multiple choice questions
- `slider`: Slider-based questions

### Answer Values

- For `yes_no` and `single_selection`: `string`
- For `multi_selection`: `string[]`
- For `slider`: `string` (representing the selected value)

## Authentication

Currently, the system uses simple hospital password validation. In a production environment, this should be replaced with proper authentication mechanisms.

## Data Storage

Patient data is stored in memory and automatically expires after 24 hours. In a production environment, this should be replaced with a persistent database.

## Error Handling

All endpoints return appropriate HTTP status codes and error messages in JSON format.

## Testing

Use the provided `test-endpoint.js` script to test the API endpoints:

```bash
# Start the development server
npm run dev

# In another terminal, run the test
node test-endpoint.js
```

## Security Considerations

1. **Hospital Password Validation**: Currently accepts any non-empty password. In production, implement proper authentication.
2. **Data Expiration**: Patient data expires after 24 hours to prevent data accumulation.
3. **Input Validation**: All inputs are validated for structure and required fields.
4. **URL Validation**: Return URLs are validated to ensure they are properly formatted.

## Future Enhancements

1. Database integration for persistent storage
2. Proper authentication and authorization
3. Rate limiting
4. Logging and monitoring
5. Data encryption
6. API versioning
