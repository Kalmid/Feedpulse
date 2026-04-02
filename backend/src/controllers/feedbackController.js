import Feedback from "../models/feedbackModel.js";
import { analyzeFeedback } from "../services/geminiService.js";


export const createFeedback = async (req, res) => {
  try {
    const { title, description, category, name, email } = req.body;

    // validation
    if (!title || description.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Invalid input"
      });
    }

    const feedback = await Feedback.create({
      title,
      description,
      category,
      submitterName: name,
      submitterEmail: email
    });

    // call Gemini AI
    console.log("Calling Gemini...");
    const aiResult = await analyzeFeedback(title, description);
    console.log("AI RESULT:", aiResult);

    if (aiResult) {
      feedback.ai_category = aiResult.category;
      feedback.ai_sentiment = aiResult.sentiment;
      feedback.ai_priority = aiResult.priority_score;
      feedback.ai_summary = aiResult.summary;
      feedback.ai_tags = aiResult.tags;
      feedback.ai_processed = true;

      await feedback.save();
    }

    res.status(201).json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// GET all feedbacks
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, data: feedbacks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single feedback by ID
export const getSingleFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.json({ success: true, data: feedback });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update feedback 
export const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body; // New status: "New", "In Review", "Resolved"
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    feedback.status = status;
    await feedback.save();
    res.json({ success: true, data: feedback });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a feedback
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    await feedback.deleteOne();
    res.json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// AI-generated trend summary 
export const getAITrendSummary = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentFeedbacks = await Feedback.find({ createdAt: { $gte: sevenDaysAgo } });

    // Count tags
    const tagCounts = {};
    recentFeedbacks.forEach(fb => {
      if (fb.ai_tags) {
        fb.ai_tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // Sort by count
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag, count]) => tag);

    res.json({
      success: true,
      data: {
        topThemes: topTags,
        totalFeedbacks: recentFeedbacks.length
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};