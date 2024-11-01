// src/routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const TaskBuilder = require('../models/TaskBuilder');
const eventEmitter = require('../src/eventEmmiter');
const TaskWithNotes = require ('../decorators/TaskWithNotes');
const { PriorityReportVisitor } = require('../visitors/TaskVisitor');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
// Importovanje strategija
const SortByDate = require('../strategies/sortByDate');
const SortByTitle = require('../strategies/SortByTitle');
const SortByStatus = require('../strategies/SortByStatus');
const {authMiddleware} = require('../middleware/authMiddleware');


router.get('/notifications', authMiddleware, async (req, res) => {
    try {
        // Prvo dobijamo zadatke dodeljene korisniku
        const tasks = await Task.find({ assignedUsers: req.user._id });

        // Zatim pravimo obaveštenja na osnovu tih zadataka
        const notifications = tasks.map(task => ({
            taskId: task._id,
            message: `Imate novi zadatak: ${task.title}`, // Koristi title zadatka
            createdAt: task.createdAt,
            isRead: false // Možeš postaviti defaultnu vrednost
        }));

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Greška prilikom dobijanja obaveštenja.' });
    }
});
// PUT ruta za ažuriranje obaveštenja
router.put('/notifications/:id/read', authMiddleware, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true } // Vraća ažurirano obaveštenje
        );

        if (!notification) {
            return res.status(404).json({ message: 'Obaveštenje nije pronađeno.' });
        }

        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: 'Greška prilikom ažuriranja obaveštenja.' });
    }
});


router.get('/priority-report', async (req, res) => {
    try {
        const tasks = await Task.find(); // Preuzmi sve zadatke
        const priorityReportVisitor = new PriorityReportVisitor();

        // Poseti svaki zadatak
        tasks.forEach(task => task.accept(priorityReportVisitor));

        // Generiši izveštaj
        const report = priorityReportVisitor.getReport();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const { sortBy, date } = req.query; // Uzimanje datuma iz query-ja
        const tasks = await Task.find();

        // Filtriranje po datumu ako je datum prosleđen
        let filteredTasks = date ? tasks.filter(task => {
            const taskDate = new Date(task.dueDate).toLocaleDateString();
            return taskDate === new Date(date).toLocaleDateString(); // Proverava da li se poklapa datum
        }) : tasks;

        let sortedTasks;

        switch (sortBy) {
            case 'date':
                sortedTasks = new SortByDate().sort(filteredTasks);
                break;
            case 'title':
                sortedTasks = new SortByTitle().sort(filteredTasks);
                break;
            case 'status':
                sortedTasks = new SortByStatus().sort(filteredTasks);
                break;
            default:
                sortedTasks = filteredTasks; // Ako nema parametra, vrati nedefinisano sortiranje
        }

        res.json(sortedTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET task by ID
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

 
 
router.post('/', async (req, res) => {
    // Kreiranje zadatka
    const { title, description, priority, dueDate, assignedUsers } = req.body; // Uzimamo vrednosti iz req.body

    const task = new Task({
        title,
        description,
        priority,
        dueDate,
        assignedUsers: assignedUsers || [], // Osiguranje da je assignedUsers prazan niz ako nije prosleđen
    });

    try {
        const newTask = await task.save();

        // Dekorisanje zadatka dodavanjem napomena
        const decoratedTask = new TaskWithNotes(newTask);
        if (req.body.notes && Array.isArray(req.body.notes)) {
            req.body.notes.forEach(note => decoratedTask.addNote(note));
        }

        assignedUsers.forEach(userId => {
            eventEmitter.emit('taskAssigned', { userId, taskId: newTask._id, taskTitle: newTask.title });
        });

        eventEmitter.emit('taskCreated', decoratedTask.getTask()); // Emitovanje događaja sa dekorisanim zadatkom

        // Vraćamo dekorisani task sa napomenama
        res.status(201).json({
            task: decoratedTask.getTask(),
            notes: decoratedTask.getNotes(),
        });
    } catch (error) {
        console.error(error); // Ispis greške u konzolu za debugovanje
        res.status(400).json({ message: error.message });
    }
});

// PUT update task
router.put('/:id', async (req, res) => {
    try {
        // Priprema podataka za ažuriranje, uključujući assignedUsers
        const updatedData = {
            title: req.body.title, // Naslov
            description: req.body.description, // Opis
            dueDate: req.body.dueDate, // Datum isporuke
            status: req.body.status, // Status (ako ga menjaš)
            assignedUsers: req.body.assignedUsers // Ažuriranje zaduženih korisnika
        };

        // Ažuriranje zadatka u bazi podataka
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        // Proveri da li je zadatak pronađen
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });

        // Emitovanje događaja o ažuriranju
        eventEmitter.emit('taskUpdated', updatedTask);

        // Vraćanje ažuriranog zadatka
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});




// DELETE task
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        eventEmitter.emit('taskDeleted', deletedTask); // Emitovanje događaja
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// PUT /api/tasks/:id/status
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Očekujemo da frontend šalje novi status

        // Proveravamo da li je status validan (možeš prilagoditi koje vrednosti su dozvoljene)
        const allowedStatuses = ['Pending', 'In Progress', 'Completed'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Pronađi zadatak po ID-u i ažuriraj njegov status
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Ovo vraća ažurirani dokument
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/report/completed-tasks', async (req, res) => {
    try {
        // Prebroji sve zadatke koji imaju status 'Completed'
        const completedTasksCount = await Task.countDocuments({ status: 'Completed' });
        res.json({ completedTasksCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET broj završenih zadataka po periodu
router.get('/report/task-statuses', async (req, res) => {
    try {
        const { period } = req.query; // '7days', '30days', '1year'
        let startDate;

        // Odredi početni datum na osnovu perioda
        const today = new Date();
        switch (period) {
            case '7days':
                startDate = new Date(today.setDate(today.getDate() - 7));
                break;
            case '30days':
                startDate = new Date(today.setDate(today.getDate() - 30));
                break;
            case '1year':
                startDate = new Date(today.setFullYear(today.getFullYear() - 1));
                break;
            default:
                startDate = null;
        }

        // Ako postoji startDate, filtriraj po tom datumu, inače vrati sve zadatke po statusu
        const query = startDate ? { updatedAt: { $gte: startDate } } : {};

        // Brojanje zadataka po statusima
        const completedTasksCount = await Task.countDocuments({ ...query, status: 'Completed' });
        const inProgressTasksCount = await Task.countDocuments({ ...query, status: 'In Progress' });
        const pendingTasksCount = await Task.countDocuments({ ...query, status: 'Pending' });

        // Ukupan broj zadataka za izračunavanje procenata
        const totalTasksCount = completedTasksCount + inProgressTasksCount + pendingTasksCount;

        res.json({
            completedTasksCount,
            inProgressTasksCount,
            pendingTasksCount,
            totalTasksCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
