// src/eventListeners.js
const eventEmitter = require('../src/eventEmmiter');

// Slušaj na 'taskCreated' događaj
eventEmitter.on('taskCreated', (task) => {
    console.log('New Task Created:', task);
    // Ovde možeš dodati kod za obaveštavanje korisnika, logovanje, itd.
});

// Slušaj na 'taskUpdated' događaj
eventEmitter.on('taskUpdated', (task) => {
    console.log('Task Updated:', task);
    // Ovde možeš dodati kod za obaveštavanje korisnika, logovanje, itd.
});

// Slušaj na 'taskDeleted' događaj
eventEmitter.on('taskDeleted', (task) => {
    console.log('Task Deleted:', task);
    // Ovde možeš dodati kod za obaveštavanje korisnika, logovanje, itd.
});
