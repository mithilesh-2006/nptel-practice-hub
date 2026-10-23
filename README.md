# NPTEL Assignment Practice Platform

A full-stack, responsive, and resilient **NPTEL Assignment Practice Platform** built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Runs 100% on localhost with zero external server dependencies, API keys, or paid services. All question data is consolidated into a single authoritative JSON file (`public/questions.json`) and progress is automatically persisted in browser `localStorage`.

---

## 1. Quick Start

### Prerequisites
- Node.js (v18 or higher; tested on Node v24)
- npm (v9 or higher)

### Installation & Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open the localhost URL displayed in your terminal (typically `http://localhost:5173`).

3. **Run automated unit tests:**
   ```bash
   npm run test
   ```

4. **Production Build:**
   ```bash
   npm run build
   ```
   To preview the optimized production build locally:
   ```bash
   npm run preview
   ```

---

## 2. Question Bank Summary & Validation Report

All assignment questions from Weeks 1 through 12 have been consolidated into `public/questions.json`.

| Week | Title / Topic | Questions | Total Points | Question Types |
| :---: | :--- | :---: | :---: | :--- |
| **Week 1** | Distributional Semantics, Morphology, and Pragmatics | 10 | 10 | Single Choice (9), Single Choice [Yes/No] (1) |
| **Week 2** | Language Modeling and N-Grams | 8 | 10 | Single Choice (6 of 1pt), Multi-Point Single Choice (2 of 2pts, shared context) |
| **Week 3** | Neural Networks, Backpropagation, and Regularization | 10 | 10 | Single Choice (7), Multiple Select (3) |
| **Week 4** | Subword Tokenization and Word Embeddings | 9 | 10 | Single Choice (6), True/False (1), Multiple Select (2) |
| **Week 5** | Recurrent Neural Networks, LSTMs, and Seq2Seq Attention | 8 | 10 | Single Choice (4), True/False (1), Multiple Select (2), 3-Pt Question (1) |
| **Week 6** | Transformers and Self-Attention | 8 | 10 | Single Choice (4), True/False (1), Multiple Select (3) |
| **Week 7** | Pre-trained Language Models: BERT, T5, GPT, and ELMo | 8 | 10 | Single Choice (5), Multiple Select (2), Numeric Calculation (1 of 2pts) |
| **Week 8** | Instruction Tuning, Prompt Sensitivity, and RLHF | 10 | 10 | Single Choice (7), Multiple Select (3) |
| **Week 9** | Knowledge Graphs, KGQA, and Translational Models | 10 | 10 | Single Choice (8), Multiple Select (2) |
| **Week 10** | PEFT, Quantization, Distillation, and Interpretability | 10 | 10 | Single Choice (9), Multiple Select (1) |
| **Week 11** | Factorized Embeddings and Hierarchical Geometry | 10 | 10 | Single Choice (10) |
| **Week 12** | LLM Bias, Safety, and Responsible AI | 10 | 10 | Single Choice (10) |
| **TOTAL** | **Complete 12-Week Course Bank** | **111** | **120** | **Single Choice (88), Multi-Select (19), T/F (3), Numeric (1)** |

### Validation Highlights:
- **Zero Question ID Collisions**: Every question has a unique stable ID (`w1-q1` through `w12-q10`).
- **Exact Answer Matching**: All 111 accepted answers match their options verbatim (order-independent set match for multiple-select).
- **Shared Passages Preserved**: Weeks with shared context passages (e.g. Week 2 Questions 7 and 8 corpus) are preserved in the `context` field and rendered with formatted code blocks.
- **Edge-Case Annotation**: Week 7 Question 8 references NumPy `einsum('ij,ji->', A, B)` with accepted answer `38`. The matrices were referenced in the original text; this is noted in `validationNotes` without modifying the original question text.

---

## 3. Core Features

### 1. Dashboard
- Displays overall progress, overall accuracy percentage, total quizzes taken, and total points earned.
- 12 weekly cards showing dynamic question counts, total points, best scores, and attempt counts.
- Quick start actions: **Quick 10-Question Practice**, **Custom Mixed Quiz**, and **Revise Incorrect Questions**.

