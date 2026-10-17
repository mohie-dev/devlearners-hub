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
- **Study Content Discovery:**
  - Search published materials by title or description within a subject.
  - Filter by academic context, resource format, and one or more subject tags.
  - Matching multiple tags uses an "any selected tag" rule.
- **Admin Content Management:**
  - Search and filter published resources by subject, context, format, source, and subject tags.
  - Create subject-specific tags inline while adding or editing a resource.
  - Upload supported files up to 20 MB or add an external resource URL.
  - Save resources as drafts or publish them immediately; edit and archive published resources.
  - The upload dialog keeps its actions visible while the form scrolls and provides file validation and selection feedback.

## Managing Study Content

Admins can open **Manage Content** and choose **Upload Content** to add a resource:

1. Enter a searchable title and choose the subject and academic context.
2. Optionally select existing subject tags or add a new tag. Tags are scoped to the selected subject.
3. Choose **Upload a file** or **Add an external link**.
4. For uploads, choose a matching format and select a supported file no larger than 20 MB:
   - **PDF:** PDF files.
   - **Document:** Word, PowerPoint, Excel, or plain-text files.
   - **Image:** JPEG, PNG, or WebP images.
5. Optionally add a description and choose whether to publish immediately or save as a draft.

The upload and edit dialogs use a scrollable form area with a persistent action bar. A selected file can be replaced or removed before saving. Invalid file sizes and format mismatches are reported before the upload is submitted.

Students can search published materials by title or description and combine context, resource-format, and tag filters on a subject page. When several tags are selected, a resource matches if it has **at least one** of those tags.

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
│   │   │   ├── admin/content/page.tsx
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
│   │   ├── content/
│   │   │   ├── content-card.tsx
│   │   │   ├── content-tag-selector.tsx
│   │   │   └── subject-content-list.tsx
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
NEXT_PUBLIC_API_BASE_URL=https://devlearners-hub.onrender.com/api/v1
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
