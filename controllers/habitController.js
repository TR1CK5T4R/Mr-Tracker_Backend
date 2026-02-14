const Habit = require('../models/Habit');

// @desc    Get all habits
// @route   GET /api/habits
const getAllHabits = async (req, res) => {
    try {
        const habits = await Habit.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: habits.length,
            data: habits,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
};

// @desc    Create new habit
// @route   POST /api/habits
const createHabit = async (req, res) => {
    try {
        const habit = await Habit.create(req.body);
        res.status(201).json({
            success: true,
            data: habit,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
const updateHabit = async (req, res) => {
    try {
        const habit = await Habit.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!habit) {
            return res.status(404).json({
                success: false,
                error: 'Habit not found',
            });
        }

        res.status(200).json({
            success: true,
            data: habit,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
const deleteHabit = async (req, res) => {
    try {
        const habit = await Habit.findByIdAndDelete(req.params.id);

        if (!habit) {
            return res.status(404).json({
                success: false,
                error: 'Habit not found',
            });
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Check in for a habit
// @route   POST /api/habits/:id/checkin
const checkIn = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);

        if (!habit) {
            return res.status(404).json({
                success: false,
                error: 'Habit not found',
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already checked in today
        const alreadyCheckedIn = habit.completions.some(completion => {
            const completionDate = new Date(completion.date);
            completionDate.setHours(0, 0, 0, 0);
            return completionDate.getTime() === today.getTime();
        });

        if (alreadyCheckedIn) {
            return res.status(400).json({
                success: false,
                error: 'Already checked in today',
            });
        }

        // Add new completion
        habit.completions.push({
            date: today,
            completed: true,
        });

        // Update streak
        const lastCheckIn = habit.lastCheckIn ? new Date(habit.lastCheckIn) : null;
        if (lastCheckIn) {
            lastCheckIn.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastCheckIn.getTime() === yesterday.getTime()) {
                // Consecutive day - increment streak
                habit.streak += 1;
            } else if (lastCheckIn.getTime() !== today.getTime()) {
                // Not consecutive - reset streak
                habit.streak = 1;
            }
        } else {
            // First check-in
            habit.streak = 1;
        }

        habit.lastCheckIn = today;
        await habit.save();

        res.status(200).json({
            success: true,
            data: habit,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get habit statistics
// @route   GET /api/habits/:id/stats
const getStats = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);

        if (!habit) {
            return res.status(404).json({
                success: false,
                error: 'Habit not found',
            });
        }

        const stats = {
            name: habit.name,
            streak: habit.streak,
            totalCompletions: habit.completions.length,
            completionRate: habit.getCompletionRate(),
            lastCheckIn: habit.lastCheckIn,
        };

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

module.exports = {
    getAllHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    checkIn,
    getStats,
};
