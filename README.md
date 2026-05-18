# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack, TypeScript, and clean architecture.

## Assignment Features
- JWT-based authentication with registration, login, protected routes, bcrypt password hashing, and auth middleware
- Lead management with create, update, delete, list, single lead details, CSV export, and backend pagination
- Advanced filtering and search by status, source, and name/email, with latest/oldest sorting
- Responsive React UI with reusable components, loading states, empty states, and validation
- Role-based access control for Admin and Sales users
- Swagger API documentation for recruiter testing
- Docker setup for the full application

## Tech Stack
- Frontend: React, TypeScript, TailwindCSS
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose

## Setup Instructions

Prerequisites: Node.js 18+, npm, MongoDB

1. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

2. Configure environment variables

```bash
cp .env.example server/.env
cp .env.example client/.env
```

3. Start the backend

```bash
cd server
npm run build
npm start
```

4. Start the frontend

```bash
cd client
npm run dev
```

## API Documentation
- Swagger UI: `/api-docs`
- Generated OpenAPI file: `server/swagger.output.json`

## Environment File
Use `.env.example` at the repository root as the template for local setup. Do not commit secrets.

## Project Structure
- `server/` - Express API, validation, services, controllers, and Mongoose models
- `client/` - React dashboard, reusable UI components, hooks, and stores
