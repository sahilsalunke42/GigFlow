import { createLead, getLeads, getLeadById, updateLead, deleteLead } from "../services/leadService";
import { exportLeads } from "../services/leadService";

export const leadController = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    exportLeads
};