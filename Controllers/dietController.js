const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI client with your API key
// IMPORTANT: Make sure to add your GEMINI_API_KEY to your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateDietPlan = async (req, res) => {
    try {
        const { age, weight, height, goal, diet_preference } = req.body;

        // Basic validation
        if (!age || !weight || !height || !goal || !diet_preference) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        // 1. Construct a detailed prompt for the AI
        const prompt = `
            Create a detailed 7-day diet plan for a person with the following details:
            - Age: ${age} years
            - Weight: ${weight} kg
            - Height: ${height} cm
            - Fitness Goal: ${goal.replace('_', ' ')}
            - Dietary Preference: ${diet_preference}

            The diet plan should include:
            1.  Three main meals (Breakfast, Lunch, Dinner) and two snacks (Mid-Morning, Evening) for each of the 7 days.
            2.  Approximate portion sizes for each meal item.
            3.  A brief summary of the total estimated daily calories and macronutrient distribution (protein, carbs, fats).
            4.  General hydration advice (e.g., how much water to drink).
            5.  Format the response clearly with headings for each day. Do not include any introductory or concluding sentences outside of the diet plan itself.
        `;

        // 2. Call the Gemini API with the updated model name
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // CORRECTED MODEL NAME
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const dietPlanText = response.text();

        // 3. Send the generated plan back to the frontend
        res.status(200).json({ dietPlan: dietPlanText });

    } catch (error) {
        console.error("Error generating diet plan:", error);
        res.status(500).json({ message: "Failed to generate diet plan due to a server error." });
    }
};
