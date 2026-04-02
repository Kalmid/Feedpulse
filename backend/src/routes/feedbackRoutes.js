import express from "express";
import { createFeedback, getAllFeedback, getSingleFeedback, updateFeedbackStatus, deleteFeedback, getAITrendSummary } from "../controllers/feedbackController.js";

import { adminLogin } from "../controllers/authController.js";

const router = express.Router();

//POST new feedback
router.post("/", createFeedback);

// GET all feedback 
router.get("/", getAllFeedback);

// GET single feedback
router.get("/:id", getSingleFeedback);

// PUT feedback
router.put("/:id", updateFeedbackStatus);

// DELETE feedback
router.delete("/:id", deleteFeedback);

// AI-generated trend summary
router.get("/summary", getAITrendSummary);

// Admin login
router.post("/auth/login", adminLogin);


export default router;