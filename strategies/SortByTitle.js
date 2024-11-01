// strategies/SortByTitle.js
const SortStrategy = require('./SortStrategy');

class SortByTitle extends SortStrategy {
    sort(tasks) {
        return tasks.sort((a, b) => a.title.localeCompare(b.title));
    }
}

module.exports = SortByTitle;
