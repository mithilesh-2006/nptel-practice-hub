import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Grid } from 'lucide-react';

interface QuizControlsProps {
  currentIndex: number;
  totalQuestions: number;
  hasAnswer: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClearAnswer: () => void;
  onSubmit: () => void;
  onToggleMatrix?: () => void;
}

export const QuizControls: React.FC<QuizControlsProps> = ({
  currentIndex,
  totalQuestions,
  hasAnswer,
  onPrev,
  onNext,
  onClearAnswer,
  onSubmit,
  onToggleMatrix
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
      {/* Left: Previous and Clear */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {hasAnswer && (
          <button
            type="button"
            onClick={onClearAnswer}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            title="Clear selected answer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Answer</span>
          </button>
        )}
      </div>

      {/* Middle: Question Matrix Mobile Toggle */}
      {onToggleMatrix && (
        <button
          type="button"
          onClick={onToggleMatrix}
          className="lg:hidden flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Questions</span>
        </button>
      )}

      {/* Right: Next or Submit */}
      <div className="flex items-center space-x-2">
        {!isLast ? (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : null}

        <button
          type="button"
          onClick={onSubmit}
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Submit Quiz</span>
        </button>
      </div>
    </div>
  );
};
