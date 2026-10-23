import React from 'react';
import { ActiveQuestionState, QuizMode } from '../types/question';
import { isAnswerCorrect } from '../utils/scoring';
import { Flag, Check, HelpCircle } from 'lucide-react';

interface QuestionNavigatorProps {
  questions: ActiveQuestionState[];
  currentIndex: number;
  mode: QuizMode;
  onSelectIndex: (index: number) => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIndex,
  mode,
  onSelectIndex
}) => {
  const isPractice = mode === 'practice';

  const answeredCount = questions.filter(
    (q) =>
      q.userAnswer !== null &&
      (!Array.isArray(q.userAnswer) || q.userAnswer.length > 0) &&
      (typeof q.userAnswer !== 'string' || q.userAnswer.trim() !== '')
  ).length;

  const flaggedCount = questions.filter((q) => q.isMarkedForReview).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Question Matrix
        </h4>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {answeredCount}/{questions.length} Answered
        </span>
      </div>

      {/* Grid of question buttons */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
        {questions.map((qState, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered =
            qState.userAnswer !== null &&
            (!Array.isArray(qState.userAnswer) || qState.userAnswer.length > 0) &&
            (typeof qState.userAnswer !== 'string' || qState.userAnswer.trim() !== '');

          let isCorrect = false;
          if (isPractice && isAnswered) {
            isCorrect = isAnswerCorrect(
              qState.question.questionType,
              qState.userAnswer,
              qState.question.acceptedAnswer
            );
          }

          let btnClass =
            'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700';

          if (isPractice && isAnswered) {
            btnClass = isCorrect
              ? 'bg-emerald-500 text-white border-emerald-600 font-bold'
              : 'bg-rose-500 text-white border-rose-600 font-bold';
          } else if (isAnswered) {
            btnClass = 'bg-indigo-600 text-white border-indigo-700 font-bold shadow-sm';
          }

          if (isCurrent) {
            btnClass += ' ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-105 z-10';
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`relative h-10 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${btnClass}`}
              title={`Question ${idx + 1}`}
            >
              <span>{idx + 1}</span>

              {/* Review flag badge */}
              {qState.isMarkedForReview && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Flag className="w-2 h-2 fill-current" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] grid grid-cols-2 gap-2 text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-indigo-600" />
          <span>Answered</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span>Flagged ({flaggedCount})</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded border-2 border-indigo-500" />
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};
