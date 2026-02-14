const express = require('express');
const router = express.Router();
const {
    getAllTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
} = require('../controllers/todoController');

router.route('/')
    .get(getAllTodos)
    .post(createTodo);

router.route('/:id')
    .put(updateTodo)
    .delete(deleteTodo);

router.patch('/:id/toggle', toggleTodo);

module.exports = router;
