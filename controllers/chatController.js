const Todo = require('../models/Todo');
const Habit = require('../models/Habit');

// Smart local chatbot (no external API needed)
const generateSmartReply = (message, todos, habits) => {
    const msgLower = message.toLowerCase();

    // Analyze current state
    const totalTodos = todos.length;
    const completedTodos = todos.filter(t => t.completed).length;
    const pendingTodos = totalTodos - completedTodos;
    const highPriorityTodos = todos.filter(t => t.priority === 'high' && !t.completed).length;

    const totalHabits = habits.length;
    const activeStreaks = habits.filter(h => h.streak > 0).length;
    const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

    // Pattern matching for responses
    if (msgLower.includes('hello') || msgLower.includes('hi') || msgLower.includes('hey')) {
        return `Hey! 👋 You have ${pendingTodos} pending tasks and ${activeStreaks} active habit streaks. How can I help you stay organized today?`;
    }

    if (msgLower.includes('summary') || msgLower.includes('overview') || msgLower.includes('status')) {
        let summary = `📊 **Your Overview:**\n\n`;
        summary += `**Tasks:** ${completedTodos}/${totalTodos} completed`;
        if (highPriorityTodos > 0) summary += ` (${highPriorityTodos} high priority remaining)`;
        summary += `\n**Habits:** ${totalHabits} tracked, longest streak: ${longestStreak} days`;
        summary += `\n\n${pendingTodos === 0 ? '🎉 All tasks done! Great work!' : '💪 Keep going!'}`;
        return summary;
    }

    if (msgLower.includes('motivat') || msgLower.includes('encourage')) {
        const motivations = [
            `You've completed ${completedTodos} tasks already! Keep that momentum going! 💪`,
            `${longestStreak} day streak on your habits? That's dedication! 🔥`,
            `Every task you complete is progress. You've got this! 🌟`,
            `Small steps lead to big changes. Keep building those habits! 🚀`
        ];
        return motivations[Math.floor(Math.random() * motivations.length)];
    }

    if (msgLower.includes('priority') || msgLower.includes('important')) {
        if (highPriorityTodos > 0) {
            const highPriorityList = todos
                .filter(t => t.priority === 'high' && !t.completed)
                .map(t => `• ${t.title}`)
                .join('\n');
            return `🔴 **High Priority Tasks (${highPriorityTodos}):**\n${highPriorityList}\n\nFocus on these first for maximum impact!`;
        }
        return `✅ No high-priority tasks right now! Great job staying on top of things!`;
    }

    if (msgLower.includes('habit') || msgLower.includes('streak')) {
        if (totalHabits === 0) {
            return `No habits tracked yet! Start building positive habits - consistency is key! 🎯`;
        }
        const habitList = habits
            .map(h => `• ${h.name}: ${h.streak} day streak ${h.streak > 0 ? '🔥' : ''}`)
            .join('\n');
        return `**Your Habits:**\n${habitList}\n\nKeep showing up every day!`;
    }

    if (msgLower.includes('tip') || msgLower.includes('advice') || msgLower.includes('suggest')) {
        const tips = [
            `💡 Break large tasks into smaller ones - they're easier to complete!`,
            `⏰ Try the Pomodoro technique: 25 min focused work, 5 min break.`,
            `🎯 Tackle your hardest task first thing - you'll feel accomplished all day!`,
            `📝 Review your progress weekly to stay motivated and adjust goals.`,
            `🔄 Build habits by linking them to existing routines (habit stacking).`
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    if (msgLower.includes('help')) {
        return `I can help you with:\n• Overview/summary of your tasks and habits\n• Motivation and encouragement\n• Tips for productivity\n• Priority task recommendations\n\nJust ask me anything! 😊`;
    }

    // Default intelligent response
    if (pendingTodos > 5) {
        return `I see you have ${pendingTodos} pending tasks. Consider focusing on high-priority items first, or break large tasks into smaller steps. You've got this! 💪`;
    } else if (pendingTodos > 0) {
        return `You're doing great! ${pendingTodos} tasks to go. ${highPriorityTodos > 0 ? 'Focus on the high-priority ones first!' : 'Keep that momentum going!'} 🚀`;
    } else {
        return `All tasks completed! 🎉 Time to ${totalHabits > 0 ? 'work on your habits or ' : ''}add new goals. Keep crushing it!`;
    }
};

// @desc    Send message to chatbot
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

        // Generate smart reply
        const reply = generateSmartReply(message, todos, habits);

        res.status(200).json({
            success: true,
            reply: reply,
        });
    } catch (error) {
        console.error('Chatbot Error:', error.message);
        res.status(200).json({
            success: true,
            reply: "I'm here to help! Ask me about your tasks, habits, or productivity tips! 😊",
        });
    }
};

module.exports = {
    sendMessage,
};
