class TaskVisitor {
    visit(task) {
        throw new Error('Method visit() must be implemented.');
    }
}

class PriorityReportVisitor extends TaskVisitor {
    constructor() {
        super();
        this.report = {
            low: 0,
            medium: 0,
            high: 0
        };
    }

    visit(task) {
        if (task.priority === 'low') {
            this.report.low += 1;
        } else if (task.priority === 'medium') {
            this.report.medium += 1;
        } else if (task.priority === 'high') {
            this.report.high += 1;
        }
    }

    getReport() {
        return this.report;
    }
}

module.exports = { TaskVisitor, PriorityReportVisitor };
