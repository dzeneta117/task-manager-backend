const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Referenca na korisnika
        required: true
    },
    taskId: {
        type: Schema.Types.ObjectId,
        ref: 'Task',  // Referenca na zadatak
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false  // Podrazumevano obaveštenje nije pročitano
    },
    createdAt: {
        type: Date,
        default: Date.now  // Automatski dodajemo vreme kreiranja
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);
