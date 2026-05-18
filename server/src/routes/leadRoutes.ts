import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createLead, deleteLead, getLeadById, getLeads, updateLead } from "../services/leadService";

const router = Router();

router.use(authMiddleware);

router.post("/", createLead);
router.get("/", getLeads);
router.get("/:id", getLeadById);
router.patch("/:id", updateLead);
router.delete("/:id", deleteLead);

export default router;
