const mongoose = require('mongoose');
const PendingState = require('../states/PendingState');
const InProgressState = require('../states/InProgressState');
const CompletedState = require('../states/CompletedState');


const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    dueDate: {
        type: Date,
        required: true,
    },
    assignedUsers: [{
        type: String,
        required: true,
    }],
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending',
    }
}, { timestamps: true });

// Metoda za Visitor pattern
taskSchema.methods.accept = function(visitor) {
    visitor.visit(this);
};

module.exports = mongoose.model('Task', taskSchema);




taskSchema.methods.setState = function(state) {
    switch(state) {
        case 'Pending':
            this.state = new PendingState(this);
            break;
        case 'In Progress':
            this.state = new InProgressState(this);
            break;
        case 'Completed':
            this.state = new CompletedState(this);
            break;
    }
};

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;

