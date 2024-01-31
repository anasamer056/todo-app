class LocalStorageWrapper {
    constructor(title, timestamp, todos) {
        this.title = title;
        this.timestamp = timestamp;
        this.todos = todos;
    }

    get data(){
        return {
            title: this.title,
            timestamp: this.timestamp,
            todos: this.todos
        }
    }
}