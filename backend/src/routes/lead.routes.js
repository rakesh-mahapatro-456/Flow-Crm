// POST /leads → create lead
// GET /leads → list with pagination & filters
// GET /leads/:id → fetch single lead
// PUT /leads/:id → update lead
// DELETE /leads/:id → delete lead
import {Router} from 'express';
import {authMiddleware} from '../middlewares/auth.middleware.js';
import wrapAsync from '../middlewares/wrapAsync.middleware.js';
import {createLead,getLead,getLeadById,updateLead,deleteLead} from "../controllers/lead.controllers.js";

const router  = Router();
router.post("/",authMiddleware,wrapAsync(createLead));
router.get("/",authMiddleware,wrapAsync(getLead));
router.get("/:id",authMiddleware,wrapAsync(getLeadById));
router.put("/:id",authMiddleware,wrapAsync(updateLead));
router.delete("/:id",authMiddleware,wrapAsync(deleteLead));

export default router;