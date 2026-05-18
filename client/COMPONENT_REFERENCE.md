# Component Reference Guide

## UI Components (Reusable)

### Button
- Location: `src/components/common/Button.tsx`
- Props: variant, size, isLoading, fullWidth, disabled
- Variants: primary, secondary, danger, success, outline
- Sizes: sm, md, lg
- Example:
  ```tsx
  <Button variant="primary" size="md" onClick={handleClick}>
    Click Me
  </Button>
  ```

### Input
- Location: `src/components/common/Input.tsx`
- Props: label, error, helperText, size
- Supports all HTML input attributes
- Example:
  ```tsx
  <Input
    label="Email"
    type="email"
    error={errors.email?.message}
    {...register('email')}
  />
  ```

### Select
- Location: `src/components/common/Select.tsx`
- Props: label, options, error, helperText
- Example:
  ```tsx
  <Select
    label="Status"
    options={LEAD_STATUS_OPTIONS}
    {...register('status')}
  />
  ```

### Modal
- Location: `src/components/common/Modal.tsx`
- Props: isOpen, onClose, title, children, size
- Sizes: sm, md, lg, xl
- Example:
  ```tsx
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Modal Title"
    size="md"
  >
    <p>Modal content here</p>
  </Modal>
  ```

### Loader
- Location: `src/components/common/Loader.tsx`
- Props: size, fullHeight
- Sizes: sm, md, lg
- Example:
  ```tsx
  <Loader size="md" fullHeight={false} />
  ```

### Pagination
- Location: `src/components/common/Pagination.tsx`
- Props: currentPage, totalPages, onPageChange, isLoading
- Example:
  ```tsx
  <Pagination
    currentPage={page}
    totalPages={totalPages}
    onPageChange={setPage}
  />
  ```

### Table
- Location: `src/components/common/Table.tsx`
- Generic table component for any data type
- Requires columns array and data array
- Example:
  ```tsx
  <Table
    columns={columns}
    data={leads}
    onRowClick={handleRowClick}
  />
  ```

### EmptyState
- Location: `src/components/common/EmptyState.tsx`
- Props: title, description, icon, action
- Example:
  ```tsx
  <EmptyState
    title="No leads found"
    description="Create your first lead"
    action={{ label: 'Create', onClick: handleCreate }}
  />
  ```

### ErrorState
- Location: `src/components/common/ErrorState.tsx`
- Props: title, description, action
- Example:
  ```tsx
  <ErrorState
    title="Failed to load"
    action={{ label: 'Retry', onClick: handleRetry }}
  />
  ```

---

## Layout Components

### Header
- Location: `src/components/layout/Header.tsx`
- Displays: Logo, User name, Logout button
- Props: onMenuClick (for mobile sidebar)
- Used in: MainLayout

### Sidebar
- Location: `src/components/layout/Sidebar.tsx`
- Displays: Navigation menu
- Props: isOpen, onClose
- Responsive: Mobile drawer on small screens
- Used in: MainLayout

### MainLayout
- Location: `src/layouts/MainLayout.tsx`
- Combines: Header + Sidebar + Main content
- Props: children (page content)
- Used in: All authenticated pages

---

## Auth Components

### LoginForm
- Location: `src/components/auth/LoginForm.tsx`
- Fields: email, password
- Validation: Zod schema
- Used in: LoginPage

### RegisterForm
- Location: `src/components/auth/RegisterForm.tsx`
- Fields: name, email, password, confirmPassword
- Validation: Zod schema with password matching
- Used in: RegisterPage

---

## Leads Components

### LeadsTable
- Location: `src/components/leads/LeadsTable.tsx`
- Displays: Paginated leads with status badges
- Actions: Edit, Delete, View
- Status colors: Based on lead status
- Example usage:
  ```tsx
  <LeadsTable
    leads={leads}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />
  ```

### LeadForm
- Location: `src/components/leads/LeadForm.tsx`
- Fields: name, email, phone, company, source, notes, value
- Validation: Zod schema
- Supports: Create and Edit modes
- Example usage:
  ```tsx
  <LeadForm
    onSubmit={handleSubmit}
    initialData={lead}
    isLoading={isLoading}
  />
  ```

