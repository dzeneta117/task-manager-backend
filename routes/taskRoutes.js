const express = require('express');
const { addTask, updateTask, deleteTask, getTasks } = require('../controllers/taskController');
const router = express.Router();

router.post('/tasks', addTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.get('/tasks', getTasks);

module.exports = router;

