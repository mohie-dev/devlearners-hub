# DevLearners Hub — Frontend

A production-ready educational SaaS frontend for **DevLearners Hub**, built with Next.js 16 (App Router), TypeScript, Tailwind CSS, TanStack Query, React Hook Form, and Zod.

## Features

- **Authentication & Security:**
  - Login & Student Registration with client-side form validation (Zod & React Hook Form).
  - JWT Bearer authentication persisted in local storage.
  - Automatic redirect for unauthenticated attempts to access student workspaces.
  - Safe session clearing on logout or 401 unauthorized errors.
- **Subject Discovery:**
  - Public exploration of active courses.
  - Filtering by academic department (`CS`, `IS`, `IT`, `GENERAL`) and study level (1 to 4).
  - Full-text search by subject name or course code.
- **Task Browsing:**
  - Browse published tasks for any active subject (`GET /api/v1/tasks/browse?subjectId=...`).
  - Distinguish between tasks with deadlines and open-ended coursework.
  - Task details inspection modal.
  - One-click addition to personal task list.
- **My Tasks (Personal Progress Tracking):**
  - Personal task management (`GET`, `POST`, `PATCH`, `DELETE` on `/api/v1/me/tasks`).
  - Instant progress toggling between `PENDING` and `COMPLETED`.
  - Filter by All, Pending, or Completed status with real-time counters.
  - Confirmation dialog before removing a task.
- **Student Dashboard:**
  - Welcome section with real profile data (`GET /api/v1/me`).
  - Real metrics: total tasks, pending count, completed count, and upcoming deadlines.
  - Priority task preview and quick action navigation.
- **Student Profile:**
  - Clean view of registered academic profile details (Name, Email, Role, Department, Study Level).

## Brand Identity & Design System

The application strictly implements the DevLearners Hub visual identity:
- **Primary Royal Blue:** `#193DA0`
- **Deep Navy:** `#17194D` (used for sidebar and dark brand surfaces)
- **Golden Accent:** `#FFC329` (used sparingly for badges, accents, and focal highlights)
- **Soft Gray Background:** `#F2F5FA`
- **Light Blue Borders:** `#DCE5F5`
- **Text:** `#172033` (Primary), `#667085` (Muted/Secondary)

## Project Structure

```
frontend/
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (app)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── subjects/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [subjectId]/page.tsx
│   │   │   ├── my-tasks/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   └── mobile-nav.tsx
│   │   ├── providers/
│   │   │   ├── query-provider.tsx
│   │   │   └── toast-provider.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── badge.tsx
│   │       ├── dialog.tsx
│   │       └── skeleton.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   ├── subjects/
│   │   │   ├── subject-card.tsx
│   │   │   ├── subject-filters.tsx
│   │   │   └── subjects-list.tsx
│   │   ├── tasks/
│   │   │   ├── task-card.tsx
│   │   │   ├── tasks-list.tsx
│   │   │   └── task-detail-dialog.tsx
│   │   ├── student-tasks/
│   │   │   ├── student-task-card.tsx
│   │   │   ├── my-tasks-list.tsx
│   │   │   └── remove-task-dialog.tsx
│   │   ├── dashboard/
│   │   │   └── dashboard-stats.tsx
│   │   └── profile/
│   │       └── profile-card.tsx
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-subjects.ts
│   │   ├── use-tasks.ts
│   │   └── use-my-tasks.ts
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── subjects.ts
│   │   │   ├── tasks.ts
│   │   │   └── me.ts
│   │   ├── auth/
│   │   │   └── token.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
```

## Getting Started

### 1. Environment Configuration

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Ensure `NEXT_PUBLIC_API_BASE_URL` points to your backend instance:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Development Server

```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) or [http://localhost:3000](http://localhost:3000).

### 4. Build for Production

```bash
npm run build
npm start
```
