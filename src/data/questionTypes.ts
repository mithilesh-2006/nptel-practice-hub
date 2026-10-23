import { QuestionType } from '../types/question';

export interface QuestionTypeMeta {
  type: QuestionType;
  label: string;
  description: string;
  badgeColor: string;
}

export const QUESTION_TYPES: Record<QuestionType, QuestionTypeMeta> = {
  'single-choice': {
    type: 'single-choice',
    label: 'Single Choice',
    description: 'Select exactly one option',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  },
  'multiple-select': {
    type: 'multiple-select',
    label: 'Multiple Select',
    description: 'One or more options may be correct. Select all that apply.',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  },
  'true-false': {
    type: 'true-false',
    label: 'True / False',
    description: 'Evaluate whether the statement is true or false',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  'numeric': {
    type: 'numeric',
    label: 'Numeric Answer',
    description: 'Enter a numerical calculation or exact number',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  'short-answer': {
    type: 'short-answer',
    label: 'Short Answer',
    description: 'Enter a concise text response',
    badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
  }
};
