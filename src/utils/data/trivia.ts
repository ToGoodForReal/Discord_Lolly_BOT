interface TriviaQuestion {
  question: string;
  options: readonly string[];
  correct: number;
  explanation: string;
}

export const TRIVIA_QUESTIONS: readonly TriviaQuestion[] = [
  {
    question: 'Qual é a capital do Brasil?',
    options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
    correct: 2,
    explanation: 'Brasília é a capital federal do Brasil desde 1960!',
  },
  {
    question: 'Quantos planetas existem no sistema solar?',
    options: ['7', '8', '9', '10'],
    correct: 1,
    explanation: 'Existem 8 planetas no sistema solar (Plutão foi reclassificado como planeta anão).',
  },
  {
    question: 'Qual é o maior oceano do mundo?',
    options: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'],
    correct: 3,
    explanation: 'O Oceano Pacífico é o maior oceano do mundo!',
  },
  {
    question: 'Em que ano o homem pisou na Lua pela primeira vez?',
    options: ['1967', '1969', '1971', '1973'],
    correct: 1,
    explanation: 'Neil Armstrong pisou na Lua em 20 de julho de 1969.',
  },
] as const;
