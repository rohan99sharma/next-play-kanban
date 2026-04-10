# next-play-kanban

A full-stack Kanban board I built as part of an internship assessment for Next Play Games. Inspired by Linear and Asana.

## Tech

- React 19 + TypeScript
- Tailwind CSS v4
- Supabase (Postgres, Auth, Realtime)
- @hello-pangea/dnd for drag and drop
- React Hook Form + Zod
- Deployed on Vercel

## Features

- Anonymous guest auth via Supabase
- Drag and drop tasks across columns (To Do, In Progress, In Review, Done)
- Create and edit tasks with priority, due date, labels, and assignees
- Task comments and activity feed
- Board stats, search, and filters

## Setup

```bash
npm install
npm run dev
```

Create a `.env.local`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Run `schema.sql` against your Supabase project to set up the database.
