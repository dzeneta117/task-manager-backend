class Command {
    execute() {
        throw new Error("Method 'execute()' must be implemented.");
    }
}

class UpdateStatusCommand extends Command {
    constructor(task, newStatus) {
        super();
        this.task = task;
        this.newStatus = newStatus;
    }

    execute() {
        this.task.status = this.newStatus;
        console.log(`Task status updated to: ${this.newStatus}`);
    }
}

module.exports = { UpdateStatusCommand };
