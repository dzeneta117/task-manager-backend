// strategies/SortByStatus.js
const SortStrategy = require('./SortStrategy');

class SortByStatus extends SortStrategy {
    sort(tasks) {
        return tasks.sort((a, b) => a.completed - b.completed);
    }
}

module.exports = SortByStatus;
