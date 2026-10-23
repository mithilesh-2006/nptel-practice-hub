import React, { useState } from 'react';
import { ActiveQuestionState, QuizMode } from '../types/question';
import { QUESTION_TYPES } from '../data/questionTypes';
import { isAnswerCorrect } from '../utils/scoring';
import {
  Bookmark,
  Flag,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  AlertCircle,
  Info
} from 'lucide-react';

interface QuestionCardProps {
  questionState: ActiveQuestionState;
  questionIndex: number;
  totalQuestions: number;
  mode: QuizMode;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onToggleMarkForReview: () => void;
  onAnswerChange: (answer: string | string[] | null) => void;
  onNext?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionState,
  questionIndex,
  totalQuestions,
  mode,
  isBookmarked,
  onToggleBookmark,
  onToggleMarkForReview,
  onAnswerChange,
  onNext
}) => {
  const { question, displayOptions, userAnswer, isMarkedForReview } = questionState;
  const [practiceSubmitted, setPracticeSubmitted] = useState<boolean>(false);
  const [numericInput, setNumericInput] = useState<string>(
    typeof userAnswer === 'string' ? userAnswer : ''
  );

  const typeMeta = QUESTION_TYPES[question.questionType] || QUESTION_TYPES['single-choice'];
  const isPractice = mode === 'practice';

  // Evaluate immediate correctness if in practice mode and user submitted or answered
  const isCorrect = isAnswerCorrect(
    question.questionType,
    userAnswer,
    question.acceptedAnswer
  );

  const showImmediateFeedback = isPractice && (practiceSubmitted || userAnswer !== null);

  const handleSingleSelect = (option: string) => {
    onAnswerChange(option);
    if (isPractice) {
      setPracticeSubmitted(true);
    }
  };

  const handleMultiSelect = (option: string) => {
    const current = Array.isArray(userAnswer) ? [...userAnswer] : [];
    const idx = current.indexOf(option);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(option);
    }
    const finalAnswer = current.length > 0 ? current : null;
    onAnswerChange(finalAnswer);
    if (isPractice) {
      // In practice mode for multi-select, user can check answer via button
      setPracticeSubmitted(false);
    }
  };

  const handleNumericSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (numericInput.trim() !== '') {
      onAnswerChange(numericInput.trim());
      if (isPractice) setPracticeSubmitted(true);
    } else {
      onAnswerChange(null);
    }
  };

  const handleRetryQuestion = () => {
    onAnswerChange(null);
    setNumericInput('');
    setPracticeSubmitted(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
      {/* Top Banner: Question Metadata & Quick Actions */}
      <div className="px-6 py-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Question {questionIndex + 1} of {totalQuestions}
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeMeta.badgeColor}`}
          >
            {typeMeta.label}
          </span>

          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {question.points} {question.points === 1 ? 'Point' : 'Points'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mark for review toggle */}
          <button
            type="button"
            onClick={onToggleMarkForReview}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              isMarkedForReview
                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
            title="Mark this question to review before submitting"
          >
            <Flag className={`w-3.5 h-3.5 ${isMarkedForReview ? 'fill-current' : ''}`} />
            <span>{isMarkedForReview ? 'Flagged' : 'Flag for review'}</span>
          </button>

          {/* Bookmark toggle */}
          <button
            type="button"
            onClick={onToggleBookmark}
            className={`p-2 rounded-xl transition ${
              isBookmarked
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
            aria-label="Bookmark question"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Context passage if present */}
        {question.context && (
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              <Info className="w-4 h-4" />
              <span>Reference Context</span>
            </div>
            <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto">
              {question.context}
            </pre>
          </div>
        )}

        {/* Validation note if question has an issue flag */}
        {question.validationNotes && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span><strong>Note on original question:</strong> {question.validationNotes}</span>
          </div>
        )}

        {/* Question Text */}
        <div className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
          {question.question}
        </div>

        {/* Question Type Instruction */}
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {question.questionType === 'multiple-select' && (
            <span className="text-purple-600 dark:text-purple-400 font-semibold">
              * Multiple Select: Choose all matching options. Full points awarded only for an exact match.
            </span>
          )}
          {question.questionType === 'numeric' && (
            <span>Enter the numerical value or calculation output.</span>
          )}
        </div>

        {/* Single-Choice / True-False Options */}
        {(question.questionType === 'single-choice' || question.questionType === 'true-false') && (
          <div className="space-y-3">
            {displayOptions.map((opt, idx) => {
              const isSelected = userAnswer === opt;
              const isTargetAnswer = Array.isArray(question.acceptedAnswer)
                ? question.acceptedAnswer.includes(opt)
                : question.acceptedAnswer === opt;

              let optionStyle =
                'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900';

              if (showImmediateFeedback) {
                if (isTargetAnswer) {
                  optionStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-medium';
                } else if (isSelected && !isTargetAnswer) {
                  optionStyle = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100';
                } else {
                  optionStyle = 'border-slate-200 dark:border-slate-800 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-white font-medium ring-2 ring-indigo-500/20';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSingleSelect(opt)}
                  disabled={showImmediateFeedback}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start space-x-3.5 ${optionStyle}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <span className="flex-1 text-sm sm:text-base leading-relaxed break-words">
                    {opt}
                  </span>

                  {showImmediateFeedback && isTargetAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {showImmediateFeedback && isSelected && !isTargetAnswer && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Multiple-Select Options */}
        {question.questionType === 'multiple-select' && (
          <div className="space-y-3">
            {displayOptions.map((opt, idx) => {
              const selectedList = Array.isArray(userAnswer) ? userAnswer : [];
              const isSelected = selectedList.includes(opt);
              const acceptedList = Array.isArray(question.acceptedAnswer)
                ? question.acceptedAnswer
                : [question.acceptedAnswer];
              const isTarget = acceptedList.includes(opt);

              let optionStyle =
                'border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-slate-900';

              if (showImmediateFeedback && practiceSubmitted) {
                if (isTarget) {
                  optionStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-medium';
                } else if (isSelected && !isTarget) {
                  optionStyle = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100';
                } else {
                  optionStyle = 'border-slate-200 dark:border-slate-800 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 text-purple-950 dark:text-white font-medium ring-2 ring-purple-500/20';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleMultiSelect(opt)}
                  disabled={showImmediateFeedback && practiceSubmitted}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start space-x-3.5 ${optionStyle}`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition ${
                      isSelected
                        ? 'border-purple-600 bg-purple-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <span className="text-xs font-bold">&#10003;</span>}
                  </div>

                  <span className="flex-1 text-sm sm:text-base leading-relaxed break-words">
                    {opt}
                  </span>

                  {showImmediateFeedback && practiceSubmitted && isTarget && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {showImmediateFeedback && practiceSubmitted && isSelected && !isTarget && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}

            {/* Check answer button in practice mode for multiple select */}
            {isPractice && !practiceSubmitted && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setPracticeSubmitted(true)}
                  disabled={!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white shadow-md transition"
                >
                  Check Answers
                </button>
              </div>
            )}
          </div>
        )}

        {/* Numeric / Short Answer Input */}
        {(question.questionType === 'numeric' || question.questionType === 'short-answer') && (
          <form onSubmit={handleNumericSubmit} className="space-y-4 max-w-md">
            <div>
              <label
                htmlFor={`input-${question.id}`}
                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1"
              >
                Your Answer:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id={`input-${question.id}`}
                  type="text"
                  value={numericInput}
                  onChange={(e) => setNumericInput(e.target.value)}
                  disabled={showImmediateFeedback && practiceSubmitted}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-indigo-500 transition text-base font-mono"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition shrink-0"
                >
                  {isPractice ? 'Check' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Practice Mode Feedback Drawer */}
        {showImmediateFeedback && (
          <div
            className={`p-5 rounded-2xl border transition-all animate-in fade-in slide-in-from-top-2 ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">
                      Correct! +{question.points} {question.points === 1 ? 'Point' : 'Points'}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <span className="font-bold text-rose-800 dark:text-rose-300">
                      Incorrect (0 Points)
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleRetryQuestion}
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Question</span>
                </button>
                {onNext && (
                  <button
                    type="button"
                    onClick={onNext}
                    className="px-3.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
                  >
                    Next &rarr;
                  </button>
                )}
              </div>
            </div>

            {/* Accepted Answer display */}
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white">Accepted Answer: </span>
              {Array.isArray(question.acceptedAnswer) ? (
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  {question.acceptedAnswer.map((ans, i) => (
                    <li key={i} className="font-medium text-emerald-700 dark:text-emerald-300">
                      {ans}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                  {question.acceptedAnswer}
                </span>
              )}
            </div>

            {/* Explanation if present */}
            {question.explanation && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">Explanation: </span>
                  {question.explanation}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
