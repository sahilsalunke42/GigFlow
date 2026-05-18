import { Request, Response } from "express";
import { Types } from "mongoose";
import Lead, { LeadStatus, LeadSource } from "../models/leadModel";
import { createLeadSchema, updateLeadSchema } from "../validators/leadValidator";
// Import to load type augmentation from auth middleware
import "../middlewares/authMiddleware";

const formatLeadResponse = (lead: any) => {
    const leadObject = typeof lead.toJSON === "function" ? lead.toJSON() : lead;
    const assignedToData = leadObject.assignedTo;

    if (assignedToData && typeof assignedToData === "object") {
        return {
            ...leadObject,
            assignedTo: assignedToData.id || assignedToData._id?.toString(),
            assignedToName: assignedToData.name || null,
        };
    }

    return {
        ...leadObject,
        assignedToName: null,
    };
};

export const createLead = async (req: Request, res: Response) => {
    try {
        const data = createLeadSchema.parse(req.body);
        const createdBy = req.user?.user.id;

        if (!createdBy) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const leadData: any = {
            name: data.name,
            email: data.email,
            status: (data.status as LeadStatus) || LeadStatus.New,
            source: (data.source as LeadSource) || LeadSource.Website,
            createdBy: new Types.ObjectId(createdBy)
        };
        
        // Add optional fields if provided
        if (data.phone) leadData.phone = data.phone;
        if (data.company) leadData.company = data.company;
        if (data.notes) leadData.notes = data.notes;
        if (data.value !== undefined) leadData.value = data.value;
        if (data.assignedTo) leadData.assignedTo = new Types.ObjectId(data.assignedTo);

        const lead = await Lead.create(leadData);
        res.status(201).json(lead);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create lead" });
    }
};

export const getLeads = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        
        // Build filter query
        const filter: any = {};
        
        // Search by name or email
        if (req.query.search) {
            const searchTerm = req.query.search as string;
            filter.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        
        // Filter by status
        if (req.query.status) {
            const statuses = Array.isArray(req.query.status) 
                ? req.query.status 
                : [req.query.status];
            filter.status = { $in: statuses };
        }
        
        // Filter by source
        if (req.query.source) {
            const sources = Array.isArray(req.query.source) 
                ? req.query.source 
                : [req.query.source];
            filter.source = { $in: sources };
        }
        
        // Build sort query
        let sortBy = (req.query.sortBy as string) || 'createdAt';
        let sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        // Support a shorthand `sort` query param: 'latest' or 'oldest'
        const sortParam = (req.query.sort as string)?.toLowerCase();
        if (sortParam === 'latest') {
            sortBy = 'createdAt';
            sortOrder = -1; // newest first
        } else if (sortParam === 'oldest') {
            sortBy = 'createdAt';
            sortOrder = 1; // oldest first
        }

        const sort: any = {};
        sort[sortBy] = sortOrder;
        
        // Execute query
        const leads = await Lead.find(filter)
            .populate("assignedTo", "_id name email role")
            .sort(sort)
            .skip(skip)
            .limit(limit);
        
        const total = await Lead.countDocuments(filter);
        const pages = Math.ceil(total / limit);
        
        res.json({
            data: leads.map(formatLeadResponse),
            pagination: {
                total,
                page,
                limit,
                pages
            }
        });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch leads" });
    }
};

export const getLeadById = async (req: Request, res: Response) => {
    try {
        const lead = await Lead.findById(req.params.id).populate("assignedTo", "_id name email role");
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.json(formatLeadResponse(lead));
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch lead" });
    }
};

export const updateLead = async (req: Request, res: Response) => {
    try {
        const data = updateLeadSchema.parse(req.body);
        const updateData: any = { ...data };
        
        // Convert assignedTo to ObjectId if provided
        if (data.assignedTo) {
            updateData.assignedTo = new Types.ObjectId(data.assignedTo);
        }
        
        // Convert status and source to proper enum values
        if (data.status) {
            updateData.status = data.status as LeadStatus;
        }
        if (data.source) {
            updateData.source = data.source as LeadSource;
        }
        
        const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, { new: true });   
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.json(lead);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : "Failed to update lead" });
    }
};

export const deleteLead = async (req: Request, res: Response) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.json({ message: "Lead deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete lead" });
    }
};

export const exportLeads = async (req: Request, res: Response) => {
    try {
        const leads = await Lead.find();
        
        // Create CSV headers
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Status', 'Source', 'Notes', 'Value', 'Created At', 'Updated At'];
        
        // Create CSV rows
        const rows = leads.map(lead => [
            lead._id.toString(),
            lead.name,
            lead.email,
            lead.phone || '',
            lead.company || '',
            lead.status,
            lead.source,
            lead.notes || '',
            lead.value || 0,
            lead.createdAt?.toISOString() || '',
            lead.updatedAt?.toISOString() || ''
        ]);
        
        // Combine headers and rows
        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');
        
        // Set response headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="leads-export.csv"');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to export leads" });
    }
};
