import axios from "axios";

export const analyzeFeedback = async (title, description) => {
  console.log("Gemini function triggered");
  try {
    const prompt = `
Analyse this product feedback.

Return ONLY valid JSON like this:
{
  "category": "Bug | Feature Request | Improvement | Other",
  "sentiment": "Positive | Neutral | Negative",
  "priority_score": number (1-10),
  "summary": "short summary",
  "tags": ["tag1", "tag2"]
}

Title: ${title}
Description: ${description}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;

    console.log("Gemini raw response:", text);

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);

    return JSON.parse(jsonString);

  } catch (err) {
    console.log("Gemini error:", err.response?.data || err.message);
    return null;
  }
};