### LeadFilters
- Location: `src/components/leads/LeadFilters.tsx`
- Features:
  - Debounced search
  - Status filter (multiple)
  - Source filter (multiple)
  - Clear filters button
  - Active filter badge count
- Example usage:
  ```tsx
  <LeadFilters
    onSearch={setSearch}
    onStatusChange={setStatus}
    onSourceChange={setSource}
    onExport={handleExport}
  />
  ```

---

## Page Components

### LoginPage
- Location: `src/pages/auth/LoginPage.tsx`
- Displays: LoginForm with branding
- Route: `/login`
- Access: Public (redirects if authenticated)

### RegisterPage
- Location: `src/pages/auth/RegisterPage.tsx`
- Displays: RegisterForm with branding
- Route: `/register`
- Access: Public (redirects if authenticated)

### DashboardPage
- Location: `src/pages/dashboard/DashboardPage.tsx`
- Displays:
  - Stat cards (total leads, new leads, conversions, value)
  - Recent activity summary
- Route: `/dashboard`
- Access: Protected (requires auth)

### LeadsPage
- Location: `src/pages/dashboard/LeadsPage.tsx`
- Displays:
  - Leads management header
  - Filters and search
  - Leads table or empty state
  - Pagination
  - Modals for create/edit/delete
- Route: `/leads`
- Access: Protected (requires auth)
- Features: CRUD operations for leads

---

## Hooks

### useAuth.ts
**useLogin()**
- Returns: { mutate, isPending, error }
- Usage: Login users

**useRegister()**
- Returns: { mutate, isPending, error }
- Usage: Register new users

**useLogout()**
- Returns: { mutate, isPending }
- Usage: Logout users

**useCurrentUser()**
- Returns: { user, isAuthenticated, error, loading, refetch }
- Usage: Get current user info

### useLeads.ts
**useLeads(filters)**
- Returns: { data, isLoading, error, isFetching }
- Usage: Fetch paginated leads with filters

**useLead(id)**
- Returns: { data, isLoading, error }
- Usage: Fetch single lead details

**useCreateLead()**
- Returns: { mutate, isPending, error }
- Usage: Create new lead

**useUpdateLead()**
- Returns: { mutate, isPending, error }
- Usage: Update existing lead

**useDeleteLead()**
- Returns: { mutate, isPending, error }
- Usage: Delete lead

**useExportLeads()**
- Returns: { mutate, isPending }
- Usage: Export leads to CSV

### useHelpers.ts
**useDebounce(value, delayMs)**
- Returns: debouncedValue
- Usage: Debounce values for search

**useLocalStorage(key, initialValue)**
- Returns: [value, setValue]
- Usage: Persist data to localStorage

**usePrevious(value)**
- Returns: previousValue
- Usage: Track previous value

---

## Custom Types

### Auth Types (src/types/auth.ts)
```typescript
type UserRole = 'admin' | 'user' | 'manager'
interface User { id, email, name, role, createdAt, updatedAt }
interface AuthResponse { token, user }
interface LoginRequest { email, password }
interface RegisterRequest { name, email, password, confirmPassword }
```

### Leads Types (src/types/leads.ts)
```typescript
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
type LeadSource = 'website' | 'email' | 'referral' | 'social' | 'event' | 'other'
interface Lead { id, name, email, phone, company, status, source, notes, value, createdAt }
interface CreateLeadRequest { name, email, phone, company, source, notes, value }
interface UpdateLeadRequest { ... same as CreateLeadRequest (partial) }
interface LeadFilter { status, source, search, sortBy, sortOrder, page, limit }
interface PaginatedResponse<T> { data, total, page, limit, pages }
```

---

## State Stores

### authStore (Zustand)
- Properties: user, token, isAuthenticated
- Methods:
  - setUser(user)
  - setToken(token)
  - login(user, token)
  - logout()
  - hydrateFromStorage()
- Persisted: Yes (localStorage)

