class TaskInvoker {
    constructor() {
        this.history = [];
    }

    run(command) {
        command.execute();
        this.history.push(command);
    }
}

module.exports = TaskInvoker;
