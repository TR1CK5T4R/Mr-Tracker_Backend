const { GoogleGenAI } = require('@google/genai');
const Todo = require('../models/Todo');
const Habit = require('../models/Habit');

// @desc    Send message to Gemini chatbot
// @route   POST /api/chat
const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a message',
            });
        }

        // Check for Gemini API key
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey || geminiApiKey === 'your_gemini_api_key_here') {
            return res.status(200).json({
                success: true,
                reply: "I'm your task and habit assistant! However, the Gemini API key needs to be configured. Please add your free Gemini API key to the .env file to enable AI-powered suggestions. Get one free at https://aistudio.google.com/app/apikey",
            });
        }

        // Fetch current todos and habits for context
        const todos = await Todo.find();
        const habits = await Habit.find();

        // Build context for Gemini
        const todoContext = todos.length > 0
            ? `Current Todos:\n${todos.map(t => `- ${t.title} (${t.completed ? 'Done' : 'Pending'}, Priority: ${t.priority})`).join('\n')}`
            : 'No todos yet.';

        const habitContext = habits.length > 0
            ? `Current Habits:\n${habits.map(h => `- ${h.name} (Streak: ${h.streak} days, ${h.frequency})`).join('\n')}`
            : 'No habits tracked yet.';

        const systemContext = `You are a helpful assistant for managing todos and habits. 

${todoContext}

${habitContext}

Help the user organize their tasks, suggest improvements, and provide motivation for their habits. Be concise and friendly.`;

        // Initialize Gemini with new SDK (as per documentation)
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });

        // Send request using new format with Gemini 2.5
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-latest",
            contents: `${systemContext}\n\nUser: ${message}`,
        });

        const reply = response.text;

        console.log('✅ Gemini API Success!');

        res.status(200).json({
            success: true,
            reply: reply,
        });
    } catch (error) {
        console.error('Gemini API Error Details:');
        console.error('Error:', error.message);

        // Fallback response if Gemini API fails
        res.status(200).json({
            success: true,
            reply: "I'm here to help with your tasks and habits! However, I'm having trouble connecting to the AI service right now. Please check your Gemini API key configuration.",
        });
    }
};

module.exports = {
    sendMessage,
};
