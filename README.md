# DevLearners Hub

**A full-stack academic learning platform for discovering course materials, managing coursework, and tracking personal task progress.**

DevLearners Hub gives students a searchable, subject-oriented learning experience and gives administrators a central workspace for managing academic content. Students can explore published courses, find resources by title, description, academic context, and tags, browse coursework, and keep a personal task list. Administrators manage subjects, materials, tags, and task publication from a protected dashboard.

> **Project status:** Active full-stack application. The repository contains a Next.js frontend and a NestJS REST API backed by PostgreSQL.

## Highlights

### Student experience

- Browse active subjects and search by subject name or course code.
- Filter subjects by department and study level.
- Explore each subject's published learning materials and tasks.
- Search content by title or description; filter by resource format, academic context, and subject tags.
- Open uploaded resources and external links.
- Register and sign in to maintain a personal task list.
- Review full task instructions, deadlines, academic context, and associated study materials.
- Mark personal tasks pending or complete without changing other students' progress.
- Maintain an academic profile with department and study-level information.

### Administration

- Manage active subjects and academic metadata.
- Search, filter, edit, and archive published study content; create new content as a draft or publish it immediately.
- Upload supported course files (up to 20 MB) or add an external URL.
- Organize content with subject-specific tags and filter resources by tags.
- Create and manage coursework, associate optional study material, and control task publication status.

## Application overview

| Layer | Technology | Responsibilities |
| --- | --- | --- |
| Frontend | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 | Student and admin interfaces, form validation, responsive UI |
| Client data | TanStack Query 5 | API requests, caching, mutations, and query invalidation |
| Backend | NestJS 12, TypeScript | REST endpoints, validation, authorization, business rules |
| Persistence | PostgreSQL, TypeORM | Relational data, entity relationships, versioned migrations |
| Authentication | JWT bearer access tokens, Passport, bcrypt | Student registration/sign-in and protected admin/student endpoints |
| File storage | Cloudinary | Admin resource uploads and hosted resource URLs |
| API documentation | Swagger / OpenAPI | Interactive endpoint documentation |

## Architecture

```text
┌──────────────────────────────┐
│ Next.js web application      │
│ Student workspace · Admin UI│
└──────────────┬───────────────┘
               │ JSON / multipart HTTP
               ▼
┌──────────────────────────────┐
│ NestJS REST API              │
│ Auth · Users · Subjects      │
│ Content · Subject Tags       │
│ Tasks · Student Tasks        │
└──────┬─────────────┬─────────┘
       │             │
       ▼             ▼
 PostgreSQL       Cloudinary
 (TypeORM)         (uploads)
```

The backend is organized as a modular monolith. Each domain module owns its controllers, services, DTOs, entities, and tests; shared guards, interceptors, decorators, and exception handling live in `backend/src/common`.

## Domain model

- **User:** student or admin account, with an optional academic department and study level.
- **Subject:** academic course with code, department, level, description, and active/archive lifecycle.
- **Subject tag:** subject-scoped label used to organize and filter course materials.
- **Content item:** one independently searchable uploaded file or external link, with resource type, academic context, tags, and draft/published/archived status.
- **Task:** subject coursework with instructions, optional deadline, optional related content, and publication status.
- **Student task:** a student's personal task-list entry and current pending/completed state.

```mermaid
erDiagram
    USERS ||--o{ TASK_PROGRESS : tracks
    TASKS ||--o{ TASK_PROGRESS : has
    SUBJECTS ||--o{ CONTENT_ITEMS : provides
    SUBJECTS ||--o{ SUBJECT_TAGS : defines
    SUBJECTS ||--o{ TASKS : assigns
    CONTENT_ITEMS }o--o{ SUBJECT_TAGS : labeled_with
    CONTENT_ITEMS o|--o{ TASKS : supports
```

Uploaded binaries are stored through Cloudinary; PostgreSQL stores their metadata and resource URLs rather than file contents.

Students can browse published material and tasks without signing in. Personal task tracking requires a student account. Administrative write operations require a valid bearer token and the `ADMIN` role. Student-specific endpoints derive the student identity from the authenticated token.

## Repository structure

