const EventEmitter = require('events');
const emitter = new EventEmitter();
const Notification = require('./models/Notification');

// Osluškujemo događaj kada se korisniku dodeli zadatak
emitter.on('taskAssigned', async ({ userId, taskId, taskTitle }) => {
    try {
        // Kreiramo novo obaveštenje za korisnika
        const notification = new Notification({
            userId,
            taskId,
            message: `Novi zadatak "${taskTitle}" ti je dodeljen.`
        });

        await notification.save();
        console.log(`Obaveštenje kreirano za korisnika ${userId} o zadatku ${taskId}`);
    } catch (error) {
        console.error('Greška prilikom kreiranja obaveštenja:', error);
    }
});

module.exports = emitter;
