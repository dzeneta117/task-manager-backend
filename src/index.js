const express = require('express');
const connectDB = require('../config/db'); // Putanja je sada ispravna
const cors = require('cors');
const authRoutes = require('../routes/authRoutes');







// Inicijalizacija environment varijabli
const dotenv = require('dotenv');
dotenv.config();
console.log(process.env.JWT_SECRET);


// Konektovanje na bazu
connectDB();

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Ako je frontend na ovom portu
}));

// Dodavanje auth ruta
app.use('/api/auth', authRoutes);


// Rute za taskove
app.use('/api/tasks', require('../routes/tasks')); // Putanja je sada ispravna

require('../src/eventListeners');

app.get('/', (req, res) => {
    res.send('Task Manager API');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
