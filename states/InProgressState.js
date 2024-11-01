// states/InProgressState.js
const TaskState = require('./TaskState');

class InProgressState extends TaskState {
    setPending() {
        console.log("Task can't go back to Pending.");
    }

    setInProgress() {
        console.log("Task is already In Progress.");
    }

    setCompleted() {
        this.task.state = this.task.completedState;
        console.log("Task moved to Completed.");
    }

    getStatus() {
        return "In Progress";
    }
}

module.exports = InProgressState;
