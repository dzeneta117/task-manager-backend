const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Pretpostavka da je model Task u ovom fajlu
const authMiddleware = require('../middleware/authMiddleware'); // Middleware za autentifikaciju

// Ruta za dobijanje obaveštenja
// Ruta za dobijanje zadataka dodeljenih radniku
router.get('/', authMiddleware, async (req, res) => {
    try {
        const workerId = req.user.id; // Pretpostavljamo da je ovo ID radnika iz JWT tokena

        // Pronađi zadatke gde je workerId prisutan u assignedUsers
        const tasks = await Task.find({ assignedUsers: { $in: [workerId] } });

        res.json(tasks); // Vrati zadatke dodeljene radniku
    } catch (err) {
        res.status(500).json({ message: 'Greška prilikom dobijanja zadataka' });
    }
});


module.exports = router;