### 2. Weekly Quizzes
- Select any week (1 to 12) to start an individual quiz.
- Choose between **Practice Mode** and **Exam Mode**.
- Set timer limits or choose untimed practice.

### 3. Mixed-Week & Custom Quiz Builder
- **Flexible Week Selection**: Select any custom combination of weeks (e.g., Weeks 1–3, Weeks 4–6, Weeks 1–6, Weeks 7–12, All 1–12, or custom picks like Weeks 2, 5, 8, 11).
- **Question Type Filters**: Include or exclude Single Choice, Multiple Select, True/False, or Numeric questions.
- **Custom Question Limits**: Practice with all matching questions or pick specific subset sizes (10, 15, 20, 30, 50, or custom count).
- **Dual Modes**: Practice Mode (instant feedback & explanations) or Exam Mode (timed assessment).
- **Configurable Timer**: Choose Untimed or set countdowns (15, 30, 45, 60, or 90 minutes).
- **Double Randomization**: Independent toggles to shuffle question order and shuffle answer choice order.
- **Real-Time Question Ceiling**: Dynamic matching count shows exactly how many questions match criteria and prevents over-requesting questions.

### 4. Practice Mode vs. Exam Mode
- **Practice Mode**:
  - Immediate visual feedback upon answering.
  - Correct and incorrect visual cues.
  - Displays accepted answers and detailed explanations.
  - Retry question button directly inside the question view.
- **Exam Mode**:
  - Answers hidden until submission.
  - Active countdown timer with warning colors when time runs low.
  - Automatic submission upon timer expiry.
  - Confirmation dialog displaying answered vs unanswered question count.
  - Protection against accidental tab closure during an exam.

### 5. Scoring & Review System
- Calculates score based on the original point values (1, 2, or 3 points).
- Multiple-select questions evaluated using strict order-independent set equality.
- Detailed post-quiz review with visual breakdown, time taken, and filters (All, Incorrect Only, Correct Only).
- "Practice Incorrect Questions" button to immediately retry only missed questions.

### 6. Search & Revision
- Real-time keyword search across question text, options, and reference context.
- Filter by week, question type, incorrect questions, or bookmarked questions.
- "Reveal Answer" toggles for flashcard-style studying.
- One-click button to launch a practice quiz with the filtered question set.

### 7. Bookmarks & Incorrect Tracker
- Bookmark questions anytime with the bookmark icon.
- Dedicated saved questions page with options to practice all saved questions.
- Automatic tracking of incorrect answers in local storage. Redeeming a question in subsequent quizzes automatically clears it from the incorrect pool.

### 8. Persistence & Theming
- Stored using versioned `localStorage` (`nptel_practice_v1`).
- Survives browser refreshes and restarts.
- Session storage cache prevents losing answers on accidental page refresh.
- "Reset All Data" option with confirmation dialog.
- Complete Light Mode and Dark Mode support with system preference auto-detection.

---

## 4. Custom Quiz Guide & Advanced Configurations

The platform offers a versatile **Custom Quiz** engine accessible via the sidebar navigation, the dashboard's "Custom Mixed Quiz" button, or directly at the `/mixed` route.

### 4.1 How to Build a Custom Quiz

You can tailor your practice session using several customizable parameters:

1. **Week Selection & Quick Presets**:
   - **Custom Combination**: Click any combination of week cards (e.g. Weeks 2, 5, 8, and 11) to toggle individual weeks on or off.
   - **Pre-configured Semester Presets**:
     - `1–3`: Foundation topics (Distributional Semantics, N-Grams, Neural Networks).
     - `4–6`: Deep Learning NLP (Tokenization, Word Embeddings, RNNs/Seq2Seq, Transformers).
     - `1–6`: Mid-Term Comprehensive Mock.
     - `7–12`: Pre-trained Models & Modern LLMs (BERT, GPT, T5, RLHF, Knowledge Graphs, PEFT, Geometry, Safety).
     - `All (1–12)`: Complete Full-Course Mock Exam covering all 111 questions.

