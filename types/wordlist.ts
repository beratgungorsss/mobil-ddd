export interface Word {
  id: string;
  term: string;
  definition: string;
  examples: string[];
  notes?: string;
  language?: string;
  mastery: number; // 0-100 mastery level
  lastPracticed?: string;
  createdAt: string;
}

export interface WordList {
  id: string;
  name: string;
  description: string;
  language: string;
  wordCount: number;
  words: Word[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface WordListSummary {
  id: string;
  name: string;
  description: string;
  language: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizResult {
  listId: string;
  score: number;
  totalQuestions: number;
  date: string;
  timeSpent: number; // in seconds
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface LearningProgress {
  listId: string;
  wordsLearned: number;
  totalWords: number;
  masteryAverage: number;
  lastPracticed: string;
}