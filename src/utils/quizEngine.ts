import { Question, QuestionBank, QuizConfig, ActiveQuestionState } from '../types/question';

/**
 * Fisher-Yates shuffle that returns a new array.
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Builds an active quiz from configuration and question bank.
 * Ensures:
 * - No duplicate questions
 * - Proper week/type filtering
 * - Shuffling of questions if requested
 * - Shuffling of options if requested (preserving answer correctness)
 * - Safe limit handling without placeholder questions
 */
export function buildQuizQuestions(
  bank: QuestionBank,
  config: QuizConfig
): ActiveQuestionState[] {
  const selectedWeeks = new Set(config.selectedWeekNumbers);
  const selectedTypes = config.questionTypes ? new Set(config.questionTypes) : null;
  const specificIds = config.specificQuestionIds ? new Set(config.specificQuestionIds) : null;

  const candidateQuestions: Question[] = [];
  const seenIds = new Set<string>();

  for (const week of bank.weeks) {
    if (selectedWeeks.size > 0 && !selectedWeeks.has(week.weekNumber)) {
      continue;
    }

    for (const q of week.questions) {
      if (seenIds.has(q.id)) {
        continue;
      }
      if (specificIds && !specificIds.has(q.id)) {
        continue;
      }
      if (selectedTypes && !selectedTypes.has(q.questionType)) {
        continue;
      }

      seenIds.add(q.id);
      candidateQuestions.push(q);
    }
  }

  // Shuffle questions if requested
  let orderedQuestions = config.shuffleQuestions
    ? shuffleArray(candidateQuestions)
    : [...candidateQuestions];

  // Apply question limit if specified
  if (config.questionLimit && config.questionLimit > 0 && config.questionLimit < orderedQuestions.length) {
    orderedQuestions = orderedQuestions.slice(0, config.questionLimit);
  }

  // Create ActiveQuestionState items
  return orderedQuestions.map((q) => {
    let displayOptions = [...q.options];
    // Only shuffle options for choice questions if enabled
    if (config.shuffleOptions && q.questionType !== 'true-false' && displayOptions.length > 1) {
      displayOptions = shuffleArray(displayOptions);
    }

    return {
      question: q,
      displayOptions,
      userAnswer: null,
      isMarkedForReview: false,
      isSubmittedInPractice: false,
      isCorrectInPractice: false
    };
  });
}
