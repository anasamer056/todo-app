import Todo from "./todo.js";

/**
 * Represents projects or lists into which the user can save todos
 */
class Project {
    /**
     * Creates a `Project`
     * @param {string} title - The title of the project
     */
    constructor(title, timestamp, todos = []){
        this.title = title;
        this.timestamp = timestamp;
        this.todos = todos;
    }

    static fromJSON(projectJson){
        const parsedJson = JSON.parse(projectJson);
        const todos = Todo.parseTodoList(parsedJson.todos)
        return new Project(parsedJson.title, parsedJson.timestamp, todos);
    }

    // toJSON(){
    //     console.log(this);
    //     return JSON.stringify(this);
    // }
}

export default Project;