2. **Quiz Mode**:
   - **Practice Mode**: Provides immediate feedback after you select or submit an answer. Highlights correct/incorrect options, reveals the accepted answer and explanations, and includes a "Retry Question" button.
   - **Exam Mode**: Replicates real NPTEL test environments. Answers remain hidden until submission. Features an active countdown timer, review flags, a question matrix, and an unanswered questions warning dialog before submission.

3. **Question Type Filters**:
   - Filter your quiz by any combination of question types:
     - `Single Choice`: Standard multiple-choice questions with 1 correct option.
     - `Multiple Select`: Multi-option questions where one or more answers may be correct.
     - `True / False`: Binary conceptual evaluations.
     - `Numeric Answer`: Numerical calculations and exact outputs (e.g., tensor contraction calculations).

4. **Question Count & Subset Sizing**:
   - Choose **"All Available Matching"** to attempt every question that matches your selected weeks and question types.
   - Or choose **"Subset"** and select a preset count (`10`, `15`, `20`, `30`, `50`) or enter a custom integer.
   - *Intelligent Clamping*: The builder displays the exact number of matching questions in real time (e.g., *"Ready to begin: 20 Questions"*). If the requested count exceeds available questions, it safely caps the quiz at the maximum available count without fabricating placeholder questions.

5. **Timer & Time Constraints**:
   - **Untimed**: Take the quiz without any time limits or countdown pressure (ideal for learning).
   - **Timed Countdown**: Choose `15 min`, `30 min`, `45 min`, `60 min`, or `90 min`. The timer features warning colors when under 2 minutes remain and automatically submits the quiz when time runs out.

6. **Randomization**:
   - **Randomize Question Order**: Fisher-Yates shuffle ensures a unique question sequence every attempt.
   - **Randomize Answer Choices**: Shuffles the order of options (A, B, C, D) while maintaining exact answer correctness.

---

### 4.2 Targeted Custom Quizzes Across the Platform

In addition to the Mixed-Week Builder, the platform provides three specialized one-click custom quizzes:

- **Targeted Incorrect-Answer Quiz**:
  - Automatically identifies all questions answered incorrectly across all your quiz attempts.
  - Accessible via **"Revise Incorrect"** in the sidebar or **"Practice [N] Incorrect Questions"** on the score review page.
  - As soon as you answer an incorrect question correctly in a future attempt, it is automatically removed from the incorrect review pool.
- **Saved Bookmarks Custom Quiz**:
  - Lets you test yourself on questions you've starred during your study sessions.
  - Launch with one click from the **Saved Bookmarks** page.
- **Search & Filter Revision Quiz**:
  - Search any keyword (e.g. `attention`, `perplexity`, `BLEU`, `einsum`) on the **Search & Revise** page.
  - Filter by week and type, then click **"Practice These [N] Questions"** to instantly launch a custom quiz containing solely those search results.

---

## 5. Project Structure

