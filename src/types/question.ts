export type QuestionType =
  | 'single-choice'
  | 'multiple-select'
  | 'true-false'
  | 'numeric'
  | 'short-answer';

export interface Question {
  id: string;
  questionNumber: number;
  question: string;
  points: number;
  options: string[];
  questionType: QuestionType;
  userAnswer: string | string[] | null;
  acceptedAnswer: string | string[];
  explanation?: string;
  tags?: string[];
  context?: string;
  validationNotes?: string;
}

export interface Week {
  weekNumber: number;
  title: string;
  questions: Question[];
}

export interface QuestionBankMetadata {
  title: string;
  courseName?: string;
  totalWeeks: number;
  totalQuestions: number;
  totalPoints: number;
  version: number;
  generatedAt?: string;
}

export interface QuestionBank {
  metadata: QuestionBankMetadata;
  weeks: Week[];
}

export type QuizMode = 'practice' | 'exam';

export interface QuizConfig {
  title: string;
  mode: QuizMode;
  selectedWeekNumbers: number[];
  questionLimit?: number;
  questionTypes?: QuestionType[];
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  timeLimitMinutes?: number | null; // null or undefined for untimed
  specificQuestionIds?: string[];
  isCustomSubset?: boolean;
}

export interface ActiveQuestionState {
  question: Question;
  displayOptions: string[];
  userAnswer: string | string[] | null;
  isMarkedForReview: boolean;
  isSubmittedInPractice?: boolean;
  isCorrectInPractice?: boolean;
}

export interface QuestionResult {
  questionId: string;
  weekNumber: number;
  questionNumber: number;
  question: string;
  options: string[];
  questionType: QuestionType;
  points: number;
  userAnswer: string | string[] | null;
  acceptedAnswer: string | string[];
  isCorrect: boolean;
  earnedPoints: number;
  explanation?: string;
  context?: string;
  validationNotes?: string;
}

export interface QuizAttempt {
  id: string;
  timestamp: number;
  title: string;
  mode: QuizMode;
  weekNumbers: number[];
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  timeSpentSeconds: number;
  results: QuestionResult[];
}

export interface WeeklyStats {
  weekNumber: number;
  title: string;
  totalQuestions: number;
  totalPoints: number;
  attemptedCount: number;
  correctCount: number;
  bestPercentage: number;
  lastAttemptTimestamp?: number;
}
