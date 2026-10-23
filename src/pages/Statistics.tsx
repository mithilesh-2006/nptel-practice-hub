import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { useQuestionBank } from '../hooks/useQuestionBank';
import { QUESTION_TYPES } from '../data/questionTypes';
import { ConfirmModal } from '../components/ConfirmModal';
import { useToast } from '../components/Toast';
import {
  BarChart3,
  Award,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  ExternalLink,
  RotateCcw,
  BookOpen
} from 'lucide-react';

export const Statistics: React.FC = () => {
  const { bank } = useQuestionBank();
  const {
    attempts,
    totalAttempts,
    overallAccuracy,
    totalPointsEarned,
    totalPointsPossible,
    totalCorrectQuestions,
    totalIncorrectQuestions,
    bestScorePerWeek,
    attemptsPerWeek,
    resetAllProgress
  } = useProgress();

  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showResetModal, setShowResetModal] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const handleConfirmReset = () => {
    resetAllProgress();
    setShowResetModal(false);
    showToast('All progress and test history cleared.', 'info');
  };

  // Question type performance across all attempts
  const typeStats: Record<string, { total: number; correct: number }> = {
    'single-choice': { total: 0, correct: 0 },
    'multiple-select': { total: 0, correct: 0 },
    'true-false': { total: 0, correct: 0 },
    'numeric': { total: 0, correct: 0 }
  };

  attempts.forEach((att) => {
    att.results.forEach((r) => {
      if (typeStats[r.questionType]) {
        typeStats[r.questionType].total++;
        if (r.isCorrect) typeStats[r.questionType].correct++;
      }
    });
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Performance Statistics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Comprehensive breakdown of your quiz history, weekly mastery, and question type accuracy.
          </p>
        </div>

        {attempts.length > 0 && (
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset History</span>
          </button>
        )}
      </div>

      {/* Aggregate Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalAttempts}
            </div>
            <div className="text-xs text-slate-500 font-medium">Total Quizzes Taken</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalAttempts > 0 ? `${overallAccuracy}%` : '0%'}
            </div>
            <div className="text-xs text-slate-500 font-medium">Overall Accuracy</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalCorrectQuestions}
            </div>
            <div className="text-xs text-slate-500 font-medium">Total Questions Solved</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalPointsEarned} / {totalPointsPossible}
            </div>
            <div className="text-xs text-slate-500 font-medium">Points Earned</div>
          </div>
        </div>
      </div>

      {/* Accuracy by Question Type */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Accuracy by Question Type
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(typeStats).map(([tKey, stat]) => {
            const meta = QUESTION_TYPES[tKey as keyof typeof QUESTION_TYPES];
            const acc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;

            return (
              <div key={tKey} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {meta?.label || tKey}
                  </span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {acc}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${acc}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  {stat.correct} of {stat.total} correct
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Progress Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Weekly Mastery Progress (Weeks 1–12)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Week</th>
                <th className="px-4 py-3">Topic Title</th>
                <th className="px-4 py-3">Questions</th>
                <th className="px-4 py-3">Attempts</th>
                <th className="px-4 py-3">Best Score</th>
                <th className="px-4 py-3 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(bank?.weeks || []).map((w) => {
                const best = bestScorePerWeek[w.weekNumber];
                const count = attemptsPerWeek[w.weekNumber] || 0;

                return (
                  <tr key={w.weekNumber} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                      Week {w.weekNumber}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {w.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {w.questions.length} Qs
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {count}
                    </td>
                    <td className="px-4 py-3">
                      {best !== undefined ? (
                        <span
                          className={`font-bold ${
                            best >= 80
                              ? 'text-emerald-600'
                              : best >= 50
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {best}%
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not taken</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/quiz?week=${w.weekNumber}&mode=practice`}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center space-x-1"
                      >
                        <span>Practice</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Attempts Log */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Complete Quiz Attempts History ({attempts.length})
        </h3>

        {attempts.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No quiz attempts recorded yet. Take your first quiz from the Dashboard!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Quiz Title</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Correct / Total</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 rounded-r-xl">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {att.title}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          att.mode === 'practice'
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {att.mode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold ${
                          att.percentage >= 75
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : att.percentage >= 50
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {att.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {att.correctCount} / {att.totalQuestions} ({att.earnedPoints}/{att.totalPoints} pts)
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDuration(att.timeSpentSeconds)}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(att.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/review/${att.id}`}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        title="Reset All History?"
        message="This will permanently delete all recorded quiz attempts and clear your weekly mastery statistics. Bookmarked questions and preferences will also be reset."
        confirmLabel="Reset Everything"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
};
