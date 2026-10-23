import { describe, it, expect } from 'vitest';
import { buildQuizQuestions, shuffleArray } from '../quizEngine';
import { QuestionBank, QuizConfig } from '../../types/question';

const mockBank: QuestionBank = {
  metadata: {
    title: 'Test Bank',
    totalWeeks: 2,
    totalQuestions: 4,
    totalPoints: 5,
    version: 1
  },
  weeks: [
    {
      weekNumber: 1,
      title: 'Week 1',
      questions: [
        {
          id: 'w1-q1',
          questionNumber: 1,
          question: 'Q 1-1',
          points: 1,
          options: ['A', 'B'],
          questionType: 'single-choice',
          userAnswer: null,
          acceptedAnswer: 'A'
        },
        {
          id: 'w1-q2',
          questionNumber: 2,
          question: 'Q 1-2',
          points: 2,
          options: ['Opt 1', 'Opt 2'],
          questionType: 'multiple-select',
          userAnswer: null,
          acceptedAnswer: ['Opt 1', 'Opt 2']
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Week 2',
      questions: [
        {
          id: 'w2-q1',
          questionNumber: 1,
          question: 'Q 2-1',
          points: 1,
          options: ['True', 'False'],
          questionType: 'true-false',
          userAnswer: null,
          acceptedAnswer: 'True'
        },
        {
          id: 'w2-q2',
          questionNumber: 2,
          question: 'Q 2-2',
          points: 1,
          options: [],
          questionType: 'numeric',
          userAnswer: null,
          acceptedAnswer: '42'
        }
      ]
    }
  ]
};

describe('Quiz Engine', () => {
  it('correctly filters questions by selected week', () => {
    const config: QuizConfig = {
      title: 'Week 1 Only',
      mode: 'practice',
      selectedWeekNumbers: [1],
      shuffleQuestions: false,
      shuffleOptions: false
    };

    const built = buildQuizQuestions(mockBank, config);
    expect(built.length).toBe(2);
    expect(built[0].question.id).toBe('w1-q1');
    expect(built[1].question.id).toBe('w1-q2');
  });

  it('correctly filters questions by question type', () => {
    const config: QuizConfig = {
      title: 'Numerics only',
      mode: 'exam',
      selectedWeekNumbers: [1, 2],
      questionTypes: ['numeric'],
      shuffleQuestions: false,
      shuffleOptions: false
    };

    const built = buildQuizQuestions(mockBank, config);
    expect(built.length).toBe(1);
    expect(built[0].question.id).toBe('w2-q2');
  });

  it('correctly applies question limit without inventing placeholders', () => {
    const config: QuizConfig = {
      title: 'Limited to 2',
      mode: 'exam',
      selectedWeekNumbers: [1, 2],
      questionLimit: 2,
      shuffleQuestions: false,
      shuffleOptions: false
    };

    const built = buildQuizQuestions(mockBank, config);
    expect(built.length).toBe(2);
  });

  it('ensures question IDs are completely unique in built quiz', () => {
    const config: QuizConfig = {
      title: 'All Questions',
      mode: 'exam',
      selectedWeekNumbers: [1, 2],
      shuffleQuestions: true,
      shuffleOptions: false
    };

    const built = buildQuizQuestions(mockBank, config);
    const ids = built.map((q) => q.question.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('shuffleArray preserves all elements', () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = shuffleArray(original);
    expect(shuffled.length).toBe(original.length);
    expect(shuffled.sort((a, b) => a - b)).toEqual(original);
  });
});