### leadsStore (Zustand)
- Properties: filters (search, status, source, page, limit, sortBy, sortOrder)
- Methods:
  - setFilters(filters)
  - resetFilters()
  - setSearch(search)
  - setPage(page)
  - setStatus(status[])
  - setSource(source[])
  - setSortBy(sortBy)
  - setSortOrder(sortOrder)

---

## API Services

### authApi (src/api/auth.ts)
- `login(data: LoginRequest)` → Promise<AuthResponse>
- `register(data: RegisterRequest)` → Promise<AuthResponse>
- `logout()` → Promise<void>
- `refreshToken()` → Promise<AuthResponse>
- `getCurrentUser()` → Promise<AuthResponse>

### leadsApi (src/api/leads.ts)
- `getLeads(filters: LeadFilter)` → Promise<LeadsResponse>
- `getLeadById(id: string)` → Promise<Lead>
- `createLead(data: CreateLeadRequest)` → Promise<Lead>
- `updateLead(id: string, data: UpdateLeadRequest)` → Promise<Lead>
- `deleteLead(id: string)` → Promise<void>
- `bulkDeleteLeads(ids: string[])` → Promise<void>
- `exportLeads(filters: LeadFilter)` → Promise<Blob>

---

## Constants (src/utils/constants.ts)
- `API_BASE_URL` - Backend API URL
- `TOKEN_KEY` - localStorage key for auth token
- `USER_KEY` - localStorage key for user data
- `LEAD_STATUS_OPTIONS` - Status filter options
- `LEAD_SOURCE_OPTIONS` - Source filter options
- `ITEMS_PER_PAGE` - Pagination limit
- `DEFAULT_PAGINATION` - Default page and limit

---

## Utility Functions (src/utils)

### helpers.ts
- `formatDate(date)` → formatted date string
- `formatDateTime(date)` → formatted datetime string
- `formatCurrency(value)` → formatted currency string
- `capitalizeString(str)` → capitalized string
- `getInitials(name)` → user initials
- `truncateString(str, maxLength)` → truncated string
- `isValidEmail(email)` → boolean
- `isValidPhone(phone)` → boolean
- `delay(ms)` → Promise
- `debounce(fn, delayMs)` → debounced function
- `throttle(fn, delayMs)` → throttled function

### csv.ts
- `generateCSVContent(leads)` → CSV string
- `downloadCSV(content, filename)` → void
- `exportLeadsToCSV(leads, filename)` → void

---

## Routes

| Path | Component | Access | Purpose |
|------|-----------|--------|---------|
| `/` | Dashboard | Protected | Redirect to dashboard |
| `/login` | LoginPage | Public | User login |
| `/register` | RegisterPage | Public | User registration |
| `/dashboard` | DashboardPage | Protected | Dashboard overview |
| `/leads` | LeadsPage | Protected | Leads management |
| `*` | Dashboard | All | 404 redirect to dashboard |

---

## Component Hierarchy

```
App
├── BrowserRouter
├── QueryClientProvider
├── Routes
│   ├── LoginPage (PublicRoute)
│   ├── RegisterPage (PublicRoute)
│   ├── DashboardPage (ProtectedRoute)
│   │   └── MainLayout
│   │       ├── Header
│   │       ├── Sidebar
│   │       └── Dashboard content
│   └── LeadsPage (ProtectedRoute)
│       └── MainLayout
│           ├── Header
│           ├── Sidebar
│           └── LeadsPage content
│               ├── LeadFilters
│               ├── LeadsTable
│               ├── Pagination
│               └── Modals (Create, Edit, Delete)
```

---

## Key Integration Points

1. **Authentication Flow**
   - LoginPage → useLogin → authStore → MainLayout

2. **Leads Management Flow**
   - LeadsPage → useLeads → LeadsTable → (Create/Edit/Delete Modals)

3. **Filtering Flow**
   - LeadFilters → leadsStore → useLeads → LeadsTable

4. **Export Flow**
   - LeadFilters → useExportLeads → exportLeadsToCSV

---

**Component Reference Complete** ✅
