// states/PendingState.js
const TaskState = require('./TaskState');

class PendingState extends TaskState {
    setPending() {
        console.log("Task is already in Pending state.");
    }

    setInProgress() {
        this.task.state = this.task.inProgressState;
        console.log("Task moved to In Progress.");
    }

    setCompleted() {
        console.log("Can't set to Completed directly from Pending.");
    }

    getStatus() {
        return "Pending";
    }
}

module.exports = PendingState;

