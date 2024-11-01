const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
// Register funkcija
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashedPassword });
  try {
    await user.save();
    res.status(201).json({ message: 'User registered!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login funkcija
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Proveravamo da li korisnik postoji u bazi
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Neispravan email ili lozinka' });
    }

    // Uporedimo lozinke
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Neispravan email ili lozinka' });
    }

    // Kreiramo JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Greška na serveru' });
  }
};

module.exports = { register, login };

