import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { AppLayout } from './components/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { WeeklyQuiz } from './pages/WeeklyQuiz';
import { MixedQuiz } from './pages/MixedQuiz';
import { ActiveQuiz } from './pages/ActiveQuiz';
import { RevisionSearch } from './pages/RevisionSearch';
import { Bookmarks } from './pages/Bookmarks';
import { Statistics } from './pages/Statistics';
import { ReviewAnswers } from './pages/ReviewAnswers';

export function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="week/:weekId" element={<WeeklyQuiz />} />
            <Route path="mixed" element={<MixedQuiz />} />
            <Route path="quiz" element={<ActiveQuiz />} />
            <Route path="revision" element={<RevisionSearch />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="review/:attemptId" element={<ReviewAnswers />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
