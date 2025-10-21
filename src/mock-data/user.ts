import { User } from "@/contexts/quiz-context";

const MOCK_USER: User = {
  queueNumber: "223",
  name: "Bruno Augusto Lopes Fevereiro",
  dateOfBirth: 1034218800000, // October 10, 2002
  cpf: "12345678901",
  returnUrl: "http://localhost:4000/api/submitTriage",
};

export { MOCK_USER };
