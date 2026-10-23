import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionBank } from '../hooks/useQuestionBank';
import { QuestionType, QuizMode } from '../types/question';
import { QUESTION_TYPES } from '../data/questionTypes';
import {
  Layers,
  Sparkles,
  Clock,
  Shuffle,
  Play,
  CheckSquare,
  Square,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export const MixedQuiz: React.FC = () => {
  const { bank } = useQuestionBank();
  const navigate = useNavigate();

  const totalWeeks = bank?.weeks.length || 12;

  // Configuration state
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([1, 2, 3]);
  const [mode, setMode] = useState<QuizMode>('exam');
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    'single-choice',
    'multiple-select',
    'true-false',
    'numeric'
  ]);
  const [questionCountType, setQuestionCountType] = useState<'all' | 'custom'>('custom');
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(20);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(true);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);
  const [timerOption, setTimerOption] = useState<number | 'untimed'>(30); // minutes

  // Presets
  const applyPreset = (weeks: number[]) => {
    setSelectedWeeks(weeks);
  };

  const toggleWeek = (num: number) => {
    if (selectedWeeks.includes(num)) {
      if (selectedWeeks.length > 1) {
        setSelectedWeeks(selectedWeeks.filter((w) => w !== num));
      }
    } else {
      setSelectedWeeks([...selectedWeeks, num].sort((a, b) => a - b));
    }
  };

  const selectAllWeeks = () => {
    const all = Array.from({ length: totalWeeks }, (_, i) => i + 1);
    setSelectedWeeks(all);
  };

  const toggleType = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Calculate matching questions dynamically
  const availableMatchingCount = useMemo(() => {
    if (!bank) return 0;
    const weekSet = new Set(selectedWeeks);
    const typeSet = new Set(selectedTypes);

    let count = 0;
    bank.weeks.forEach((w) => {
      if (weekSet.has(w.weekNumber)) {
        w.questions.forEach((q) => {
          if (typeSet.has(q.questionType)) {
            count++;
          }
        });
      }
    });
    return count;
  }, [bank, selectedWeeks, selectedTypes]);

  const finalQuestionCount =
    questionCountType === 'all'
      ? availableMatchingCount
      : Math.min(customQuestionCount, availableMatchingCount);

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (availableMatchingCount === 0) return;

    const params = new URLSearchParams();
    params.set('mode', mode);
    params.set('weeks', selectedWeeks.join(','));
    params.set('types', selectedTypes.join(','));
    params.set('limit', String(finalQuestionCount));
    params.set('shuffle', String(shuffleQuestions));
    params.set('shuffleOpts', String(shuffleOptions));
    if (timerOption !== 'untimed') {
      params.set('timer', String(timerOption));
    } else {
      params.set('timer', '0');
    }
    params.set('title', `Mixed Quiz (Weeks ${selectedWeeks.join(', ')})`);

    navigate(`/quiz?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          <Layers className="w-3.5 h-3.5" />
          <span>Flexible Quiz Builder</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Create Mixed-Week Quiz
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Configure a custom quiz tailored to your study schedule. Select specific weeks, filter question types, set timers, and practice with instant feedback or realistic exam constraints.
        </p>
      </div>

      <form onSubmit={handleStartQuiz} className="space-y-6">
        {/* Section 1: Week Selection & Presets */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>1. Select Weeks</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                  {selectedWeeks.length} of {totalWeeks} Selected
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Choose any combination or pick a standard semester preset.
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
              <span className="text-slate-400 text-[11px] mr-1">Presets:</span>
              <button
                type="button"
                onClick={() => applyPreset([1, 2, 3])}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                1–3
              </button>
              <button
                type="button"
                onClick={() => applyPreset([4, 5, 6])}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                4–6
              </button>
              <button
                type="button"
                onClick={() => applyPreset([1, 2, 3, 4, 5, 6])}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                1–6
              </button>
              <button
                type="button"
                onClick={() => applyPreset([7, 8, 9, 10, 11, 12])}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                7–12
              </button>
              <button
                type="button"
                onClick={selectAllWeeks}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition font-semibold"
              >
                All (1–12)
              </button>
            </div>
          </div>

          {/* Week checkboxes grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {(bank?.weeks || []).map((w) => {
              const isChecked = selectedWeeks.includes(w.weekNumber);
              return (
                <button
                  type="button"
                  key={w.weekNumber}
                  onClick={() => toggleWeek(w.weekNumber)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isChecked
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-white ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase">W{w.weekNumber}</span>
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    {w.questions.length} Questions
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Mode & Question Type Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mode Selection */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              2. Quiz Mode
            </h3>
            <div className="space-y-3">
              <label
                className={`flex items-start space-x-3.5 p-4 rounded-2xl border cursor-pointer transition ${
                  mode === 'practice'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="quizMode"
                  value="practice"
                  checked={mode === 'practice'}
                  onChange={() => setMode('practice')}
                  className="mt-1 text-indigo-600"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>Practice Mode</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Immediate feedback on each answer. Explanations and accepted answers are revealed right away with retry options.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start space-x-3.5 p-4 rounded-2xl border cursor-pointer transition ${
                  mode === 'exam'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="quizMode"
                  value="exam"
                  checked={mode === 'exam'}
                  onChange={() => setMode('exam')}
                  className="mt-1 text-indigo-600"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <Play className="w-4 h-4 text-emerald-500" />
                    <span>Exam Mode</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Formal timed assessment. Answers remain secret until you submit or time runs out. Detailed score report given at the end.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Question Type Filter */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              3. Question Types
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Filter by specific format or include all available formats:
            </p>

            <div className="space-y-2.5">
              {(['single-choice', 'multiple-select', 'true-false', 'numeric'] as QuestionType[]).map((t) => {
                const isSelected = selectedTypes.includes(t);
                const meta = QUESTION_TYPES[t];
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => toggleType(t)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-950 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <span>{meta.label}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Question Limit & Timer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question Limit */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              4. Number of Questions
            </h3>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="qCount"
                  checked={questionCountType === 'all'}
                  onChange={() => setQuestionCountType('all')}
                  className="text-indigo-600"
                />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  All Available Matching ({availableMatchingCount} questions)
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="qCount"
                  checked={questionCountType === 'custom'}
                  onChange={() => setQuestionCountType('custom')}
                  className="text-indigo-600"
                />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Select a subset count:
                </span>
              </label>

              {questionCountType === 'custom' && (
                <div className="pl-6 space-y-3">
                  <div className="flex items-center space-x-2">
                    {[10, 15, 20, 30, 50].map((presetNum) => (
                      <button
                        key={presetNum}
                        type="button"
                        onClick={() => setCustomQuestionCount(presetNum)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          customQuestionCount === presetNum
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {presetNum}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min={1}
                      max={availableMatchingCount || 1}
                      value={customQuestionCount}
                      onChange={(e) => setCustomQuestionCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold"
                    />
                    <span className="text-xs text-slate-500">
                      Max available: {availableMatchingCount}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timer & Randomization */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              5. Timer &amp; Randomization
            </h3>

            {/* Timer Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Timer Limit:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Untimed', value: 'untimed' as const },
                  { label: '15 min', value: 15 },
                  { label: '30 min', value: 30 },
                  { label: '45 min', value: 45 },
                  { label: '60 min', value: 60 },
                  { label: '90 min', value: 90 }
                ].map((t) => (
                  <button
                    key={String(t.value)}
                    type="button"
                    onClick={() => setTimerOption(t.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      timerOption === t.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Randomization toggles */}
            <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Randomize question order
                </span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Randomize answer options order
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Start Quiz Footer Card */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-lg font-bold">
              Ready to begin: {finalQuestionCount} Questions
            </div>
            <div className="text-xs text-slate-400">
              Mode: {mode === 'practice' ? 'Practice (Immediate Feedback)' : 'Exam (Timed Submission)'} &bull; Weeks: {selectedWeeks.join(', ')} &bull; Timer: {timerOption === 'untimed' ? 'Untimed' : `${timerOption} min`}
            </div>
          </div>

          <button
            type="submit"
            disabled={availableMatchingCount === 0}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Mixed Quiz</span>
          </button>
        </div>
      </form>
    </div>
  );
};
