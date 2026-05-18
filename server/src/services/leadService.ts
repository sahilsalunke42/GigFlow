import { Request, Response } from "express";
import { Types } from "mongoose";
import Lead, { LeadStatus, LeadSource } from "../models/leadModel";
import { createLeadSchema, updateLeadSchema } from "../validators/leadValidator";

export const createLead = async (req: Request, res: Response) => {
    try {
        const { name, email, status, source } = createLeadSchema.parse(req.body);
        const createdBy = req.user?.user.id;

        if (!createdBy) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const lead = await Lead.create({
            name, 
            email, 
            status: (status as LeadStatus) || LeadStatus.New,
            source: (source as LeadSource) || LeadSource.Website,
            createdBy: new Types.ObjectId(createdBy)
        } as Parameters<typeof Lead.create>[0]);
        res.status(201).json(lead);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create lead" });
    }
};

export const getLeads = async (req: Request, res: Response) => {
    try {
        const leads = await Lead.find();
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch leads" });
    }
};

export const getLeadById = async (req: Request, res: Response) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.json(lead);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch lead" });
    }
};

export const updateLead = async (req: Request, res: Response) => {
    try {
        const { name, email, status, source } = updateLeadSchema.parse(req.body);
        const lead = await Lead.findByIdAndUpdate(req.params.id, { name, email, status, source }, { new: true });   
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
