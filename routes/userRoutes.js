const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, verifyAdmin } = require('../middleware/authMiddleware');

// Ruta za dobijanje svih korisnika sa rolom "worker"
router.get('/workers', authMiddleware, verifyAdmin, async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' }).select('-password');
        res.status(200).json(workers);
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dobijanju korisnika', error: error.message });
    }
});

module.exports = router;
