const Task = require('../models/Task');

// Funkcija za dodavanje novog zadatka
// controllers/taskController.js
const { AddTaskCommand, UpdateTaskCommand, DeleteTaskCommand, GetTasksCommand } = require('../commands/TaskCommands');

const addTask = async (req, res) => {
    const { title, description, priority, dueDate, assignedUsers } = req.body;
    const command = new AddTaskCommand({ title, description, priority, dueDate, assignedUsers });

    try {
        const task = await command.execute();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dodavanju zadatka', error });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, dueDate, assignedUsers } = req.body;
    const command = new UpdateTaskCommand(id, { title, description, priority, dueDate, assignedUsers });

    try {
        const task = await command.execute();
        if (!task) {
            return res.status(404).json({ message: 'Zadatak nije pronađen' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Greška pri ažuriranju zadatka', error });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    const command = new DeleteTaskCommand(id);

    try {
        const task = await command.execute();
        if (!task) {
            return res.status(404).json({ message: 'Zadatak nije pronađen' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Greška pri brisanju zadatka', error });
    }
};

const getTasks = async (req, res) => {
    const command = new GetTasksCommand();

    try {
        const tasks = await command.execute();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dobijanju zadataka', error });
    }
};

module.exports = { addTask, updateTask, deleteTask, getTasks };
