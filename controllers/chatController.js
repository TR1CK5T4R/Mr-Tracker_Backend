const { GoogleGenerativeAI } = require('@google/generative-ai');
const Todo = require('../models/Todo');
const Habit = require('../models/Habit');
// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the generative model
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// @desc    Send message to chatbot using Gemini AI
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

        // Fetch current todos and habits for context
        const todos = await Todo.find();
        const habits = await Habit.find();

        // Analyze current state
        const totalTodos = todos.length;
        const completedTodos = todos.filter(t => t.completed).length;
        const pendingTodos = totalTodos - completedTodos;
        const highPriorityTodos = todos.filter(t => t.priority === 'high' && !t.completed).length;

        const totalHabits = habits.length;
        const activeStreaks = habits.filter(h => h.streak > 0).length;
        const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

        // Build context for Gemini
        let contextPrompt = `You are MrTracker AI, a helpful productivity assistant. Here's the user's current state:\n\n`;
        contextPrompt += `📊 Tasks: ${completedTodos}/${totalTodos} completed, ${pendingTodos} pending`;
        if (highPriorityTodos > 0) {
            contextPrompt += ` (${highPriorityTodos} high priority)\n`;
            const highPriorityList = todos
                .filter(t => t.priority === 'high' && !t.completed)
                .map(t => `- ${t.title}`)
                .join('\n');
            contextPrompt += `High Priority Tasks:\n${highPriorityList}\n`;
        } else {
            contextPrompt += `\n`;
        }

        if (totalHabits > 0) {
            contextPrompt += `\n🎯 Habits: ${totalHabits} tracked, longest streak: ${longestStreak} days\n`;
            const habitList = habits
                .map(h => `- ${h.name}: ${h.streak} day streak`)
                .join('\n');
            contextPrompt += `Habits:\n${habitList}\n`;
        }

        contextPrompt += `\nUser's question: ${message}\n\n`;
        contextPrompt += `Provide a helpful, encouraging response focused on productivity, task management, and habit building. Keep it concise and actionable. Use emojis where appropriate. Be motivational and supportive.`;

        // Generate response using Gemini
        const result = await model.generateContent(contextPrompt);
        const response = await result.response;
        const reply = response.text();

        res.status(200).json({
            success: true,
            reply: reply,
        });
    } catch (error) {
        console.error('Gemini API Error:', error.message);

        // Fallback response if Gemini fails
        res.status(200).json({
            success: true,
            reply: "I'm here to help! Ask me about your tasks, habits, or productivity tips! 😊 (Note: AI service temporarily unavailable)",
        });
    }
};

module.exports = {
    sendMessage,
};
