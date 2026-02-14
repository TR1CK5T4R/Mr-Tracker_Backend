require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const todoRoutes = require('./routes/todoRoutes');
const habitRoutes = require('./routes/habitRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Configure CORS for production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://your-frontend-domain.com'
        : 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/chat', chatRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({
        message: 'MrTracker Backend API',
        version: '1.0.0',
        endpoints: {
            todos: '/api/todos',
            habits: '/api/habits',
            chat: '/api/chat',
        },
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
