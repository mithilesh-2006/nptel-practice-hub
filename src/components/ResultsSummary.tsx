import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QuizAttempt, QuestionResult, QuestionType } from '../types/question';
import { QUESTION_TYPES } from '../data/questionTypes';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Filter,
  AlertTriangle,
  Award,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ResultsSummaryProps {
  attempt: QuizAttempt;
  onRetrySameQuiz: () => void;
  onRetryIncorrectOnly: (incorrectIds: string[]) => void;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  attempt,
  onRetrySameQuiz,
  onRetryIncorrectOnly
}) => {
  const [filterType, setFilterType] = useState<'all' | 'incorrect' | 'correct' | 'unanswered'>('all');
  const [selectedQuestionFilter, setSelectedQuestionFilter] = useState<QuestionType | 'all'>('all');

  const {
    percentage,
    earnedPoints,
    totalPoints,
    correctCount,
    incorrectCount,
    unansweredCount,
    timeSpentSeconds,
    results
  } = attempt;

  // Trigger celebration confetti for scores 80% and above
  useEffect(() => {
    if (percentage >= 80) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti non-fatal
      }
    }
  }, [percentage]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const incorrectIds = results
    .filter((r) => !r.isCorrect)
    .map((r) => r.questionId);

  const filteredResults = results.filter((r) => {
    // Status filter
    if (filterType === 'correct' && !r.isCorrect) return false;
    if (filterType === 'incorrect' && (r.isCorrect || r.userAnswer === null)) return false;
    if (filterType === 'unanswered' && r.userAnswer !== null) return false;

    // Type filter
    if (selectedQuestionFilter !== 'all' && r.questionType !== selectedQuestionFilter) return false;

    return true;
  });

  const getScoreBadge = () => {
    if (percentage >= 90) return { label: 'Elite Mastery (90%+)', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300' };
    if (percentage >= 75) return { label: 'Proficient (75%+)', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300' };
    if (percentage >= 50) return { label: 'Passing (50%+)', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-300' };
    return { label: 'Needs Revision (<50%)', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-300' };
  };

  const badge = getScoreBadge();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Score Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-indigo-800/40">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
              <Award className="w-3.5 h-3.5" />
              <span>{badge.label}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {attempt.title} Results
            </h2>
            <p className="text-sm text-indigo-200/80 max-w-xl">
              Completed in {formatDuration(timeSpentSeconds)} &bull; Mode: {attempt.mode === 'practice' ? 'Practice' : 'Exam'}
            </p>
          </div>

          {/* Large percentage display */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shrink-0 min-w-[180px]">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              {percentage}%
            </div>
            <div className="text-xs font-semibold text-indigo-200 mt-1">
              {earnedPoints} / {totalPoints} Points
            </div>
          </div>
        </div>

        {/* 4-Stat Grid inside hero */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-indigo-800/40">
          <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>Correct</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-white">{correctCount}</div>
            <div className="text-[11px] text-indigo-200/70">Questions</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase">
              <XCircle className="w-4 h-4" />
              <span>Incorrect</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-white">{incorrectCount}</div>
            <div className="text-[11px] text-indigo-200/70">Questions</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>Unanswered</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-white">{unansweredCount}</div>
            <div className="text-[11px] text-indigo-200/70">Questions</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase">
              <Clock className="w-4 h-4" />
              <span>Time Taken</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-white">{formatDuration(timeSpentSeconds)}</div>
            <div className="text-[11px] text-indigo-200/70">Duration</div>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onRetrySameQuiz}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Same Quiz</span>
        </button>

        {incorrectIds.length > 0 && (
          <button
            type="button"
            onClick={() => onRetryIncorrectOnly(incorrectIds)}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Practice {incorrectIds.length} Incorrect Questions</span>
          </button>
        )}

        <Link
          to="/mixed"
          className="flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <Layers className="w-4 h-4 text-purple-500" />
          <span>New Mixed Quiz</span>
        </Link>

        <Link
          to="/"
          className="flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition ml-auto"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Question Breakdown and Review */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Question-by-Question Review
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredResults.length} of {results.length} questions
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterType === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All ({results.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('incorrect')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterType === 'incorrect'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Incorrect ({incorrectCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('correct')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterType === 'correct'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Correct ({correctCount})
              </button>
            </div>
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-4">
          {filteredResults.map((result, idx) => {
            const typeMeta = QUESTION_TYPES[result.questionType] || QUESTION_TYPES['single-choice'];

            return (
              <div
                key={result.questionId}
                className={`p-6 rounded-2xl border transition-all ${
                  result.isCorrect
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'bg-rose-50/20 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Week {result.weekNumber} &bull; Q{result.questionNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${typeMeta.badgeColor}`}>
                      {typeMeta.label}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {result.isCorrect ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>+{result.earnedPoints} Pts</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>0 / {result.points} Pts</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Context passage if present */}
                {result.context && (
                  <div className="p-3 mb-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs font-mono whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                    {result.context}
                  </div>
                )}

                {/* Question Text */}
                <p className="text-base font-semibold text-slate-900 dark:text-white mb-4 whitespace-pre-line">
                  {result.question}
                </p>

                {/* Answer Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {/* User Answer */}
                  <div
                    className={`p-3.5 rounded-xl border ${
                      result.isCorrect
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
                        : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                    }`}
                  >
                    <div className="font-bold uppercase tracking-wider text-[11px] mb-1 text-slate-500 dark:text-slate-400">
                      Your Answer:
                    </div>
                    {result.userAnswer === null ? (
                      <span className="text-slate-400 dark:text-slate-500 italic">Unanswered</span>
                    ) : Array.isArray(result.userAnswer) ? (
                      <ul className="list-disc pl-4 space-y-1 font-medium text-slate-800 dark:text-slate-200">
                        {result.userAnswer.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {result.userAnswer}
                      </div>
                    )}
                  </div>

                  {/* Accepted Answer */}
                  <div className="p-3.5 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60">
                    <div className="font-bold uppercase tracking-wider text-[11px] mb-1 text-emerald-700 dark:text-emerald-400">
                      Accepted Answer:
                    </div>
                    {Array.isArray(result.acceptedAnswer) ? (
                      <ul className="list-disc pl-4 space-y-1 font-semibold text-emerald-900 dark:text-emerald-200">
                        {result.acceptedAnswer.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="font-semibold text-emerald-900 dark:text-emerald-200">
                        {result.acceptedAnswer}
                      </div>
                    )}
                  </div>
                </div>

                {/* Explanation */}
                {result.explanation && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                    <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Explanation: </span>
                      {result.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
