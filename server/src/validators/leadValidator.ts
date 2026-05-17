
import z from "zod";

// lead validators to ensure that the data sent by the client is valid and meets the required criteria for lead-related operations.

export const createleadSchema = z.object({
    name: z.string().min(2, "name must be atleast 2 characters long"),
    email: z.string().email("Invalid email").toLowerCase(),
    status: z.enum(['new', 'contacted', 'qualified', 'lost']).optional(),
    source: z.enum(['website', 'referral', 'advertisement', 'other']).optional()
});

export const updateLeadSchema = z.object({
    name: z.string().min(2, "name must be atleast 2 characters long").optional(),
    email: z.string().email("Invalid email").toLowerCase().optional(),
    status: z.enum(['new', 'contacted', 'qualified', 'lost']).optional(),
    source: z.enum(['website', 'referral', 'advertisement', 'other']).optional()
});
