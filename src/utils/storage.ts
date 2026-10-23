import { QuizAttempt } from '../types/question';

export const STORAGE_VERSION = 1;
const STORAGE_KEY = 'nptel_practice_v' + STORAGE_VERSION;
const ACTIVE_QUIZ_KEY = 'nptel_practice_active_quiz';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  autoAdvanceOnAnswer?: boolean;
  defaultTimerMinutes?: number;
  soundEnabled?: boolean;
}

export interface StoredAppState {
  version: number;
  attempts: QuizAttempt[];
  bookmarkedQuestionIds: string[];
  incorrectQuestionIds: string[];
  preferences: UserPreferences;
  lastUpdated: number;
}

const DEFAULT_STATE: StoredAppState = {
  version: STORAGE_VERSION,
  attempts: [],
  bookmarkedQuestionIds: [],
  incorrectQuestionIds: [],
  preferences: {
    theme: 'system',
    autoAdvanceOnAnswer: false,
    defaultTimerMinutes: 30,
    soundEnabled: false
  },
  lastUpdated: Date.now()
};

/**
 * Safely loads state from localStorage with corruption recovery.
 */
export function loadState(): StoredAppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_STATE;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return DEFAULT_STATE;
    }

    return {
      version: STORAGE_VERSION,
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
      bookmarkedQuestionIds: Array.isArray(parsed.bookmarkedQuestionIds) ? parsed.bookmarkedQuestionIds : [],
      incorrectQuestionIds: Array.isArray(parsed.incorrectQuestionIds) ? parsed.incorrectQuestionIds : [],
      preferences: {
        ...DEFAULT_STATE.preferences,
        ...(parsed.preferences || {})
      },
      lastUpdated: parsed.lastUpdated || Date.now()
    };
  } catch (err) {
    console.error('Failed to read from localStorage, using defaults:', err);
    return DEFAULT_STATE;
  }
}

/**
 * Safely saves state to localStorage.
 */
export function saveState(state: StoredAppState): boolean {
  try {
    const updated = {
      ...state,
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
    return false;
  }
}

/**
 * Appends a completed quiz attempt and updates incorrect question tracking.
 */
export function saveQuizAttempt(attempt: QuizAttempt): StoredAppState {
  const current = loadState();

  // Extract newly incorrect question IDs
  const newlyIncorrect = attempt.results
    .filter(r => !r.isCorrect)
    .map(r => r.questionId);

  // Extract newly correct question IDs to remove from incorrect pool if redeemed
  const newlyCorrect = new Set(
    attempt.results.filter(r => r.isCorrect).map(r => r.questionId)
  );

  const updatedIncorrectIds = new Set(current.incorrectQuestionIds);
  newlyIncorrect.forEach(id => updatedIncorrectIds.add(id));
  newlyCorrect.forEach(id => updatedIncorrectIds.delete(id));

  const updatedState: StoredAppState = {
    ...current,
    attempts: [attempt, ...current.attempts].slice(0, 100), // keep latest 100 attempts
    incorrectQuestionIds: Array.from(updatedIncorrectIds)
  };

  saveState(updatedState);
  clearActiveQuizState();
  return updatedState;
}

/**
 * Toggles bookmark status for a question ID.
 */
export function toggleBookmarkId(questionId: string): boolean {
  const current = loadState();
  const set = new Set(current.bookmarkedQuestionIds);
  let isBookmarked = false;

  if (set.has(questionId)) {
    set.delete(questionId);
    isBookmarked = false;
  } else {
    set.add(questionId);
    isBookmarked = true;
  }

  saveState({
    ...current,
    bookmarkedQuestionIds: Array.from(set)
  });

  return isBookmarked;
}

/**
 * Updates user preferences in storage.
 */
export function savePreferences(preferences: Partial<UserPreferences>): UserPreferences {
  const current = loadState();
  const updatedPrefs: UserPreferences = {
    ...current.preferences,
    ...preferences
  };
  saveState({
    ...current,
    preferences: updatedPrefs
  });
  return updatedPrefs;
}

/**
 * Completely clears all stored quiz data and progress.
 */
export function clearAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_QUIZ_KEY);
  } catch (err) {
    console.error('Error clearing localStorage:', err);
  }
}

/**
 * Save active quiz state for session recovery across accidental refresh.
 */
export function saveActiveQuizState(activeState: unknown): void {
  try {
    sessionStorage.setItem(ACTIVE_QUIZ_KEY, JSON.stringify(activeState));
  } catch (err) {
    // sessionStorage failure is non-fatal
  }
}

export function loadActiveQuizState<T>(): T | null {
  try {
    const raw = sessionStorage.getItem(ACTIVE_QUIZ_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearActiveQuizState(): void {
  try {
    sessionStorage.removeItem(ACTIVE_QUIZ_KEY);
  } catch {
    // Ignore
  }
}
