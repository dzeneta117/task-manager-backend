// strategies/SortByDate.js
const SortStrategy = require('./SortStrategy');

class SortByDate extends SortStrategy {
    sort(tasks) {
        return tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
}

module.exports = SortByDate;
