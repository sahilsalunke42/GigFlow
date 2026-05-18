import { createLead, getLeads, getLeadById, updateLead, deleteLead } from "../services/leadService";
import { exportLeads, bulkDeleteLeads } from "../services/leadService";

export const leadController = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    exportLeads,
    bulkDeleteLeads
};