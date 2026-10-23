import React from 'react';
import { Link } from 'react-router-dom';
import { useQuestionBank } from '../hooks/useQuestionBank';
import { useProgress } from '../hooks/useProgress';
import { WeekCard } from '../components/WeekCard';
import {
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  Play,
  RotateCcw,
  Clock,
  ArrowRight,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { bank } = useQuestionBank();
  const {
    totalAttempts,
    overallAccuracy,
    totalCorrectQuestions,
    totalIncorrectQuestions,
    bestScorePerWeek,
    attemptsPerWeek,
    attempts,
    incorrectQuestionIds
  } = useProgress();

  const totalQuestions = bank?.metadata?.totalQuestions || 0;
  const totalWeeks = bank?.weeks?.length || 12;
  const totalPoints = bank?.metadata?.totalPoints || 0;

  const recentAttempts = attempts.slice(0, 5);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-indigo-800/50">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
            <span>NPTEL Assignment Practice Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Master 12 Weeks of Assignments
          </h1>
          <p className="text-sm sm:text-base text-indigo-200/90 leading-relaxed">
            Practice questions from Natural Language Processing &amp; LLMs. Test yourself with immediate feedback or timed exam conditions, bookmark tricky concepts, and track your scores locally.
          </p>

          {/* Quick Start Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              to="/quiz?mode=practice&limit=10&shuffle=true"
              className="flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-sm bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Quick 10-Q Practice</span>
            </Link>

            <Link
              to="/mixed"
              className="flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition"
            >
              <Play className="w-4 h-4" />
              <span>Custom Mixed Quiz</span>
            </Link>

            {incorrectQuestionIds.length > 0 && (
              <Link
                to="/revision?filter=incorrect"
                className="flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm bg-rose-500/30 hover:bg-rose-500/40 text-rose-200 border border-rose-400/30 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Revise {incorrectQuestionIds.length} Incorrect</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Top Stat Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Questions Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalQuestions}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Questions in Bank ({totalPoints} Pts)
            </div>
          </div>
        </div>

        {/* Quizzes Attempted Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalAttempts}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Quizzes Attempted
            </div>
          </div>
        </div>

        {/* Overall Accuracy Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalAttempts > 0 ? `${overallAccuracy}%` : '—'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Overall Accuracy
            </div>
          </div>
        </div>

        {/* Correct Answers Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalCorrectQuestions}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Correct Answers Given
            </div>
          </div>
        </div>
      </div>

      {/* 12 Weekly Cards Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Weekly Question Sets ({totalWeeks} Weeks)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an individual week to take a focused quiz in practice or exam mode.
            </p>
          </div>
          <Link
            to="/mixed"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Need a custom combination? Open Mixed Quiz &rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(bank?.weeks || []).map((week) => (
            <WeekCard
              key={week.weekNumber}
              week={week}
              attemptCount={attemptsPerWeek[week.weekNumber] || 0}
              bestScore={bestScorePerWeek[week.weekNumber]}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity Table if any */}
      {recentAttempts.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Quiz Attempts
            </h3>
            <Link
              to="/statistics"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
            >
              <span>View all statistics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Quiz Title</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Points</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3 rounded-r-xl">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentAttempts.map((att) => (
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
                      {att.earnedPoints}/{att.totalPoints}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDuration(att.timeSpentSeconds)}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(att.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
