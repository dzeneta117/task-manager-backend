class TaskBuilder {
    constructor() {
        this.task = {};
    }

    setTitle(title) {
        this.task.title = title;
        return this; // Vraćamo samog sebe da bismo omogućili chaining
    }

    setDescription(description) {
        this.task.description = description;
        return this;
    }

    setPriority(priority) {
        this.task.priority = priority;
        return this;
    }

    setDueDate(dueDate) {
        this.task.dueDate = dueDate;
        return this;
    }

    setAssignedUsers(users) {
        this.task.assignedUsers = users;
        return this;
    }

    build() {
        // Na kraju, kada je sve postavljeno, vraćamo kompletan task
        return this.task;
    }
}

module.exports = TaskBuilder;
