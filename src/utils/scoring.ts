import { Question, QuestionResult, QuestionType } from '../types/question';

/**
 * Normalizes text for comparison by trimming whitespace and normalizing spaces.
 */
export function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Validates whether a user's answer matches the accepted answer.
 * Handles:
 * - single-choice / true-false (string comparison)
 * - multiple-select (set comparison, order independent)
 * - numeric (numeric equivalence with tolerance for float, or integer match)
 * - short-answer (case-insensitive normalized string match)
 */
export function isAnswerCorrect(
  questionType: QuestionType,
  userAnswer: string | string[] | null | undefined,
  acceptedAnswer: string | string[],
  numericTolerance: number = 0.001
): boolean {
  if (userAnswer === null || userAnswer === undefined) {
    return false;
  }

  // Multiple-select evaluation: exact set match
  if (questionType === 'multiple-select') {
    if (!Array.isArray(userAnswer)) {
      return false;
    }
    const acceptedSet = Array.isArray(acceptedAnswer)
      ? new Set(acceptedAnswer.map(normalizeText))
      : new Set([normalizeText(acceptedAnswer)]);

    const userSet = new Set(userAnswer.map(normalizeText));

    if (acceptedSet.size !== userSet.size) {
      return false;
    }

    for (const item of userSet) {
      if (!acceptedSet.has(item)) {
        return false;
      }
    }
    return true;
  }

  // Numeric evaluation
  if (questionType === 'numeric') {
    if (typeof userAnswer !== 'string' || userAnswer.trim() === '') {
      return false;
    }
    const targetStr = Array.isArray(acceptedAnswer) ? acceptedAnswer[0] : acceptedAnswer;
    const userNum = parseFloat(userAnswer.trim());
    const targetNum = parseFloat(String(targetStr).trim());

    if (!isNaN(userNum) && !isNaN(targetNum)) {
      return Math.abs(userNum - targetNum) <= numericTolerance;
    }
    // Fallback to normalized text equality if not purely float
    return normalizeText(userAnswer).toLowerCase() === normalizeText(String(targetStr)).toLowerCase();
  }

  // Short-answer evaluation
  if (questionType === 'short-answer') {
    if (typeof userAnswer !== 'string' || userAnswer.trim() === '') {
      return false;
    }
    const targetStr = Array.isArray(acceptedAnswer) ? acceptedAnswer[0] : acceptedAnswer;
    return normalizeText(userAnswer).toLowerCase() === normalizeText(targetStr).toLowerCase();
  }

  // Single-choice and True/False evaluation
  if (typeof userAnswer !== 'string') {
    return false;
  }

  const target = Array.isArray(acceptedAnswer) ? acceptedAnswer[0] : acceptedAnswer;
  return normalizeText(userAnswer) === normalizeText(target);
}

/**
 * Evaluates a single question answer and returns the complete QuestionResult.
 */
export function evaluateQuestion(
  question: Question,
  userAnswer: string | string[] | null | undefined
): QuestionResult {
  const isUnanswered =
    userAnswer === null ||
    userAnswer === undefined ||
    (Array.isArray(userAnswer) && userAnswer.length === 0) ||
    (typeof userAnswer === 'string' && userAnswer.trim() === '');

  const correct = !isUnanswered && isAnswerCorrect(question.questionType, userAnswer, question.acceptedAnswer);
  const earnedPoints = correct ? (question.points || 1) : 0;

  // Extract week number from question id 'w{week}-q{q}' or default to 1
  const weekMatch = question.id.match(/^w(\d+)-/);
  const weekNumber = weekMatch ? parseInt(weekMatch[1], 10) : 1;

  return {
    questionId: question.id,
    weekNumber,
    questionNumber: question.questionNumber,
    question: question.question,
    options: question.options,
    questionType: question.questionType,
    points: question.points,
    userAnswer: isUnanswered ? null : userAnswer,
    acceptedAnswer: question.acceptedAnswer,
    isCorrect: correct,
    earnedPoints,
    explanation: question.explanation,
    context: question.context,
    validationNotes: question.validationNotes
  };
}

export interface QuizScoreSummary {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  accuracyByWeek: Record<number, { total: number; correct: number; points: number; earnedPoints: number }>;
  accuracyByType: Record<QuestionType, { total: number; correct: number; points: number; earnedPoints: number }>;
}

/**
 * Calculates the comprehensive score summary for a collection of evaluated questions.
 */
export function calculateQuizSummary(results: QuestionResult[]): QuizScoreSummary {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let totalPoints = 0;
  let earnedPoints = 0;

  const accuracyByWeek: Record<number, { total: number; correct: number; points: number; earnedPoints: number }> = {};
  const accuracyByType: Record<QuestionType, { total: number; correct: number; points: number; earnedPoints: number }> = {
    'single-choice': { total: 0, correct: 0, points: 0, earnedPoints: 0 },
    'multiple-select': { total: 0, correct: 0, points: 0, earnedPoints: 0 },
    'true-false': { total: 0, correct: 0, points: 0, earnedPoints: 0 },
    'numeric': { total: 0, correct: 0, points: 0, earnedPoints: 0 },
    'short-answer': { total: 0, correct: 0, points: 0, earnedPoints: 0 },
  };

  for (const r of results) {
    const pts = r.points || 1;
    totalPoints += pts;

    // Week stats
    if (!accuracyByWeek[r.weekNumber]) {
      accuracyByWeek[r.weekNumber] = { total: 0, correct: 0, points: 0, earnedPoints: 0 };
    }
    accuracyByWeek[r.weekNumber].total += 1;
    accuracyByWeek[r.weekNumber].points += pts;

    // Type stats
    if (!accuracyByType[r.questionType]) {
      accuracyByType[r.questionType] = { total: 0, correct: 0, points: 0, earnedPoints: 0 };
    }
    accuracyByType[r.questionType].total += 1;
    accuracyByType[r.questionType].points += pts;

    if (r.userAnswer === null || (Array.isArray(r.userAnswer) && r.userAnswer.length === 0)) {
      unansweredCount++;
    } else if (r.isCorrect) {
      correctCount++;
      earnedPoints += pts;
      accuracyByWeek[r.weekNumber].correct += 1;
      accuracyByWeek[r.weekNumber].earnedPoints += pts;
      accuracyByType[r.questionType].correct += 1;
      accuracyByType[r.questionType].earnedPoints += pts;
    } else {
      incorrectCount++;
    }
  }

  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 1000) / 10 : 0;

  return {
    totalQuestions: results.length,
    correctCount,
    incorrectCount,
    unansweredCount,
    totalPoints,
    earnedPoints,
    percentage,
    accuracyByWeek,
    accuracyByType
  };
}
