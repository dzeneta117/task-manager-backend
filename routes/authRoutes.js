// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {authMiddleware} = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

// Ruta za registraciju korisnika
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    // Provera da li korisnik već postoji
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'Korisnik već postoji' });
    }

    // Hash-ovanje lozinke
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kreiranje novog korisnika
    const user = new User({
        username,
        email,
        password: hashedPassword,
        role,
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Ruta za login korisnika
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Neispravan email ili lozinka' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Neispravan email ili lozinka' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token,  role: user.role  });
});
// Ruta za dobijanje svih korisnika sa rolom "worker"
router.get('/workers', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' }).select('-password'); // Dohvata sve korisnike sa rolom 'worker' bez polja 'password'
        res.status(200).json(workers);
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dobijanju korisnika', error: error.message });
    }
});

// Primer rute koja je dostupna samo za administratore
router.get('/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
    res.send('Ovo je admin-specific data.');
});

// Primer rute koja je dostupna za radnike i administratore
router.get('/worker', authMiddleware, roleMiddleware(['worker', 'admin']), (req, res) => {
    res.send('Ovo je sadržaj dostupan za radnike i administratore.');
});

module.exports = router;
