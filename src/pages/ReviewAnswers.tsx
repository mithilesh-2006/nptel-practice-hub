import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { ResultsSummary } from '../components/ResultsSummary';
import { ChevronLeft, AlertCircle } from 'lucide-react';

export const ReviewAnswers: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { attempts } = useProgress();
  const navigate = useNavigate();

  const attempt = attempts.find((a) => a.id === attemptId);

  if (!attempt) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="p-3 bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 rounded-2xl w-fit mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Quiz Attempt Not Found
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This attempt may have been cleared or does not exist in local storage.
        </p>
        <Link
          to="/statistics"
          className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          Return to Statistics
        </Link>
      </div>
    );
  }

  const handleRetrySameQuiz = () => {
    const params = new URLSearchParams();
    params.set('mode', attempt.mode);
    params.set('weeks', attempt.weekNumbers.join(','));
    params.set('title', attempt.title);
    navigate(`/quiz?${params.toString()}`);
  };

  const handleRetryIncorrectOnly = (incorrectIds: string[]) => {
    const params = new URLSearchParams();
    params.set('mode', 'practice');
    params.set('ids', incorrectIds.join(','));
    params.set('title', `Retrying ${incorrectIds.length} Incorrect Questions`);
    navigate(`/quiz?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <Link
        to="/statistics"
        className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Statistics</span>
      </Link>

      <ResultsSummary
        attempt={attempt}
        onRetrySameQuiz={handleRetrySameQuiz}
        onRetryIncorrectOnly={handleRetryIncorrectOnly}
      />
    </div>
  );
};