```
nptel/
├── public/
│   └── questions.json            # Single consolidated question bank
├── src/
│   ├── components/
│   │   ├── AppLayout.tsx         # Responsive layout with collapsible sidebar
│   │   ├── Header.tsx            # Navigation header, quick stats & theme toggle
│   │   ├── Sidebar.tsx           # Sidebar with 12-week accordion & badges
│   │   ├── WeekCard.tsx          # Weekly topic card with best score
│   │   ├── QuestionCard.tsx      # Question renderer with options & immediate feedback
│   │   ├── QuestionNavigator.tsx # Grid matrix showing answered/flagged status
│   │   ├── QuizControls.tsx      # Navigation buttons & submit dialog
│   │   ├── Timer.tsx             # Countdown timer with low-time warning
│   │   ├── ProgressBar.tsx       # Animated progress bar
│   │   ├── ResultsSummary.tsx    # Score overview & question-by-question review
│   │   ├── ConfirmModal.tsx      # Accessible modal for actions & alerts
│   │   └── Toast.tsx             # Notification toast provider
│   ├── data/
│   │   └── questionTypes.ts      # Type labels, badges, and metadata
│   ├── hooks/
│   │   ├── useQuestionBank.ts    # Dynamic fetch and caching for questions.json
│   │   ├── useProgress.ts        # LocalStorage state, history, and metrics
│   │   ├── useTimer.ts           # Countdown timer hook
│   │   └── useTheme.ts           # Dark/light theme management
│   ├── pages/
│   │   ├── Dashboard.tsx         # Main course dashboard
│   │   ├── WeeklyQuiz.tsx        # Individual week overview and launcher
│   │   ├── MixedQuiz.tsx         # Multi-week quiz generator
│   │   ├── ActiveQuiz.tsx        # Quiz execution engine
│   │   ├── ReviewAnswers.tsx     # Past attempt review
│   │   ├── Bookmarks.tsx         # Bookmarked questions manager
│   │   ├── RevisionSearch.tsx    # Keyword search and filter revision
│   │   └── Statistics.tsx        # In-depth analytics and attempt logs
│   ├── types/
│   │   └── question.ts           # TypeScript interfaces and types
│   ├── utils/
│   │   ├── __tests__/            # Vitest automated test suite
│   │   │   ├── quizEngine.test.ts
│   │   │   └── scoring.test.ts
│   │   ├── quizEngine.ts         # Shuffling, filtering, and quiz construction
│   │   ├── scoring.ts            # Grading rules and accuracy calculations
│   │   └── storage.ts            # Safe versioned localStorage operations
│   ├── App.tsx                   # Router and layout configuration
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Tailwind directives and styling
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 6. How to Add or Update Questions

### Updating the Question Bank

1. Open each NPTEL assignment in Chrome and use **Ask Gemini** to extract the questions and answers into a JSON file that follows the structure specified in this README.
2. Repeat this process for each assignment, ensuring that the extracted questions use the same JSON schema.
3. Ask Gemini to combine the JSON content from all assignments into a single JSON dataset, preserving the required structure and including all questions.
4. Replace the existing `questions.json` file with the combined JSON content.
5. Verify that the updated file contains all questions, follows the required JSON format, and works correctly with the website's weekly and mixed-quiz features.

All questions reside in `public/questions.json`. To modify an existing question or add new questions, edit this file directly.

### Question Schema:
```json
{
  "id": "w1-q1",
  "questionNumber": 1,
  "question": "Which of the following best captures the principle of distributional semantics?",
  "points": 1,
  "options": [
    "Words that appear in similar contexts tend to have similar meanings.",
    "A word's meaning is fully fixed by its dictionary definition.",
    "Meaning is determined solely by a word's spelling.",
    "Distributional semantics has no connection to word embeddings."
  ],
  "questionType": "single-choice",
  "userAnswer": null,
  "acceptedAnswer": "Words that appear in similar contexts tend to have similar meanings.",
  "explanation": "Distributional semantics states that words occurring in similar contexts share similar semantic meanings (Harris / Firth).",
  "tags": ["distributional semantics", "week-1"]
}
```

### Supported Question Types:
- `"single-choice"`: `options` contains choices; `acceptedAnswer` is a single string.
- `"multiple-select"`: `options` contains choices; `acceptedAnswer` is an array of strings (e.g. `["Option A", "Option C"]`).
- `"true-false"`: `options` is `["True", "False"]`; `acceptedAnswer` is `"True"` or `"False"`.
- `"numeric"`: `options` is `[]`; `acceptedAnswer` is a number or numeric string (e.g. `"38"`).
- `"short-answer"`: `options` is `[]`; `acceptedAnswer` is the target string.

---

## 7. Offline Support & Portability

The website runs entirely offline once installed. There are no remote API calls, third-party analytics, or external font/CDN requirements necessary for runtime execution.

To archive or move the project to another computer, simply copy the folder (or use the included `nptel-practice.zip`), run `npm install`, and `npm run dev`.
#   n p t e l - p r a c t i c e - h u b 
 
 