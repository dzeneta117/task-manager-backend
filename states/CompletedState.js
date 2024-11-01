// states/CompletedState.js
const TaskState = require('./TaskState');

class CompletedState extends TaskState {
    setPending() {
        console.log("Task can't go back to Pending from Completed.");
    }

    setInProgress() {
        console.log("Task can't go to In Progress from Completed.");
    }

    setCompleted() {
        console.log("Task is already Completed.");
    }

    getStatus() {
        return "Completed";
    }
}

module.exports = CompletedState;
