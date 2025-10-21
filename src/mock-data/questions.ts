import { QuestionType } from "@/contexts/quiz-context";

// Mock questions data with nested structure
const MOCK_QUESTIONS: QuestionType[] = [
  {
    id: "principal_motivo",
    type: "single_selection",
    question: "Qual o principal motivo da sua vinda hoje?",
    options: [
      { value: "pain", label: "Dor" },
      { value: "fever", label: "Febre" },
      { value: "nausea_vomiting", label: "Náusea/Vômito" },
      {
        value: "breathing_difficulty",
        label: "Dificuldade para respirar/Tosse",
      },
      { value: "shortness_palpitations", label: "Falta de ar/Palpitações" },
      { value: "dizziness_headache", label: "Tontura/Dor de cabeça" },
      { value: "rash_allergies", label: "Manchas/Alergias" },
    ],
  },
  {
    id: "sentindo_dor",
    type: "yes_no",
    question: "Você está sentindo dor?",
    options: [
      {
        value: "yes",
        label: "Sim",
        nested_questions: [
          {
            id: "nivel_dor",
            type: "slider",
            question: "Qual o nível da sua dor (Escala de 1 a 10)?",
            options: [
              { label: "Dor muito leve", value: "very_mild" },
              { label: "Dor leve", value: "mild" },
              { label: "Dor incômoda", value: "annoying" },
              { label: "Dor desconfortável", value: "uncomfortable" },
              { label: "Dor moderada", value: "moderate" },
              { label: "Dor forte", value: "strong" },
              { label: "Dor muito forte", value: "very_strong" },
              { label: "Dor intensa", value: "intense" },
              { label: "Dor extrema", value: "extreme" },
              { label: "Dor insuportável", value: "unbearable" },
              { label: "Pior dor possível", value: "worst_possible" },
            ],
          },
          {
            id: "regiao_dor",
            type: "multi_selection",
            question: "Em qual região do corpo você sente a dor?",
            options: [
              { value: "head_neck", label: "Cabeça/Pescoço" },
              { value: "abdomen", label: "Abdômen" },
              { value: "back", label: "Costas" },
              { value: "arms_hands", label: "Braços/Mãos" },
              { value: "legs_feet", label: "Pernas/Pés" },
              { value: "other_region", label: "Outra região" },
            ],
          },
          {
            id: "tipo_dor",
            type: "single_selection",
            question: "Como é a dor?",
            options: [
              { value: "stabbing", label: "Em pontada" },
              { value: "burning", label: "Queimação/Ardência" },
              { value: "pressure", label: "Aperto" },
              { value: "cramp", label: "Cólica" },
              { value: "other_type", label: "Outro tipo" },
            ],
          },
        ],
      },
      { value: "no", label: "Não" },
    ],
  },
  {
    id: "teve_febre",
    type: "yes_no",
    question: "Você teve febre?",
    options: [
      {
        value: "yes",
        label: "Sim",
        nested_questions: [
          {
            id: "temperatura_maxima",
            type: "single_selection",
            question: "Qual a temperatura mais alta que você mediu?",
            options: [
              { value: "up_to_37_9", label: "Até 37.9°C" },
              { value: "38_0_to_38_9", label: "38.0°C a 38.9°C" },
              { value: "39_0_to_39_9", label: "39.0°C a 39.9°C" },
              { value: "40_or_more", label: "40.0°C ou mais" },
            ],
          },
          {
            id: "ainda_com_febre",
            type: "yes_no",
            question: "Ainda está com febre?",
            options: [
              { value: "yes", label: "Sim" },
              {
                value: "no",
                label: "Não",
                nested_questions: [
                  {
                    id: "tempo_febre_parou",
                    type: "single_selection",
                    question: "A febre parou há quanto tempo?",
                    options: [
                      { value: "less_6h", label: "Menos de 6 horas" },
                      { value: "6h_12h", label: "6 a 12 horas" },
                      { value: "12h_24h", label: "12 a 24 horas" },
                      { value: "more_24h", label: "Mais de 24 horas" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      { value: "no", label: "Não" },
    ],
  },
  {
    id: "nausea_ou_vomito",
    type: "yes_no",
    question: "Você teve náusea ou episódios de vômito?",
  },
  { id: "teve_tontura", type: "yes_no", question: "Você teve tontura?" },
  {
    id: "teve_dor_cabeca",
    type: "yes_no",
    question: "Você teve dor de cabeça?",
  },
  {
    id: "manchas_alergias",
    type: "yes_no",
    question: "Você notou manchas ou alergias pelo corpo?",
    options: [
      {
        value: "yes",
        label: "Sim",
        nested_questions: [
          {
            id: "local_manchas",
            type: "multi_selection",
            question: "Onde as manchas/alergias se localizam?",
            options: [
              { value: "head", label: "Cabeça" },
              { value: "neck", label: "Pescoço" },
              { value: "abdomen", label: "Abdômen" },
              { value: "back", label: "Costas" },
              { value: "arms_hands", label: "Braços/Mãos" },
              { value: "legs_feet", label: "Pernas/Pés" },
              { value: "other_location", label: "Outra" },
            ],
          },
        ],
      },
      { value: "no", label: "Não" },
    ],
  },
  {
    id: "perda_apetite",
    type: "yes_no",
    question: "Você teve perda de apetite?",
  },
  {
    id: "sintomas_respiratorios",
    type: "yes_no",
    question: "Você tem tosse, falta de ar, ou dor no peito?",
  },
  {
    id: "alteracao_intestinal",
    type: "yes_no",
    question:
      "Você notou alguma alteração no ritmo intestinal (diarreia, prisão de ventre)?",
  },
  {
    id: "dor_urinar",
    type: "yes_no",
    question: "Você sente dor ou ardência ao urinar?",
  },
  {
    id: "episodio_anterior",
    type: "yes_no",
    question: "Já teve episódios com este problema antes?",
    options: [
      {
        value: "yes",
        label: "Sim",
        nested_questions: [
          {
            id: "tempo_ultimo_episodio",
            type: "slider",
            question: "Há quanto tempo foi o último episódio?",
            options: [
              { value: "1_week", label: "1 semana" },
              { value: "1_month", label: "1 mês" },
              { value: "over_2_months", label: "Mais de 2 meses" },
              { value: "over_6_months", label: "Mais de 6 meses" },
              { value: "over_1_year", label: "Mais de 1 ano" },
            ],
          },
        ],
      },
      { value: "no", label: "Não" },
    ],
  },
  {
    id: "doenca_cronica",
    type: "yes_no",
    question:
      "Você tem alguma doença crônica (ex: diabetes, hipertensão, asma)?",
  },
  {
    id: "uso_medicamento_continuo",
    type: "yes_no",
    question: "Faz uso de algum medicamento contínuo?",
  },
  {
    id: "alergia",
    type: "yes_no",
    question: "Você tem alergia a algum medicamento, alimento ou substância?",
  },
  { id: "fuma_atualmente", type: "yes_no", question: "Você fuma atualmente?" },
  {
    id: "alcool_drogas",
    type: "yes_no",
    question: "Você consome bebidas alcoólicas ou drogas ilícitas?",
  },
  {
    id: "possibilidade_gravidez",
    type: "yes_no",
    question: "Há possibilidade de gravidez?",
  },
];

export { MOCK_QUESTIONS };
