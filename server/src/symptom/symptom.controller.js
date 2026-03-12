import { GoogleGenerativeAI } from "@google/generative-ai";
import ConsultRequest from "../models/consultRequest.model.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export const analyzeSymptoms = async (req, res) => {
  try {
    const { age, gender, duration, severity, symptoms, notes, language } = req.body;
    
    // Fallback if no real key provided
    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY set. Returning mock response.");
    }
    
    let aiResponseText = "";
    const prompt = `
      You are a friendly medical assistant. A patient has the following profile:
      Age: ${age}, Gender: ${gender}, Symptoms: ${symptoms.join(", ")}, Duration: ${duration}, Severity: ${severity}, Notes: ${notes}.
      
      Respond in ${language === 'hi' ? 'Hindi' : 'English'} in a simple, human-like way.
      Do not use complex medical terms without explaining them simply.
      Give a brief idea of what the issue could be. Tell them a doctor will connect with them shortly.
    `;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      aiResponseText = response.text();
    } catch(err) {
      console.error("Gemini AI API Error:", err.message);
      aiResponseText = language === 'hi' 
        ? "ऐसा लगता है कि आपको कुछ आम स्वास्थ्य समस्याएं हो सकती हैं। कृपया डॉक्टर के जुड़ने का इंतजार करें।" 
        : "It seems like you might be experiencing some common health issues. Please wait for a doctor to connect with you.";
    }

    // Create a consult request for the patient
    const request = await ConsultRequest.create({
      patientId: req.user.id,
      type: "instant",
      symptomSummary: symptoms.join(", ") + (notes ? ` - ${notes}` : ""),
      status: "pending"
    });

    res.json({
      success: true,
      analysis: aiResponseText,
      requestId: request._id
    });
  } catch (error) {
    console.error("Analyze Symptoms Error:", error);
    res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
};
