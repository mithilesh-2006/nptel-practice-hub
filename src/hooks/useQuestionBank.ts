import { useState, useEffect } from 'react';
import { QuestionBank, Question, Week } from '../types/question';

let cachedBank: QuestionBank | null = null;

export function useQuestionBank() {
  const [bank, setBank] = useState<QuestionBank | null>(cachedBank);
  const [loading, setLoading] = useState<boolean>(!cachedBank);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedBank) {
      setBank(cachedBank);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch('/questions.json')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to load questions.json: HTTP ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: QuestionBank) => {
        if (!isMounted) return;
        if (!data || !Array.isArray(data.weeks)) {
          throw new Error('Invalid questions.json schema: missing weeks array');
        }
        cachedBank = data;
        setBank(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (!isMounted) return;
        console.error('Error fetching question bank:', err);
        setError(err.message || 'Failed to load question bank');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const allQuestions: Question[] = bank
    ? bank.weeks.flatMap((w) => w.questions)
    : [];

  const questionMap = new Map<string, { question: Question; week: Week }>();
  if (bank) {
    bank.weeks.forEach((w) => {
      w.questions.forEach((q) => {
        questionMap.set(q.id, { question: q, week: w });
      });
    });
  }

  const getWeekByNumber = (num: number): Week | undefined => {
    return bank?.weeks.find((w) => w.weekNumber === num);
  };

  const getQuestionById = (id: string) => {
    return questionMap.get(id);
  };

  return {
    bank,
    loading,
    error,
    allQuestions,
    questionMap,
    getWeekByNumber,
    getQuestionById,
    reload: () => {
      cachedBank = null;
      setLoading(true);
      fetch('/questions.json')
        .then((res) => res.json())
        .then((data) => {
          cachedBank = data;
          setBank(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };
}
