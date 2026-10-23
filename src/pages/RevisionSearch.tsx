import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuestionBank } from '../hooks/useQuestionBank';
import { useProgress } from '../hooks/useProgress';
import { Question, QuestionType } from '../types/question';
import { QUESTION_TYPES } from '../data/questionTypes';
import {
  Search,
  Filter,
  Play,
  Bookmark,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  Layers
} from 'lucide-react';

export const RevisionSearch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter'); // e.g. 'incorrect' or 'bookmarked'
  const navigate = useNavigate();

  const { bank, allQuestions } = useQuestionBank();
  const { isBookmarked, toggleBookmark, incorrectQuestionIds, bookmarkedQuestionIds } = useProgress();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>('all');
  const [specialFilter, setSpecialFilter] = useState<'all' | 'incorrect' | 'bookmarked'>(
    initialFilter === 'incorrect' ? 'incorrect' : initialFilter === 'bookmarked' ? 'bookmarked' : 'all'
  );

  // Expanded answer reveals
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      // Keyword search in question and options
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesQ = q.question.toLowerCase().includes(query);
        const matchesOpts = q.options.some((opt) => opt.toLowerCase().includes(query));
        const matchesContext = q.context?.toLowerCase().includes(query) || false;
        if (!matchesQ && !matchesOpts && !matchesContext) return false;
      }

      // Week filter
      if (selectedWeek !== 'all') {
        const weekPrefix = `w${selectedWeek}-`;
        if (!q.id.startsWith(weekPrefix)) return false;
      }

      // Question type filter
      if (selectedType !== 'all' && q.questionType !== selectedType) {
        return false;
      }

      // Special filter
      if (specialFilter === 'incorrect' && !incorrectQuestionIds.includes(q.id)) {
        return false;
      }
      if (specialFilter === 'bookmarked' && !bookmarkedQuestionIds.includes(q.id)) {
        return false;
      }

      return true;
    });
  }, [
    allQuestions,
    searchTerm,
    selectedWeek,
    selectedType,
    specialFilter,
    incorrectQuestionIds,
    bookmarkedQuestionIds
  ]);

  const handleStartPractice = () => {
    if (filteredQuestions.length === 0) return;
    const ids = filteredQuestions.map((q) => q.id);
    const params = new URLSearchParams();
    params.set('mode', 'practice');
    params.set('ids', ids.join(','));
    params.set('title', `Revision Quiz (${filteredQuestions.length} Questions)`);
    navigate(`/quiz?${params.toString()}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Search &amp; Revise Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Explore all {allQuestions.length} assignment questions, filter by topics or mistakes, and launch targeted practice sessions.
          </p>
        </div>

        {filteredQuestions.length > 0 && (
          <button
            type="button"
            onClick={handleStartPractice}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Practice These {filteredQuestions.length} Questions</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions by keyword, formula, concept (e.g. 'einsum', 'BLEU', 'BERT', 'softmax')..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          {/* Special filter tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl font-semibold">
            <button
              type="button"
              onClick={() => setSpecialFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                specialFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              All Questions ({allQuestions.length})
            </button>
            <button
              type="button"
              onClick={() => setSpecialFilter('incorrect')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                specialFilter === 'incorrect'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Incorrect ({incorrectQuestionIds.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSpecialFilter('bookmarked')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                specialFilter === 'bookmarked'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarked ({bookmarkedQuestionIds.length})</span>
            </button>
          </div>

          {/* Week Dropdown */}
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="all">All Weeks (1–12)</option>
            {bank?.weeks.map((w) => (
              <option key={w.weekNumber} value={w.weekNumber}>
                Week {w.weekNumber}: {w.title.substring(0, 30)}...
              </option>
            ))}
          </select>

          {/* Type Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as QuestionType | 'all')}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="all">All Question Types</option>
            <option value="single-choice">Single Choice</option>
            <option value="multiple-select">Multiple Select</option>
            <option value="true-false">True / False</option>
            <option value="numeric">Numeric Answer</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing {filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'}
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No questions found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search terms or clearing your active filters.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isRevealed = revealedIds.has(q.id);
            const bookmarked = isBookmarked(q.id);
            const typeMeta = QUESTION_TYPES[q.questionType] || QUESTION_TYPES['single-choice'];

            // Week extraction
            const weekMatch = q.id.match(/^w(\d+)-/);
            const weekNumber = weekMatch ? weekMatch[1] : '?';

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs"
              >
                {/* Question Header */}
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
                      className={`p-2 rounded-xl transition ${
                        bookmarked
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 dark:border-rose-900'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={bookmarked ? 'Remove bookmark' : 'Bookmark question'}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Context passage if present */}
                {q.context && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-mono whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                    {q.context}
                  </div>
                )}

                {/* Question Text */}
                <p className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                  {q.question}
                </p>

                {/* Options List */}
                {q.options.length > 0 && (
                  <div className="space-y-1.5 pl-2">
                    {q.options.map((opt, i) => {
                      const isCorrectOpt = Array.isArray(q.acceptedAnswer)
                        ? q.acceptedAnswer.includes(opt)
                        : q.acceptedAnswer === opt;

                      return (
                        <div
                          key={i}
                          className={`text-xs sm:text-sm py-1.5 px-3 rounded-xl border transition ${
                            isRevealed && isCorrectOpt
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

                {/* Answer reveal drawer */}
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
          })
        )}
      </div>
    </div>
  );
};
