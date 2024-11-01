// states/TaskState.js
class TaskState {
    constructor(task) {
        this.task = task;
    }

    setPending() {
        throw new Error("This method must be overridden");
    }

    setInProgress() {
        throw new Error("This method must be overridden");
    }

    setCompleted() {
        throw new Error("This method must be overridden");
    }

    getStatus() {
        throw new Error("This method must be overridden");
    }
}

module.exports = TaskState;