```text
.
├── backend/
│   ├── src/
│   │   ├── common/             # Guards, decorators, DTOs, filters, interceptors
│   │   ├── config/             # Database and Swagger setup
│   │   ├── migrations/         # TypeORM schema migrations
│   │   ├── modules/            # Auth, users, subjects, content, tags, tasks, me
│   │   └── scripts/            # Admin account seed utility
│   ├── test/                   # API end-to-end tests
│   ├── package.json
│   └── README.md               # Backend setup, configuration, API, and operations
├── frontend/
│   ├── src/
│   │   ├── app/                # Public, student, and admin routes
│   │   ├── components/         # Shared layout, providers, and UI primitives
│   │   ├── features/           # Feature-focused UI
│   │   ├── hooks/              # React Query hooks
│   │   ├── lib/api/            # Typed API clients
│   │   └── types/              # Shared frontend API/domain types
│   ├── test/                   # Focused Node.js tests
│   └── README.md               # Frontend-specific overview and content workflow
└── README.md
```

## Getting started

### Prerequisites

- Node.js 20 or later and npm.
- PostgreSQL.
- Cloudinary credentials for the backend's resource-upload integration.

### 1. Configure the backend

Create `backend/.env`:

```dotenv
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/devlearners_hub
DATABASE_SSL=false
JWT_SECRET=replace-with-a-random-secret-at-least-32-characters-long
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Create the database named `devlearners_hub` before running migrations. Use a strong, private JWT secret and keep environment files out of version control.

Install dependencies and apply migrations:

```powershell
cd backend
npm install
npm run db:migration:run
```

Create the first admin using credentials supplied as environment variables. Run this only in a trusted environment:

```powershell
$env:ADMIN_EMAIL = "admin@example.com"
$env:ADMIN_FULL_NAME = "DevLearners Admin"
$env:ADMIN_PASSWORD = "replace-with-a-strong-password"
npm run seed:admin
```

Start the API in development mode:

```powershell
npm run start:dev
```

The API defaults to `http://localhost:3000/api/v1`; Swagger UI is available at `http://localhost:3000/api/docs`.

### 2. Configure the frontend

Create `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

Install dependencies and start Next.js:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` (or the next available port if 3000 is already in use).

## API overview

The complete interactive API contract is available in Swagger at `/api/docs`.

| Area | Main endpoints | Access |
| --- | --- | --- |
| Authentication | `POST /auth/register`, `POST /auth/login` | Public |
| Current user | `GET /me`, `PATCH /me` | Authenticated |
| Subjects | `GET /subjects`, `GET /subjects/:id` | Public |
| Subject management | `POST /subjects`, `PATCH /subjects/:id`, `PATCH /subjects/:id/archive` | Admin |
| Subject tags | `GET /subjects/:subjectId/tags` | Public |
| Tag management | `POST /subjects/:subjectId/tags`, `PATCH` and `DELETE /subjects/:subjectId/tags/:tagId` | Admin |
| Content | `GET /content`, `GET /content/:id` | Published content |
| Content management | `POST /content`, `PATCH /content/:id`, `PATCH /content/:id/archive` | Admin |
| Tasks | `GET /tasks/browse?subjectId=...` | Published tasks |
| Task management | `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PATCH /tasks/:id`, `DELETE /tasks/:id` | Admin |
| My tasks | `GET /me/tasks`, `POST /me/tasks`, `PATCH /me/tasks/:taskId/progress`, `DELETE /me/tasks/:taskId` | Student |

Content search accepts `search`, `subjectId`, `academicContext`, `resourceType`, `sourceType`, `tagIds`, `page`, and `limit`. Multiple tag IDs can be sent as a comma-separated query value; content matches **any** selected tag. Published content is paginated. Subject search accepts `search`, `department`, and `level`.

The API wraps successful responses in `{ "status": "success", "code": 200, "data": ... }`. Errors use `{ "status": "error", "code": ..., "data": { "message": ... } }`.

## Development and quality checks

Backend commands (run from `backend/`):

```bash
npm run build
npm run lint
npm test
npm run test:e2e
```

Frontend commands (run from `frontend/`):

```bash
npm run build
npm run lint
npm run test:auth
node --test test/admin-content-filters.test.mjs
```

The project uses TypeORM migrations for schema changes; production schema synchronization is disabled. Review the backend README for migration, configuration, and test details.

## Documentation

- [Backend README](./backend/README.md) — API configuration, endpoints, migrations, tests, and deployment notes.
- [Frontend README](./frontend/README.md) — UI features, design system, and the content-management workflow.
- [Swagger UI](http://localhost:3000/api/docs) — interactive API documentation when the backend is running locally.

## License

No open-source license is currently declared. All rights reserved unless a license is added to this repository.
