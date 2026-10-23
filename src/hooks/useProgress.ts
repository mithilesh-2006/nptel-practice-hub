import { useState, useEffect, useCallback } from 'react';
import { QuizAttempt } from '../types/question';
import {
  loadState,
  saveQuizAttempt,
  toggleBookmarkId,
  savePreferences,
  clearAllProgress,
  StoredAppState,
  UserPreferences
} from '../utils/storage';

export function useProgress() {
  const [state, setState] = useState<StoredAppState>(loadState());

  const refreshState = useCallback(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('nptel_practice')) {
        refreshState();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshState]);

  const addAttempt = useCallback((attempt: QuizAttempt) => {
    const updated = saveQuizAttempt(attempt);
    setState(updated);
  }, []);

  const toggleBookmark = useCallback((questionId: string) => {
    toggleBookmarkId(questionId);
    setState(loadState());
  }, []);

  const isBookmarked = useCallback(
    (questionId: string) => {
      return state.bookmarkedQuestionIds.includes(questionId);
    },
    [state.bookmarkedQuestionIds]
  );

  const isIncorrect = useCallback(
    (questionId: string) => {
      return state.incorrectQuestionIds.includes(questionId);
    },
    [state.incorrectQuestionIds]
  );

  const updatePreferences = useCallback((prefs: Partial<UserPreferences>) => {
    savePreferences(prefs);
    setState(loadState());
  }, []);

  const resetAllProgress = useCallback(() => {
    clearAllProgress();
    setState(loadState());
  }, []);

  // Aggregate metrics
  const totalAttempts = state.attempts.length;

  const totalPointsEarned = state.attempts.reduce((sum, a) => sum + a.earnedPoints, 0);
  const totalPointsPossible = state.attempts.reduce((sum, a) => sum + a.totalPoints, 0);
  const overallAccuracy =
    totalPointsPossible > 0
      ? Math.round((totalPointsEarned / totalPointsPossible) * 1000) / 10
      : 0;

  const totalCorrectQuestions = state.attempts.reduce((sum, a) => sum + a.correctCount, 0);
  const totalIncorrectQuestions = state.attempts.reduce((sum, a) => sum + a.incorrectCount, 0);

  // Best score per week
  const bestScorePerWeek: Record<number, number> = {};
  const attemptsPerWeek: Record<number, number> = {};

  state.attempts.forEach((att) => {
    if (att.weekNumbers.length === 1) {
      const w = att.weekNumbers[0];
      attemptsPerWeek[w] = (attemptsPerWeek[w] || 0) + 1;
      if (bestScorePerWeek[w] === undefined || att.percentage > bestScorePerWeek[w]) {
        bestScorePerWeek[w] = att.percentage;
      }
    }
  });

  return {
    state,
    attempts: state.attempts,
    bookmarkedQuestionIds: state.bookmarkedQuestionIds,
    incorrectQuestionIds: state.incorrectQuestionIds,
    preferences: state.preferences,
    totalAttempts,
    overallAccuracy,
    totalPointsEarned,
    totalPointsPossible,
    totalCorrectQuestions,
    totalIncorrectQuestions,
    bestScorePerWeek,
    attemptsPerWeek,
    addAttempt,
    toggleBookmark,
    isBookmarked,
    isIncorrect,
    updatePreferences,
    resetAllProgress,
    refreshState
  };
}
