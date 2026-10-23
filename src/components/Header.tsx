import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Moon,
  Sun,
  BookOpen,
  Award,
  Bookmark,
  Search
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useProgress } from '../hooks/useProgress';

interface HeaderProps {
  onMenuToggle: () => void;
  totalQuestionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, totalQuestionsCount }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { bookmarkedQuestionIds, overallAccuracy, totalAttempts } = useProgress();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/week/')) return 'Weekly Quiz';
    if (path === '/mixed') return 'Mixed-Week Quiz Builder';
    if (path === '/bookmarks') return 'Bookmarked Questions';
    if (path === '/revision') return 'Search & Revision';
    if (path === '/statistics') return 'Performance Analytics';
    if (path === '/quiz') return 'Active Quiz';
    return 'Practice Platform';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: Mobile Menu & Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {getPageTitle()}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                12 Weeks Available
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              NPTEL Natural Language Processing &amp; LLMs
            </p>
          </div>
        </div>

        {/* Right: Quick actions & theme */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick stats pills */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>{totalQuestionsCount} Qs</span>
            </div>

            {totalAttempts > 0 && (
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{overallAccuracy}% Acc</span>
              </div>
            )}

            <Link
              to="/bookmarks"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
              title="Saved Bookmarks"
            >
              <Bookmark className="w-3.5 h-3.5 text-rose-500" />
              <span>{bookmarkedQuestionIds.length}</span>
            </Link>
          </div>

          <Link
            to="/revision"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Search Questions"
            aria-label="Search Questions"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
