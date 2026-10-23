import React from 'react';
import { Link } from 'react-router-dom';
import { Week } from '../types/question';
import { CheckCircle2, Play, Trophy, Sparkles, BookOpen } from 'lucide-react';

interface WeekCardProps {
  week: Week;
  attemptCount: number;
  bestScore?: number;
}

export const WeekCard: React.FC<WeekCardProps> = ({ week, attemptCount, bestScore }) => {
  const hasQuestions = week.questions && week.questions.length > 0;
  const totalPoints = week.questions.reduce((sum, q) => sum + (q.points || 1), 0);
  const isMastered = bestScore !== undefined && bestScore >= 80;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between group">
      <div>
        {/* Header: Week Pill & Best Score */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Week {week.weekNumber}
          </span>

          {bestScore !== undefined ? (
            <div
              className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isMastered
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              }`}
            >
              <Trophy className="w-3 h-3" />
              <span>Best: {bestScore}%</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Not attempted
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
          {week.title}
        </h3>

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400 mb-4">
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>{hasQuestions ? `${week.questions.length} Questions` : '0 Questions'}</span>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            <span>{totalPoints} Pts</span>
          </div>

          {attemptCount > 0 && (
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{attemptCount} {attemptCount === 1 ? 'Attempt' : 'Attempts'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {hasQuestions ? (
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/quiz?week=${week.weekNumber}&mode=practice`}
              className="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
              title="Practice Mode: Instant feedback after answering"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Practice</span>
            </Link>

            <Link
              to={`/quiz?week=${week.weekNumber}&mode=exam`}
              className="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
              title="Exam Mode: Timed, feedback after submission"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Exam</span>
            </Link>
          </div>
        ) : (
          <div className="text-center py-2 text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
            No questions imported yet
          </div>
        )}
      </div>
    </div>
  );
};
