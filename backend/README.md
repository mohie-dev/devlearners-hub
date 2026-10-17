# DevLearners Hub API

NestJS REST API for the DevLearners Hub academic learning platform. The API provides public discovery of subjects, published learning content, and coursework, alongside authenticated student task tracking and role-protected administration.

## Technology

- Node.js, TypeScript, and NestJS 12
- PostgreSQL with TypeORM 1.x and explicit migrations
- JWT bearer authentication using Passport; bcrypt password hashing
- DTO validation with `class-validator` and `class-transformer`
- Swagger/OpenAPI documentation
- Cloudinary for uploaded study resources
- Vitest for unit and end-to-end test runners; Oxlint for linting

## Modules

| Module | Responsibility |
| --- | --- |
| `auth` | Student registration and login; JWT issue and validation |
| `users` | User persistence and profile operations |
| `me` | Current user profile and student task-list endpoints |
| `subjects` | Subject discovery, search, filtering, creation, updates, and archiving |
| `subject-tags` | Subject-scoped tag creation, listing, updates, and deletion |
| `content` | Published content search/filtering, pagination, file/link creation, updates, archiving |
| `tasks` | Public task browsing and admin task CRUD/publication lifecycle |
| `student-tasks` | Student-specific task-list entries and progress |
| `cloudinary` | Admin-only upload integration and file validation |

Shared authorization decorators and guards, the response interceptor, exception filter, and common DTOs live in `src/common`.

## Requirements

- Node.js 20 or later and npm.
- PostgreSQL database.
- Cloudinary account for the upload integration.

## Configuration

Create `backend/.env` in local development. The app requires the following configuration:

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

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection URL |
| `JWT_SECRET` | Yes | JWT signing secret; minimum 32 characters |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `NODE_ENV` | No | `development`, `production`, or `test`; defaults to `development` |
| `PORT` | No | HTTP port; defaults to `3000` |
| `API_PREFIX` | No | API route prefix; defaults to `api/v1` |
| `DATABASE_SSL` | No | Set to `false` to disable PostgreSQL SSL; otherwise SSL is enabled |

Use a strong random JWT secret and keep `.env` files and credentials out of source control. The default SSL configuration is suitable for hosted PostgreSQL; local PostgreSQL commonly uses `DATABASE_SSL=false`.

## Setup and run

```bash
npm install
```

Create the PostgreSQL database named in `DATABASE_URL`, then apply all migrations:

```bash
npm run db:migration:run
```

Run the API in watch mode:

```bash
npm run start:dev
```

The default API base URL is `http://localhost:3000/api/v1`. Swagger UI is served at `http://localhost:3000/api/docs`.

### Create the first admin

The seed script reads the following values from the environment:

```dotenv
ADMIN_EMAIL=admin@example.com
ADMIN_FULL_NAME=DevLearners Admin
ADMIN_PASSWORD=replace-with-a-strong-password
```

The password must be between 8 and 72 characters. Run:

```bash
npm run seed:admin
```

The script creates an admin when the email is new, does nothing when an admin with that email already exists, and promotes an existing non-admin account with that email to `ADMIN`. Protect this operation and its environment variables accordingly.

## API reference

All route paths below are relative to the configured API prefix (`/api/v1` by default). Use Swagger UI for request DTOs, response schemas, and the full OpenAPI contract.

### Authentication

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Register a student and return a bearer token |
| `POST` | `/auth/login` | Public | Authenticate and return a bearer token |

Registration always creates a student account. Passwords are stored as bcrypt hashes. Access tokens are currently issued with a 15-minute expiry.

### Current user and student tasks

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/me` | Authenticated | Get the caller's profile |
| `PATCH` | `/me` | Authenticated | Update the caller's profile |
| `GET` | `/me/tasks` | Student | List tasks in the caller's personal list |
| `POST` | `/me/tasks` | Student | Add a published task to the personal list |
| `PATCH` | `/me/tasks/:taskId/progress` | Student | Update personal progress (`PENDING` or `COMPLETED`) |
| `DELETE` | `/me/tasks/:taskId` | Student | Remove a task from the personal list |

The current user ID comes from the access token, not a client-supplied user ID. Student task endpoints reject admin accounts.

### Subjects and tags

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/subjects` | Public | List active subjects |
| `GET` | `/subjects/:id` | Public | Get an active subject |
| `POST` | `/subjects` | Admin | Create a subject |
| `PATCH` | `/subjects/:id` | Admin | Update a subject |
| `PATCH` | `/subjects/:id/archive` | Admin | Archive a subject |
| `GET` | `/subjects/:subjectId/tags` | Public | List tags for an active subject |
| `POST` | `/subjects/:subjectId/tags` | Admin | Create a subject tag |
| `PATCH` | `/subjects/:subjectId/tags/:tagId` | Admin | Rename a subject tag |
| `DELETE` | `/subjects/:subjectId/tags/:tagId` | Admin | Delete a subject tag |

