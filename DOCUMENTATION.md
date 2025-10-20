# Triage Web Application - API Documentation

## Overview

This is a Triage Web Application built with Next.js that provides an API for hospital systems to register patients and collect triage data. The application supports multiple question types and vitals collection, with automatic forwarding of results to hospital callback URLs.

## 🏥 Application Workflow

1. **Patient Registration**: Hospital system sends a POST request to `/api/patient` to register a new patient
2. **Patient Retrieval**: Frontend retrieves patient data using the hospital password via GET `/api/patient/:hospitalPassword`
3. **Triage Completion**: After completing triage, frontend submits results via POST `/api/submitTriage`
4. **Data Forwarding**: System automatically forwards triage results to the hospital's callback URL

## 🔧 Recent Refactoring Changes

### Code Structure Improvements

- **Centralized CORS Configuration**: Created `src/lib/cors.ts` for consistent CORS handling
- **Validation Utilities**: Added `src/lib/validation.ts` for request validation
- **Type Safety**: Enhanced TypeScript types in `src/types/patient.ts`
- **Consistent Error Handling**: Standardized API responses across all endpoints
- **Cleaner Code**: Removed commented code and improved readability

### CORS Configuration for Vercel Deployment

- **Development**: Allows all origins (including localhost) for testing
- **Production**: Configured for Vercel deployment with proper domain restrictions
- **Preflight Support**: Handles OPTIONS requests for cross-origin requests

## 📡 API Endpoints

### 1. Register New Patient

**POST** `/api/patient`

Registers a new patient in the system with their questions and vitals.

#### Request Body

```typescript
{
  hospitalPassword: string;
  user: {
    name: string;
    dateOfBirth: number; // Unix timestamp
    cpf: string;
  };
  vitals: string[]; // e.g. ["temperature", "heartbeat/oxygen", "pressure", "weight"]
  questions: QuestionType[];
  returnUrl: string;
}
```

#### Question Types

```typescript
interface QuestionType {
  id: string;
  type: "single_selection" | "multi_selection" | "yes_no" | "slider";
  question: string;
  options?: QuestionOption[];
}

interface QuestionOption {
  value: string;
  label: string;
  nested_questions?: QuestionType[];
}
```

#### Response

```typescript
{
  success: true;
  data: {
    patientId: string;
    hospitalPassword: string;
    questionsCount: number;
    vitalsCount: number;
    returnUrl: string;
  }
  message: "Patient data stored successfully";
}
```

### 2. Retrieve Patient Data

**GET** `/api/patient/:hospitalPassword`

Retrieves patient data by hospital password.

#### Response

```typescript
{
  success: true;
  data: {
    queueNumber: string;
    user: PatientUser;
    vitals: string[];
    questions: QuestionType[];
    returnUrl: string;
    createdAt: number;
  };
}
```

### 3. Submit Triage Results

**POST** `/api/submitTriage`

Submits completed triage results and forwards them to the hospital's callback URL.

#### Request Body

```typescript
{
  hospitalPassword: string;
  answers: Array<{
    questionId: string;
    answer: string | string[];
  }>;
}
```

#### Response

```typescript
{
  success: true;
  data: {
    patientId: string;
    answersCount: number;
    sentTo: string;
    completedAt: number;
  }
  message: "Triage results submitted successfully";
}
```

## 🛠️ Technical Implementation

### File Structure

```
src/
├── app/api/
│   ├── newPatient/route.ts          # Patient registration endpoint
│   ├── patient/[hospitalPassword]/route.ts  # Patient retrieval endpoint
│   └── submitTriage/route.ts        # Triage submission endpoint
├── lib/
│   ├── cors.ts                      # CORS configuration
│   ├── validation.ts                # Request validation utilities
│   └── patient-storage.ts           # In-memory storage service
└── types/
    └── patient.ts                   # TypeScript type definitions
```

### Key Features

#### 1. In-Memory Storage

- Patient data stored in memory for 24 hours
- Automatic cleanup of expired entries
- Singleton pattern for consistent storage access

#### 2. Validation

- Hospital password validation (minimum 3 characters)
- URL format validation for return URLs
- Question structure validation
- Request body structure validation

#### 3. Error Handling

- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for debugging

#### 4. CORS Support

- Development: Allows all origins for local testing
- Production: Configurable domain restrictions
- Preflight request handling

## 🚀 Deployment Configuration

### Environment Variables

Create a `.env.local` file for local development:

```bash
# CORS Configuration
ALLOWED_ORIGIN=https://your-domain.vercel.app

# Development
NODE_ENV=development
```

### Vercel Deployment

1. **Environment Variables**:
   - `ALLOWED_ORIGIN`: Set your production domain (e.g., `https://your-domain.vercel.app`)
   - `NODE_ENV`: Automatically set by Vercel to `production`
2. **CORS Configuration**: Automatically handles localhost in development and uses environment variable in production
3. **Production Domain**: Set the `ALLOWED_ORIGIN` environment variable in Vercel dashboard

### Local Development

```bash
npm run dev
# or
pnpm dev
```

The API will be available at `http://localhost:3000/api/`

## 🔒 Security Considerations

### Current Implementation

- Hospital password validation (basic)
- URL format validation
- Request structure validation
- Automatic data expiration (24 hours)

### Production Recommendations

- Implement proper hospital password authentication
- Add rate limiting
- Use HTTPS in production
- Implement proper logging and monitoring
- Consider database storage instead of in-memory

## 📝 Usage Examples

### Register a Patient

```javascript
const response = await fetch("/api/patient", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    hospitalPassword: "12345",
    user: {
      name: "John Doe",
      dateOfBirth: 946684800000, // Unix timestamp
      cpf: "12345678901",
    },
    vitals: ["temperature", "heartbeat/oxygen", "pressure"],
    questions: [
      {
        id: "q1",
        type: "yes_no",
        question: "Are you experiencing chest pain?",
      },
    ],
    returnUrl: "https://hospital-system.com/callback",
  }),
});
```

### Retrieve Patient Data

```javascript
const response = await fetch("/api/patient/12345");
const patientData = await response.json();
```

### Submit Triage Results

```javascript
const response = await fetch("/api/submitTriage", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    hospitalPassword: "12345",
    answers: [
      {
        questionId: "q1",
        answer: "no",
      },
    ],
  }),
});
```

## 🐛 Error Codes

| Status Code | Description                              |
| ----------- | ---------------------------------------- |
| 200         | Success                                  |
| 201         | Created                                  |
| 400         | Bad Request - Invalid request body       |
| 401         | Unauthorized - Invalid hospital password |
| 404         | Not Found - Patient data not found       |
| 405         | Method Not Allowed - Wrong HTTP method   |
| 409         | Conflict - Patient already exists        |
| 500         | Internal Server Error                    |

## 🔄 Data Flow

1. **Hospital System** → POST `/api/patient` → **Triage App** (stores patient data)
2. **Triage App** → GET `/api/patient/:password` → **Frontend** (retrieves patient data)
3. **Frontend** → POST `/api/submitTriage` → **Triage App** (submits results)
4. **Triage App** → POST to `returnUrl` → **Hospital System** (forwards results)

## 📊 Monitoring and Logging

The application includes console logging for:

- Patient data storage operations
- Data retrieval operations
- Triage result submissions
- Error conditions
- Automatic cleanup operations

## 🤝 Contributing

When making changes to the API:

1. Update TypeScript types in `src/types/patient.ts`
2. Add validation in `src/lib/validation.ts` if needed
3. Update this documentation
4. Test with both localhost and production CORS settings

---

**Last Updated**: December 2024
**Version**: 1.0.0
