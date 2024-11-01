// decorators/TaskWithNotes.js
class TaskWithNotes {
    constructor(task) {
        this.task = task;
        this.notes = [];
    }

    addNote(note) {
        this.notes.push(note);
    }

    getNotes() {
        return this.notes;
    }

    getTask() {
        return this.task;
    }
}

module.exports = TaskWithNotes;
