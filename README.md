# GigFlow

Clean, well-structured codebase for managing leads and users.

## Features
- Lead CRUD with filtering, pagination and export
- Authentication and role-based access
- Swagger API docs (server/swagger.output.json)
- Client built with React + Vite + TypeScript
- Server built with Express + TypeScript + Mongoose

## Local setup

Prerequisites: Node.js 18+, npm, MongoDB

1. Install root deps (optional workspace-level):

```bash
# From repo root
npm install
```

2. Server

```bash
cd server
npm install
cp ../.env.example .env
# configure .env values, then:
npm run build
npm start
```

3. Client

```bash
cd client
npm install
cp ../.env.example .env
# edit VITE_API_URL in .env if needed, then:
npm run dev
```

## Environment
Use `.env.example` at the repository root as a template. Do NOT commit secrets.

## Project layout
- `server/` — Express API, TypeScript, Mongoose models
- `client/` — React + Vite application

## Contributing
- Follow existing code style. Create PRs against `main`.
