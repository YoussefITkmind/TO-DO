# Todo List API

A simple TODO list backend built with Express and Prisma (Postgres).

## Features
- CRUD for tasks
- Filtering, searching, sorting, and basic dashboard

## Tech
- Node.js + Express
- Prisma ORM (Postgres)

## Requirements
- Node 18+ (or compatible)
- A Postgres database and a `DATABASE_URL` environment variable

## Environment
Create a `.env` file in the project root with:

DATABASE_URL="postgresql://user:pass@host:port/dbname"
PORT=5001

## Setup
Install dependencies and generate Prisma client (if needed):

```bash
npm install
npx prisma generate
```

Run migrations (development):

```bash
npx prisma migrate dev
```

Or apply migrations for production:

```bash
npx prisma migrate deploy
```

Seed the database:

```bash
npm run seed
```

Start the server:

```bash
npm run dev   # development (nodemon)
npm start     # production
```

## Scripts
- `start`: `node src/server.js`
- `dev`: `nodemon src/server.js`
- `seed`: `node prisma/seed.js`

## API Endpoints
Base URL: `/`

Common object: Task

```json
{
	"id": "string",
	"title": "string",
	"status": "pending|completed",
	"priority": "low|medium|high",
	"category": "health|work|finance|shopping|personal|other",
	"description": "string|null",
	"createdAt": "ISO 8601 datetime string",
	"dueDate": "ISO 8601 datetime string|null"
}
```

1) GET /
- Request: none
- Success response (200):

```json
{
	"message": "Dashboard fetched successfully",
	"tasksCount": 10,
	"completed": 4,
	"pending": 6,
	"highTasks": 2
}
```

2) GET /tasks
- Request: query params (optional)
	- `search` — substring search on `title` or `description`
	- `status` — `pending` or `completed`
	- `priority` — `low`, `medium`, `high`
	- `category` — see Task categories above
	- `sortBy` — `newest`, `oldest`, `dueDate`, `priority`
- Success response (200):

```json
{
	"message": "Tasks fetched successfully",
	"tasks": [
		{
			"id": "cj123...",
			"title": "Buy groceries",
			"status": "pending",
			"priority": "medium",
			"category": "shopping",
			"description": "Milk, eggs",
			"createdAt": "2026-08-01T12:00:00.000Z",
			"dueDate": "2026-08-03T12:00:00.000Z"
		}
	]
}
```

3) GET /tasks/:id
- Request: `:id` path parameter
- Success response (200):

```json
{
	"message": "Task fetched successfully",
	"task": { /* Task object */ }
}
```
- Not found (404):

```json
{ "message": "Task not found" }
```

4) POST /tasks
- Request body (application/json):

```json
{
	"title": "Buy groceries",
	"status": "pending",
	"priority": "medium",
	"category": "shopping",
	"description": "Milk, eggs",
	"dueDate": "2026-08-03T12:00:00.000Z"
}
```
- Success response (200):

```json
{
	"message": "Task created successfully",
	"task": { /* created Task object */ }
}
```

5) PUT /tasks/:id
- Request: `:id` path parameter
- Request body (application/json): same fields as POST; only include fields to update
- Success response (200):

```json
{
	"message": "Task Updated successfully",
	"task": { /* updated Task object */ }
}
```
- Not found (404): similar to GET /tasks/:id

6) DELETE /tasks/:id
- Request: `:id` path parameter
- Success response (200):

```json
{ "message": "task deleted successfully" }
```

Error responses (example)

```json
{ "message": "Failed to create task", "error": "Validation error message" }
```

All endpoints return a JSON body and use standard HTTP status codes. See `src/routes/taskRoutes.js` for implementation details.

## Notes
- `DATABASE_URL` is required — see `src/config/db.js` which throws if missing.
- Prisma client is generated to `src/generated/prisma` in this repo.

## License
MIT
