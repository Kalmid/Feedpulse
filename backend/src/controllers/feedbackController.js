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