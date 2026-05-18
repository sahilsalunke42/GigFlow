# Smart Leads Dashboard - Frontend

A production-ready React + TypeScript frontend for managing leads with a modern dashboard interface.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety and code quality
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Project Structure

```
src/
├── api/                 # API service layer (Axios)
│   ├── client.ts       # Axios instance with interceptors
│   ├── auth.ts         # Authentication API endpoints
│   └── leads.ts        # Leads API endpoints
├── components/          # Reusable React components
│   ├── common/         # UI components (Button, Input, Modal, etc.)
│   ├── layout/         # Layout components (Header, Sidebar)
│   ├── auth/           # Auth-related components
│   └── leads/          # Leads-related components
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Auth hooks
│   ├── useLeads.ts     # Leads API hooks (React Query)
│   └── useHelpers.ts   # Utility hooks
├── layouts/            # Page layouts
├── pages/              # Page components
│   ├── auth/           # Login, Register pages
│   └── dashboard/      # Dashboard, Leads pages
├── store/              # Zustand stores
│   ├── authStore.ts    # Auth state
│   └── leadsStore.ts   # Leads filters state
├── styles/             # Global styles
├── types/              # TypeScript types and interfaces
├── utils/              # Utility functions
│   ├── constants.ts    # Constants
│   ├── helpers.ts      # Helper functions
│   └── csv.ts          # CSV export utilities
├── routes/             # Route guards
├── App.tsx             # Main App component
└── main.tsx            # Entry point
```

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   Create a `.env` file based on `.env.example`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Features

### Authentication
- User login and registration
- JWT token handling with localStorage persistence
- Protected routes
- Automatic logout on token expiration
- Auth state management with Zustand

### Dashboard
- Overview with key metrics (total leads, new leads, conversions, value)
- Recent activity summary
- Responsive design

### Leads Management
- Create new leads with form validation
- Edit existing leads
- Delete leads with confirmation
- View lead details
- Search by name/email with debounced input
- Filter by status and source
- Sort by created/updated/name
- Pagination with navigation controls

### Data Export
- Export filtered leads to CSV
- Download with proper formatting

### UI/UX
- Responsive mobile-first design
- Loading states with spinners
- Empty states with action buttons
- Error states with retry options
- Success/error notifications
- Clean, minimal design
- Consistent spacing and typography

## API Integration

All API calls are centralized in the `src/api/` folder:

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token
- `GET /auth/me` - Get current user

### Leads Endpoints
- `GET /leads` - Get paginated leads with filters
- `GET /leads/:id` - Get single lead
- `POST /leads` - Create lead
- `PATCH /leads/:id` - Update lead
- `DELETE /leads/:id` - Delete lead
- `GET /leads/export` - Export leads as CSV

## Code Quality

- **TypeScript Strict Mode** - Full type safety
- **ESLint** - Code linting
- **No `any` types** - Enforced strict typing
- **Modular Components** - Small, reusable components
- **Custom Hooks** - Extracted business logic
- **Separation of Concerns** - API, state, UI clearly separated
- **No Redux** - Using Zustand for simplicity
- **No hardcoded values** - Constants exported from `utils/constants`

## State Management

### Zustand Stores
1. **authStore** - User authentication and session state
2. **leadsStore** - Leads filters and pagination state

Both are persisted to localStorage for persistence across sessions.

## Form Validation

Using React Hook Form + Zod for:
- Login form
- Registration form
- Lead creation/edit form

Validation includes:
- Email format
- Password strength
- Required fields
- Custom error messages

## Performance

- React Query for efficient data fetching and caching
- Debounced search (300ms) to prevent excessive API calls
- Request deduplication
- Stale-while-revalidate pattern
- Lazy loading routes
- Optimized re-renders with proper hook usage

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## Development Guidelines

### Component Guidelines
- Keep components small and focused
- Extract complex logic into custom hooks
- Use prop types/interfaces
- Prefer functional components
- Use React.forwardRef for UI components that need ref access

### API Integration
- All API calls go through `src/api/` layer
- Use React Query hooks for async operations
- Never hardcode API URLs
- Handle errors gracefully
- Set proper cache strategies

### State Management
- Use Zustand stores for global state
- Keep component state local when possible
- Use localStorage for persistence
- Clear auth state on logout

### Styling
- Use TailwindCSS utility classes
- No inline styles
- Responsive design with mobile-first approach
- Consistent color and spacing variables

## Testing

To add tests:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

## Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:5000`
- Check `.env` for correct `VITE_API_URL`
- Check browser console for CORS errors

### Login Issues
- Verify credentials with backend
- Check localStorage for token persistence
- Clear browser cache if needed

### Data Not Loading
- Check network tab for API responses
- Verify filters aren't too restrictive
- Check React Query DevTools (install to debug)

## License

Proprietary - All rights reserved
