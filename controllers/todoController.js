const Todo = require('../models/Todo');

// @desc    Get all todos
// @route   GET /api/todos
const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find().sort({ priority: 1, dueDate: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            count: todos.length,
            data: todos,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
};

// @desc    Create new todo
// @route   POST /api/todos
const createTodo = async (req, res) => {
    try {
        const todo = await Todo.create(req.body);
        res.status(201).json({
            success: true,
            data: todo,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
const updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!todo) {
            return res.status(404).json({
                success: false,
                error: 'Todo not found',
            });
        }

        res.status(200).json({
            success: true,
            data: todo,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                error: 'Todo not found',
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

// @desc    Toggle todo completion
// @route   PATCH /api/todos/:id/toggle
const toggleTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                error: 'Todo not found',
            });
        }

        todo.completed = !todo.completed;
        await todo.save();

        res.status(200).json({
            success: true,
            data: todo,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

module.exports = {
    getAllTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
};
