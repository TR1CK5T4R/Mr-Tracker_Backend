const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a habit name'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly'],
        default: 'daily',
    },
    streak: {
        type: Number,
        default: 0,
    },
    completions: [{
        date: {
            type: Date,
            required: true,
        },
        completed: {
            type: Boolean,
            default: true,
        },
    }],
    lastCheckIn: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Method to calculate completion rate
habitSchema.methods.getCompletionRate = function () {
    if (this.completions.length === 0) return 0;
    const completed = this.completions.filter(c => c.completed).length;
    return Math.round((completed / this.completions.length) * 100);
};

module.exports = mongoose.model('Habit', habitSchema);
