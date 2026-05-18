
import z from "zod";

// lead validators to ensure that the data sent by the client is valid and meets the required criteria for lead-related operations.

export const createLeadSchema = z.object({
    name: z.string().min(2, "name must be atleast 2 characters long"),
    email: z.string().email("Invalid email").toLowerCase(),
    phone: z.string().optional(),
    company: z.string().optional(),
    status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
    source: z.enum(['website', 'email', 'referral', 'social', 'event', 'advertisement', 'other']).optional(),
    notes: z.string().optional(),
    value: z.number().nonnegative().optional(),
    assignedTo: z.string().optional()
});

export const updateLeadSchema = z.object({
    name: z.string().min(2, "name must be atleast 2 characters long").optional(),
    email: z.string().email("Invalid email").toLowerCase().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
    source: z.enum(['website', 'email', 'referral', 'social', 'event', 'advertisement', 'other']).optional(),
    notes: z.string().optional(),
    value: z.number().nonnegative().optional(),
    assignedTo: z.string().optional()
});
