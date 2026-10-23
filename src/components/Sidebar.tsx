import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  Search,
  Bookmark,
  RotateCcw,
  BarChart3,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Trash2,
  Calendar
} from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { ConfirmModal } from './ConfirmModal';
import { useToast } from './Toast';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  weeks: { weekNumber: number; title: string; count: number }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, weeks }) => {
  const { bookmarkedQuestionIds, incorrectQuestionIds, resetAllProgress } = useProgress();
  const { showToast } = useToast();
  const [weeksOpen, setWeeksOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleConfirmReset = () => {
    resetAllProgress();
    setShowResetModal(false);
    showToast('All quiz progress and history have been cleared.', 'info');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
    }`;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo & Brand */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center space-x-3 group"
          >
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                NPTEL Practice
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                NLP &amp; LLMs Question Bank
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          <NavLink to="/" end className={navLinkClass} onClick={onClose}>
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span>Dashboard</span>
          </NavLink>

          {/* Weekly Quizzes Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setWeeksOpen(!weeksOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 shrink-0 text-indigo-500" />
                <span>Weekly Quizzes</span>
              </div>
              {weeksOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {weeksOpen && (
              <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-200 dark:border-slate-800 space-y-1 py-1 animate-in slide-in-from-top-1">
                {weeks.map((w) => (
                  <NavLink
                    key={w.weekNumber}
                    to={`/week/${w.weekNumber}`}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`
                    }
                  >
                    <span className="truncate">Week {w.weekNumber}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {w.count} Qs
                    </span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/mixed" className={navLinkClass} onClick={onClose}>
            <Sparkles className="w-5 h-5 shrink-0 text-purple-500" />
            <span>Mixed Quiz Builder</span>
          </NavLink>

          <NavLink to="/revision" className={navLinkClass} onClick={onClose}>
            <Search className="w-5 h-5 shrink-0 text-sky-500" />
            <span>Search &amp; Revise</span>
          </NavLink>

          <NavLink to="/bookmarks" className={navLinkClass} onClick={onClose}>
            <Bookmark className="w-5 h-5 shrink-0 text-rose-500" />
            <div className="flex items-center justify-between flex-1">
              <span>Saved Bookmarks</span>
              {bookmarkedQuestionIds.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
                  {bookmarkedQuestionIds.length}
                </span>
              )}
            </div>
          </NavLink>

          <NavLink
            to="/revision?filter=incorrect"
            className={navLinkClass}
            onClick={onClose}
          >
            <RotateCcw className="w-5 h-5 shrink-0 text-amber-500" />
            <div className="flex items-center justify-between flex-1">
              <span>Revise Incorrect</span>
              {incorrectQuestionIds.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                  {incorrectQuestionIds.length}
                </span>
              )}
            </div>
          </NavLink>

          <NavLink to="/statistics" className={navLinkClass} onClick={onClose}>
            <BarChart3 className="w-5 h-5 shrink-0 text-emerald-500" />
            <span>Performance Stats</span>
          </NavLink>
        </div>

        {/* Footer actions: Clear Progress */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Local Progress</span>
          </button>
          <div className="text-[11px] text-center text-slate-400 dark:text-slate-500">
            Version 1.0 &bull; Localhost Offline
          </div>
        </div>
      </aside>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        title="Reset All Quiz Progress?"
        message="This will permanently delete all your quiz history, stored scores, incorrect answer tracking, and bookmarked questions from your browser's local storage. This action cannot be undone."
        confirmLabel="Reset All Data"
        cancelLabel="Keep My Data"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />
    </>
  );
};