Subject list filters: `search`, `department` (`CS`, `IS`, `IT`, `GENERAL`), and `level` (`1`–`4`). Tag names are unique within their subject. Content can only be assigned tags belonging to its subject.

### Content

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/content` | Public | Search and paginate published content |
| `GET` | `/content/:id` | Public | Get a published content item |
| `POST` | `/content` | Admin | Create content from an upload or external URL |
| `PATCH` | `/content/:id` | Admin | Update content metadata, tags, or publication status |
| `PATCH` | `/content/:id/archive` | Admin | Archive content |

Content list filters:

| Query parameter | Meaning |
| --- | --- |
| `search` | Case-insensitive match against title or description (up to 150 characters) |
| `subjectId` | Limit to a subject UUID |
| `academicContext` | `LECTURE`, `TUTORIAL`, or `GENERAL` |
| `resourceType` | `PDF`, `VIDEO`, `DOCUMENT`, `IMAGE`, `LINK`, or `OTHER` |
| `sourceType` | `UPLOAD` or `EXTERNAL_LINK` |
| `tagIds` | One or more UUIDs; comma-separated or repeated query values |
| `page` | 1-based page number; defaults to `1` |
| `limit` | Page size from `1` to `50`; defaults to `20` |

When multiple tag IDs are provided, content matches **any** selected tag. Results include subject and tag relations and are ordered by publication date, then creation date.

`POST /content` accepts `multipart/form-data`:

- For `sourceType=UPLOAD`, include exactly one `file` (maximum 20 MB) and do not send `resourceUrl`.
- For `sourceType=EXTERNAL_LINK`, provide `resourceUrl` and do not send a file.
- Optional `tagIds` are IDs of tags belonging to the selected subject.
- Supported upload formats include PDF, Word, PowerPoint, Excel, plain text, JPEG, PNG, and WebP. Uploaded format must match the declared resource type where the type has a file mapping.
- `status` can be `DRAFT` or `PUBLISHED` at creation. Public endpoints return published content only.

### Tasks

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/tasks/browse?subjectId=:id` | Public | Browse published tasks for an active subject |
| `POST` | `/tasks` | Admin | Create a task (starts as draft) |
| `GET` | `/tasks` | Admin | List tasks across statuses |
| `GET` | `/tasks/:id` | Admin | Get task details |
| `PATCH` | `/tasks/:id` | Admin | Update task fields/status |
| `DELETE` | `/tasks/:id` | Admin | Delete a task |

Task fields include subject, title, description, academic context, optional due date, optional related content, and status. Updating status to `PUBLISHED` makes a task available through the public browse endpoint.

### Cloudinary

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/cloudinary/upload` | Admin | Upload one supported file (maximum 20 MB) |

Content creation can upload the file directly as part of `POST /content`; the standalone endpoint is also available for integrations.

## Response format and validation

Successful API responses use a common envelope:

```json
{
  "status": "success",
  "code": 200,
  "data": {}
}
```

Errors use:

```json
{
  "status": "error",
  "code": 400,
  "data": {
    "message": "Request validation failed"
  }
}
```

Global request validation transforms DTO values and rejects unknown properties rather than silently accepting them. UUID path parameters are validated. A global rate limiter is configured for 100 requests per 60 seconds.

## Database and migrations

TypeORM schema synchronization is disabled. Use the migration scripts for all schema changes:

```bash
npm run db:migration:show
npm run db:migration:run
npm run db:migration:revert
npm run db:migration:generate -- src/migrations/AddYourChange
```

The migration commands build the project before invoking TypeORM. Migrations are stored in `src/migrations`; the TypeORM CLI data source loads compiled entities and migrations from `dist/`.

## Tests, lint, and build

```bash
npm run build
npm run lint
npm test
npm run test:watch
npm run test:cov
npm run test:e2e
```

`npm test` runs the Vitest unit suite. `npm run test:e2e` uses `vitest.config.e2e.ts`. Set up an isolated test database and the required environment values before running integration tests.

## Production notes

- Configure `NODE_ENV=production`, a strong `JWT_SECRET`, production PostgreSQL credentials, and Cloudinary credentials in the hosting provider's secret manager.
- Use TLS/SSL for hosted PostgreSQL; do not disable database SSL in production.
- Run `npm run build`, apply committed migrations with `npm run db:migration:run`, then start with `npm run start:prod`.
- Keep secrets out of source control and avoid exposing administrative seed credentials in build logs.
- Configure `API_PREFIX` and the frontend `NEXT_PUBLIC_API_BASE_URL` consistently.

## Project references

- [Project overview and local full-stack setup](../README.md)
- [Frontend README](../frontend/README.md)
- [NestJS documentation](https://docs.nestjs.com/)
- [TypeORM migrations](https://typeorm.io/migrations)
