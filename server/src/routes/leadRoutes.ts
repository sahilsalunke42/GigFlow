import { leadController } from "../controllers/leadController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { leadOwnershipMiddleware } from "../middlewares/leadOwnershipMiddleware";
import { Router } from "express";

const router = Router();

router.post("/", authMiddleware, leadController.createLead);
router.get("/export", authMiddleware, leadController.exportLeads);
router.post("/bulk-delete", authMiddleware, leadController.bulkDeleteLeads);
router.get("/", authMiddleware, leadController.getLeads);
router.get("/:id", authMiddleware, leadController.getLeadById);
router.put("/:id", authMiddleware, leadOwnershipMiddleware, leadController.updateLead);
router.delete("/:id", authMiddleware, leadOwnershipMiddleware, leadController.deleteLead);

export default router;