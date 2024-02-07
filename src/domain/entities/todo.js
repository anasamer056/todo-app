/**
 * Represents a todo created by the user
 */
class Todo {
    /**
     * Creates a `Todo`
     * @param {string} title - The title of the todo
     * @param {Date} dueDate - When the todo is due
     * @param {string} priority - How urgent the todo is 
     */
    constructor(title, dueDate, priority){
        this.title = title;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
    }

    static fromJSON(jsonData){
        const parsedData = JSON.parse(jsonData);
        return new Todo(jsonData.title)
    }

    static parseTodoList(todoList){
        const result = [];
        for (const item of todoList){
            const todo = new Todo(item.title, item.dueDate, item.priority);
            result.push(todo);
        } 
        return result;
    }
}

export default Todo;