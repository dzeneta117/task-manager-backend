const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Autentifikacija korisnika
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        console.log('No token, authorization denied');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        console.log('User authenticated:', req.user); // Logujemo korisnika // Dohvati korisnika bez lozinke
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Verifikacija da li je korisnik admin
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Ako je korisnik admin, nastavi dalje
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

module.exports = { authMiddleware, verifyAdmin };
