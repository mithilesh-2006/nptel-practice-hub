import { describe, it, expect } from 'vitest';
import { isAnswerCorrect, evaluateQuestion, calculateQuizSummary } from '../scoring';
import { Question } from '../../types/question';

describe('Scoring Logic', () => {
  it('correctly grades single-choice questions with whitespace trimming', () => {
    expect(isAnswerCorrect('single-choice', 'Option A', 'Option A')).toBe(true);
    expect(isAnswerCorrect('single-choice', ' Option A ', 'Option A')).toBe(true);
    expect(isAnswerCorrect('single-choice', 'Option B', 'Option A')).toBe(false);
    expect(isAnswerCorrect('single-choice', null, 'Option A')).toBe(false);
  });

  it('correctly grades multiple-select questions ignoring selection order', () => {
    const accepted = ['A', 'B', 'C'];
    // Order independent
    expect(isAnswerCorrect('multiple-select', ['A', 'B', 'C'], accepted)).toBe(true);
    expect(isAnswerCorrect('multiple-select', ['C', 'A', 'B'], accepted)).toBe(true);
    expect(isAnswerCorrect('multiple-select', ['B', 'C', 'A'], accepted)).toBe(true);

    // Partial answer must fail
    expect(isAnswerCorrect('multiple-select', ['A', 'B'], accepted)).toBe(false);

    // Extra incorrect option must fail
    expect(isAnswerCorrect('multiple-select', ['A', 'B', 'C', 'D'], accepted)).toBe(false);

    // Empty or null must fail
    expect(isAnswerCorrect('multiple-select', [], accepted)).toBe(false);
    expect(isAnswerCorrect('multiple-select', null, accepted)).toBe(false);
  });

  it('correctly grades true-false questions', () => {
    expect(isAnswerCorrect('true-false', 'True', 'True')).toBe(true);
    expect(isAnswerCorrect('true-false', 'False', 'True')).toBe(false);
    expect(isAnswerCorrect('true-false', 'False', 'False')).toBe(true);
  });

  it('correctly grades numeric questions with tolerance', () => {
    expect(isAnswerCorrect('numeric', '38', '38')).toBe(true);
    expect(isAnswerCorrect('numeric', '38.0', '38')).toBe(true);
    expect(isAnswerCorrect('numeric', ' 38 ', '38')).toBe(true);
    expect(isAnswerCorrect('numeric', '38.0001', '38')).toBe(true);
    expect(isAnswerCorrect('numeric', '40', '38')).toBe(false);
    expect(isAnswerCorrect('numeric', '', '38')).toBe(false);
    expect(isAnswerCorrect('numeric', null, '38')).toBe(false);
  });

  it('evaluates individual questions and assigns original point value', () => {
    const q1: Question = {
      id: 'w1-q1',
      questionNumber: 1,
      question: 'Test question 1',
      points: 2,
      options: ['A', 'B'],
      questionType: 'single-choice',
      userAnswer: null,
      acceptedAnswer: 'A'
    };

    const resCorrect = evaluateQuestion(q1, 'A');
    expect(resCorrect.isCorrect).toBe(true);
    expect(resCorrect.earnedPoints).toBe(2);

    const resWrong = evaluateQuestion(q1, 'B');
    expect(resWrong.isCorrect).toBe(false);
    expect(resWrong.earnedPoints).toBe(0);

    const resUnanswered = evaluateQuestion(q1, null);
    expect(resUnanswered.isCorrect).toBe(false);
    expect(resUnanswered.earnedPoints).toBe(0);
    expect(resUnanswered.userAnswer).toBeNull();
  });

  it('calculates score summary correctly without dividing by zero', () => {
    // Empty list
    const emptySummary = calculateQuizSummary([]);
    expect(emptySummary.totalQuestions).toBe(0);
    expect(emptySummary.percentage).toBe(0);
    expect(emptySummary.earnedPoints).toBe(0);

    const q1: Question = {
      id: 'w1-q1',
      questionNumber: 1,
      question: 'Q1',
      points: 1,
      options: ['A', 'B'],
      questionType: 'single-choice',
      userAnswer: null,
      acceptedAnswer: 'A'
    };
    const q2: Question = {
      id: 'w1-q2',
      questionNumber: 2,
      question: 'Q2',
      points: 3,
      options: ['X', 'Y'],
      questionType: 'single-choice',
      userAnswer: null,
      acceptedAnswer: 'Y'
    };

    const r1 = evaluateQuestion(q1, 'A'); // +1 pt
    const r2 = evaluateQuestion(q2, 'X'); // 0 pts out of 3

    const summary = calculateQuizSummary([r1, r2]);
    expect(summary.totalQuestions).toBe(2);
    expect(summary.totalPoints).toBe(4);
    expect(summary.earnedPoints).toBe(1);
    expect(summary.correctCount).toBe(1);
    expect(summary.incorrectCount).toBe(1);
    expect(summary.percentage).toBe(25);
  });
});
