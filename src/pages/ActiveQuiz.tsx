import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuestionBank } from '../hooks/useQuestionBank';
import { useProgress } from '../hooks/useProgress';
import { useTimer } from '../hooks/useTimer';
import { ActiveQuestionState, QuizConfig, QuizMode, QuestionType, QuizAttempt } from '../types/question';
import { buildQuizQuestions } from '../utils/quizEngine';
import { evaluateQuestion, calculateQuizSummary } from '../utils/scoring';
import { QuestionCard } from '../components/QuestionCard';
import { QuestionNavigator } from '../components/QuestionNavigator';
import { QuizControls } from '../components/QuizControls';
import { Timer } from '../components/Timer';
import { ProgressBar } from '../components/ProgressBar';
import { ConfirmModal } from '../components/ConfirmModal';
import { ResultsSummary } from '../components/ResultsSummary';
import { useToast } from '../components/Toast';
import {
  saveActiveQuizState,
  loadActiveQuizState,
  clearActiveQuizState
} from '../utils/storage';
import { AlertCircle, ChevronLeft } from 'lucide-react';

export const ActiveQuiz: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { bank, loading: bankLoading } = useQuestionBank();
  const { addAttempt, isBookmarked, toggleBookmark } = useProgress();
  const { showToast } = useToast();

  // Parse query parameters
  const mode: QuizMode = (searchParams.get('mode') as QuizMode) || 'exam';
  const weekParam = searchParams.get('week');
  const weeksParam = searchParams.get('weeks');
  const limitParam = searchParams.get('limit');
  const shuffleParam = searchParams.get('shuffle');
  const shuffleOptsParam = searchParams.get('shuffleOpts');
  const timerParam = searchParams.get('timer');
  const typesParam = searchParams.get('types');
  const idsParam = searchParams.get('ids');
  const titleParam = searchParams.get('title');

  // Derive quiz configuration
  const config: QuizConfig = useMemo(() => {
    let selectedWeeks: number[] = [];
    if (weekParam) {
      selectedWeeks = [parseInt(weekParam, 10)];
    } else if (weeksParam) {
      selectedWeeks = weeksParam.split(',').map((w) => parseInt(w.trim(), 10)).filter((n) => !isNaN(n));
    } else {
      // Default all 12 weeks
      selectedWeeks = Array.from({ length: 12 }, (_, i) => i + 1);
    }

    let questionTypes: QuestionType[] | undefined = undefined;
    if (typesParam) {
      questionTypes = typesParam.split(',') as QuestionType[];
    }

    let specificQuestionIds: string[] | undefined = undefined;
    if (idsParam) {
      specificQuestionIds = idsParam.split(',').filter(Boolean);
    }

    const questionLimit = limitParam ? parseInt(limitParam, 10) : undefined;
    const shuffleQuestions = shuffleParam !== 'false';
    const shuffleOptions = shuffleOptsParam === 'true';

    let timeLimitMinutes: number | null = null;
    if (timerParam !== null && timerParam !== undefined) {
      const parsedTimer = parseInt(timerParam, 10);
      timeLimitMinutes = parsedTimer > 0 ? parsedTimer : null;
    } else if (mode === 'exam') {
      timeLimitMinutes = 30; // Default 30 min for exams if not specified
    }

    let title = titleParam;
    if (!title) {
      if (weekParam) {
        title = `Week ${weekParam} Quiz`;
      } else if (specificQuestionIds && specificQuestionIds.length > 0) {
        title = `Targeted Revision (${specificQuestionIds.length} Questions)`;
      } else {
        title = `Mixed Quiz (Weeks ${selectedWeeks.join(', ')})`;
      }
    }

    return {
      title,
      mode,
      selectedWeekNumbers: selectedWeeks,
      questionLimit,
      questionTypes,
      shuffleQuestions,
      shuffleOptions,
      timeLimitMinutes,
      specificQuestionIds
    };
  }, [
    weekParam,
    weeksParam,
    limitParam,
    shuffleParam,
    shuffleOptsParam,
    timerParam,
    typesParam,
    idsParam,
    titleParam,
    mode
  ]);

  // Quiz active state
  const [questions, setQuestions] = useState<ActiveQuestionState[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [mobileMatrixOpen, setMobileMatrixOpen] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showAbandonModal, setShowAbandonModal] = useState<boolean>(false);
  const [completedAttempt, setCompletedAttempt] = useState<QuizAttempt | null>(null);

  // Initialize or restore quiz questions
  useEffect(() => {
    if (!bank || isInitialized) return;

    // Check for cached in-progress quiz state
    const cached = loadActiveQuizState<{
      questions: ActiveQuestionState[];
      currentIndex: number;
    }>();

    if (cached && Array.isArray(cached.questions) && cached.questions.length > 0) {
      // Validate that cached quiz matches current request
      setQuestions(cached.questions);
      setCurrentIndex(cached.currentIndex || 0);
      setIsInitialized(true);
      return;
    }

    const built = buildQuizQuestions(bank, config);
    setQuestions(built);
    setCurrentIndex(0);
    setIsInitialized(true);
  }, [bank, config, isInitialized]);

  // Sync to session storage for refresh safety
  useEffect(() => {
    if (isInitialized && questions.length > 0 && !completedAttempt) {
      saveActiveQuizState({
        questions,
        currentIndex
      });
    }
  }, [questions, currentIndex, isInitialized, completedAttempt]);

  // Confirm before leaving active exam
  useEffect(() => {
    if (completedAttempt || mode !== 'exam') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [completedAttempt, mode]);

  // Timer setup
  const durationSeconds = (config.timeLimitMinutes || 0) * 60;

  const handleTimerExpire = useCallback(() => {
    showToast('Time expired! Submitting your quiz now...', 'error');
    handleSubmitQuiz();
  }, []);

  const {
    formattedTime,
    timeSpent,
    isRunning,
    isLowTime,
    isCriticalTime,
    pause,
    resume
  } = useTimer({
    durationSeconds,
    autoStart: true,
    onExpire: handleTimerExpire
  });

  // Submission handler
  const handleSubmitQuiz = useCallback(() => {
    if (questions.length === 0) return;

    // Evaluate all questions
    const evaluatedResults = questions.map((qState) =>
      evaluateQuestion(qState.question, qState.userAnswer)
    );

    const summary = calculateQuizSummary(evaluatedResults);

    const attempt: QuizAttempt = {
      id: 'attempt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      title: config.title,
      mode: config.mode,
      weekNumbers: config.selectedWeekNumbers,
      totalQuestions: summary.totalQuestions,
      correctCount: summary.correctCount,
      incorrectCount: summary.incorrectCount,
      unansweredCount: summary.unansweredCount,
      totalPoints: summary.totalPoints,
      earnedPoints: summary.earnedPoints,
      percentage: summary.percentage,
      timeSpentSeconds: timeSpent,
      results: evaluatedResults
    };

    addAttempt(attempt);
    clearActiveQuizState();
    setCompletedAttempt(attempt);
    setShowSubmitModal(false);
  }, [questions, config, timeSpent, addAttempt]);

  // Answer change handler
  const handleAnswerChange = (newAnswer: string | string[] | null) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[currentIndex] = {
        ...copy[currentIndex],
        userAnswer: newAnswer
      };
      return copy;
    });
  };

  // Mark for review toggle
  const handleToggleMarkForReview = () => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[currentIndex] = {
        ...copy[currentIndex],
        isMarkedForReview: !copy[currentIndex].isMarkedForReview
      };
      return copy;
    });
  };

  // Clear current answer
  const handleClearAnswer = () => {
    handleAnswerChange(null);
  };

  // Retry handlers
  const handleRetrySameQuiz = () => {
    if (!bank) return;
    clearActiveQuizState();
    const rebuilt = buildQuizQuestions(bank, config);
    setQuestions(rebuilt);
    setCurrentIndex(0);
    setCompletedAttempt(null);
  };

  const handleRetryIncorrectOnly = (incorrectIds: string[]) => {
    clearActiveQuizState();
    const params = new URLSearchParams();
    params.set('mode', 'practice');
    params.set('ids', incorrectIds.join(','));
    params.set('title', `Retrying ${incorrectIds.length} Incorrect Questions`);
    navigate(`/quiz?${params.toString()}`);
    window.location.reload();
  };

  if (bankLoading || !isInitialized) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Preparing quiz questions...
        </p>
      </div>
    );
  }

  // Handle case where filters match 0 questions
  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-3 bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 rounded-2xl w-fit mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          No Questions Available
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No questions matched your selected weeks or question type criteria. Please adjust your filters.
        </p>
        <button
          onClick={() => navigate('/mixed')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
        >
          Return to Mixed Quiz Builder
        </button>
      </div>
    );
  }

  // If quiz is completed, show ResultsSummary
  if (completedAttempt) {
    return (
      <ResultsSummary
        attempt={completedAttempt}
        onRetrySameQuiz={handleRetrySameQuiz}
        onRetryIncorrectOnly={handleRetryIncorrectOnly}
      />
    );
  }

  const currentQState = questions[currentIndex];
  const answeredCount = questions.filter(
    (q) =>
      q.userAnswer !== null &&
      (!Array.isArray(q.userAnswer) || q.userAnswer.length > 0) &&
      (typeof q.userAnswer !== 'string' || q.userAnswer.trim() !== '')
  ).length;

  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="space-y-6">
      {/* Quiz Top Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowAbandonModal(true)}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Leave Quiz"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              {config.title}
            </h2>
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="capitalize font-medium text-indigo-600 dark:text-indigo-400">
                {config.mode} Mode
              </span>
              <span>&bull;</span>
              <span>
                {answeredCount} of {questions.length} Answered
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Timer & Action */}
        <div className="flex items-center space-x-3">
          <Timer
            formattedTime={formattedTime}
            isLowTime={isLowTime}
            isCriticalTime={isCriticalTime}
            isRunning={isRunning}
            onTogglePause={durationSeconds > 0 ? (isRunning ? pause : resume) : undefined}
            isCountdown={durationSeconds > 0}
          />

          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar current={answeredCount} total={questions.length} />

      {/* Main Layout: Question Card + Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Question Card & Controls */}
        <div className="lg:col-span-3 space-y-4">
          <QuestionCard
            key={currentQState.question.id}
            questionState={currentQState}
            questionIndex={currentIndex}
            totalQuestions={questions.length}
            mode={config.mode}
            isBookmarked={isBookmarked(currentQState.question.id)}
            onToggleBookmark={() => {
              toggleBookmark(currentQState.question.id);
              showToast(
                isBookmarked(currentQState.question.id)
                  ? 'Removed bookmark'
                  : 'Saved to bookmarks',
                'info'
              );
            }}
            onToggleMarkForReview={handleToggleMarkForReview}
            onAnswerChange={handleAnswerChange}
            onNext={
              currentIndex < questions.length - 1
                ? () => setCurrentIndex(currentIndex + 1)
                : undefined
            }
          />

          <QuizControls
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            hasAnswer={
              currentQState.userAnswer !== null &&
              (!Array.isArray(currentQState.userAnswer) || currentQState.userAnswer.length > 0)
            }
            onPrev={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            onNext={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
            onClearAnswer={handleClearAnswer}
            onSubmit={() => setShowSubmitModal(true)}
            onToggleMatrix={() => setMobileMatrixOpen(!mobileMatrixOpen)}
          />
        </div>

        {/* Right Column: Question Navigator */}
        <div className={`lg:block ${mobileMatrixOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-20">
            <QuestionNavigator
              questions={questions}
              currentIndex={currentIndex}
              mode={config.mode}
              onSelectIndex={(idx) => {
                setCurrentIndex(idx);
                setMobileMatrixOpen(false);
              }}
            />
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <ConfirmModal
        isOpen={showSubmitModal}
        title="Submit Quiz Now?"
        message={
          unansweredCount > 0
            ? `You have answered ${answeredCount} of ${questions.length} questions. You still have ${unansweredCount} unanswered questions. Are you sure you want to finish and submit?`
            : `You have answered all ${questions.length} questions! Ready to see your final score and detailed review?`
        }
        confirmLabel="Yes, Submit Quiz"
        cancelLabel="Continue Reviewing"
        onConfirm={handleSubmitQuiz}
        onCancel={() => setShowSubmitModal(false)}
      />

      {/* Abandon Confirmation Modal */}
      <ConfirmModal
        isOpen={showAbandonModal}
        title="Leave Active Quiz?"
        message="Are you sure you want to exit? Your answers for this quiz attempt will not be recorded in your history."
        confirmLabel="Leave Quiz"
        cancelLabel="Stay in Quiz"
        isDestructive={true}
        onConfirm={() => {
          clearActiveQuizState();
          setShowAbandonModal(false);
          navigate('/');
        }}
        onCancel={() => setShowAbandonModal(false)}
      />
    </div>
  );
};
