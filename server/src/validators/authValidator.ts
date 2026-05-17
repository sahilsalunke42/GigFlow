// validators to ensure that the data sent by the client is valid and meets the required criteria for authentication-related operations.
import { z } from 'zod';

// Validation schema for user registration
export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['admin', 'sales']).optional()
});

// Validation schema for user login
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
});
