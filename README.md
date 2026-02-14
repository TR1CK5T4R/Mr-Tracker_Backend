# MrTracker Backend

Simple Node.js backend for MrTracker - A todo list and habit tracker with AI chatbot assistance.

## Features

- ✅ **Todo List**: Full CRUD operations for managing tasks
- 🎯 **Habit Tracker**: Daily check-ins with streak tracking  
- 🤖 **AI Chatbot**: Grok-powered assistant for task and habit suggestions

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI**: Grok API integration
- **Middleware**: CORS, dotenv

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Grok API key (optional for chatbot functionality)

## Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update the values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mrtracker
   GROK_API_KEY=your_actual_grok_api_key
   NODE_ENV=development
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Todos

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create new todo
  ```json
  {
    "title": "Complete project",
    "description": "Finish the backend migration",
    "priority": "high",
    "dueDate": "2024-12-31"
  }
  ```
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle completion status

### Habits

- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create new habit
  ```json
  {
    "name": "Exercise",
    "description": "30 minutes daily workout",
    "frequency": "daily"
  }
  ```
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/checkin` - Mark daily check-in (automatically updates streak)
- `GET /api/habits/:id/stats` - Get habit statistics

### Chat

- `POST /api/chat` - Send message to AI chatbot
  ```json
  {
    "message": "Help me organize my tasks for today"
  }
  ```

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── Todo.js              # Todo schema
│   └── Habit.js             # Habit schema with streak logic
├── controllers/
│   ├── todoController.js    # Todo business logic
│   ├── habitController.js   # Habit business logic
│   └── chatController.js    # Grok API integration
├── routes/
│   ├── todoRoutes.js        # Todo endpoints
│   ├── habitRoutes.js       # Habit endpoints
│   └── chatRoutes.js        # Chat endpoint
├── server.js                # Main application entry
├── package.json             # Dependencies
└── .env                     # Environment configuration
```

## MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB: https://docs.mongodb.com/manual/installation/
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/mrtracker`

### Option 2: MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## Grok API Setup

1. Get API key from https://x.ai/
2. Add to `.env` as `GROK_API_KEY`
3. Chatbot will provide fallback responses if key is not configured

## Testing

### Manual API Testing with curl:

**Create a todo**:
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","priority":"high"}'
```

**Create a habit**:
```bash
curl -X POST http://localhost:5000/api/habits \
  -H "Content-Type: application/json" \
  -d '{"name":"Exercise","frequency":"daily"}'
```

**Check in habit**:
```bash
curl -X POST http://localhost:5000/api/habits/{habit_id}/checkin
```

**Chat with AI**:
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Help me prioritize my tasks"}'
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env`
- For Atlas, ensure IP is whitelisted

### Port Already in Use
- Change `PORT` in `.env`
- Kill process using port 5000: `lsof -ti:5000 | xargs kill`

### Chat API Not Working
- Verify `GROK_API_KEY` in `.env`
- Check API key is valid
- Fallback responses will show if API fails

## License

ISC
