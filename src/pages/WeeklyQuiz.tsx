import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuestionBank } from '../hooks/useQuestionBank';
import { useProgress } from '../hooks/useProgress';
import { QuizMode } from '../types/question';
import { QUESTION_TYPES } from '../data/questionTypes';
import {
  Calendar,
  Sparkles,
  Play,
  Clock,
  Shuffle,
  Trophy,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  ChevronLeft
} from 'lucide-react';

export const WeeklyQuiz: React.FC = () => {
  const { weekId } = useParams<{ weekId: string }>();
  const weekNum = parseInt(weekId || '1', 10);
  const { getWeekByNumber, loading } = useQuestionBank();
  const { bestScorePerWeek, attemptsPerWeek } = useProgress();
  const navigate = useNavigate();

  const week = getWeekByNumber(weekNum);

  const [mode, setMode] = useState<QuizMode>('exam');
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(false);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);
  const [timerMinutes, setTimerMinutes] = useState<number | 'untimed'>(20);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading week details...</div>;
  }

  if (!week) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Week Not Found</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Week {weekNum} is not available in the question bank.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const totalPoints = week.questions.reduce((sum, q) => sum + (q.points || 1), 0);
  const bestScore = bestScorePerWeek[weekNum];
  const attemptCount = attemptsPerWeek[weekNum] || 0;

  // Breakdown of question types in this week
  const typeCounts: Record<string, number> = {};
  week.questions.forEach((q) => {
    typeCounts[q.questionType] = (typeCounts[q.questionType] || 0) + 1;
  });

  const handleStart = (selectedMode: QuizMode) => {
    const params = new URLSearchParams();
    params.set('week', String(weekNum));
    params.set('mode', selectedMode);
    params.set('shuffle', String(shuffleQuestions));
    params.set('shuffleOpts', String(shuffleOptions));
    params.set('timer', timerMinutes === 'untimed' ? '0' : String(timerMinutes));
    params.set('title', `Week ${weekNum}: ${week.title}`);
    navigate(`/quiz?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Back to Dashboard */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Weeks</span>
        </Link>
      </div>

      {/* Week Overview Hero */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Week {week.weekNumber} Assignment
          </span>

          {bestScore !== undefined && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Trophy className="w-3.5 h-3.5" />
              <span>Personal Best: {bestScore}%</span>
            </div>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {week.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-1">
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {week.questions.length} Questions
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
            <span>{totalPoints} Total Points</span>
          </div>

          {attemptCount > 0 && (
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{attemptCount} Attempts Completed</span>
            </div>
          )}
        </div>

        {/* Question Type Distribution Badges */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
          {Object.entries(typeCounts).map(([typeKey, count]) => {
            const meta = QUESTION_TYPES[typeKey as keyof typeof QUESTION_TYPES];
            return (
              <span
                key={typeKey}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta?.badgeColor}`}
              >
                {count} {meta?.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Quiz Mode Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Practice Mode Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Practice Mode
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Solve at your own pace with immediate feedback after each question. Check explanations, retry if needed, and master tricky concepts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleStart('practice')}
            className="mt-6 w-full py-3 rounded-2xl font-bold text-sm bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-300 transition flex items-center justify-center space-x-2"
          >
            <span>Start Practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Exam Mode Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Exam Mode
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Simulate actual NPTEL test conditions with a timer. Answers remain hidden until submission, followed by a complete score summary.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleStart('exam')}
            className="mt-6 w-full py-3 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition flex items-center justify-center space-x-2"
          >
            <span>Start Timed Exam</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Options & Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Quiz Options
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Timer setting */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Exam Timer:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Untimed', value: 'untimed' as const },
                { label: '15 min', value: 15 },
                { label: '20 min', value: 20 },
                { label: '30 min', value: 30 }
              ].map((t) => (
                <button
                  key={String(t.value)}
                  type="button"
                  onClick={() => setTimerMinutes(t.value)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                    timerMinutes === t.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shuffling */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">
              Randomization:
            </span>
            <div className="space-y-1.5">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="text-slate-600 dark:text-slate-400">
                  Shuffle question sequence
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="text-slate-600 dark:text-slate-400">
                  Shuffle multiple-choice options
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
