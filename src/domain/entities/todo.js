/**
 * Represents a todo created by the user
 */
class Todo {
    /**
     * Creates a `Todo`
     * @param {string} title - The title of the todo
     */
    constructor(title){
        this.title = title;
    }
    static fromJSON(jsonData){
        const parsedData = JSON.parse(jsonData);
        return new Todo(jsonData.title)
    }
}

export default Todo;