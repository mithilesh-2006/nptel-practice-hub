import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuestionBank } from '../hooks/useQuestionBank';
import { useProgress } from '../hooks/useProgress';
import { QUESTION_TYPES } from '../data/questionTypes';
import {
  Bookmark,
  Play,
  Trash2,
  HelpCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export const Bookmarks: React.FC = () => {
  const { allQuestions, getQuestionById } = useQuestionBank();
  const { bookmarkedQuestionIds, toggleBookmark } = useProgress();
  const navigate = useNavigate();

  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const bookmarkedQuestions = bookmarkedQuestionIds
    .map((id) => getQuestionById(id)?.question)
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  const handleStartPractice = () => {
    if (bookmarkedQuestionIds.length === 0) return;
    const params = new URLSearchParams();
    params.set('mode', 'practice');
    params.set('ids', bookmarkedQuestionIds.join(','));
    params.set('title', `Bookmarks Practice (${bookmarkedQuestionIds.length} Questions)`);
    navigate(`/quiz?${params.toString()}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Saved Bookmarks
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300">
              {bookmarkedQuestionIds.length} Saved
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review questions you flagged for later study or take a custom practice quiz on them.
          </p>
        </div>

        {bookmarkedQuestionIds.length > 0 && (
          <button
            type="button"
            onClick={handleStartPractice}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Practice All Saved Questions</span>
          </button>
        )}
      </div>

      {bookmarkedQuestions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Bookmarked Questions Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            While taking quizzes or browsing the revision page, click the bookmark icon on any question to save it here for targeted revision.
          </p>
          <Link
            to="/revision"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
          >
            <span>Explore Question Bank</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarkedQuestions.map((q) => {
            const isRevealed = revealedIds.has(q.id);
            const typeMeta = QUESTION_TYPES[q.questionType] || QUESTION_TYPES['single-choice'];
            const weekMatch = q.id.match(/^w(\d+)-/);
            const weekNumber = weekMatch ? weekMatch[1] : '?';

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Week {weekNumber} &bull; Q{q.questionNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${typeMeta.badgeColor}`}>
                      {typeMeta.label}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {q.points} {q.points === 1 ? 'pt' : 'pts'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => toggleReveal(q.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isRevealed ? 'Hide Answer' : 'Show Answer'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(q.id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Remove from bookmarks"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                  {q.question}
                </p>

                {/* Options List */}
                {q.options.length > 0 && (
                  <div className="space-y-1.5 pl-2">
                    {q.options.map((opt, i) => {
                      const isTarget = Array.isArray(q.acceptedAnswer)
                        ? q.acceptedAnswer.includes(opt)
                        : q.acceptedAnswer === opt;

                      return (
                        <div
                          key={i}
                          className={`text-xs sm:text-sm py-1.5 px-3 rounded-xl border transition ${
                            isRevealed && isTarget
                              ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold'
                              : 'border-slate-100 dark:border-slate-800/70 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="font-mono text-slate-400 mr-2">
                            {String.fromCharCode(65 + i)}.
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Answer drawer */}
                {isRevealed && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">Accepted Answer: </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {Array.isArray(q.acceptedAnswer) ? q.acceptedAnswer.join(', ') : q.acceptedAnswer}
                        </span>
                      </div>
                    </div>

                    {q.explanation && (
                      <div className="flex items-start space-x-2 pl-6 text-slate-600 dark:text-slate-400">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">Explanation: </span>
                          {q.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
