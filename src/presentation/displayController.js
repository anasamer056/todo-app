import Project from "../domain/entities/project";
import Todo from "../domain/entities/todo";
import AppController from "../domain/appController";
import LocalStorage from "../data/localStorage";

class DisplayController {
    constructor(appController){
        this.app = appController;
    }
    /**
     * Initiates the app upon first loading
     */
    init(){
        this.renderMainContent(new Project("main"));
    }

    /**
     * Renders todos to the main part of the screen based on the `project`
     * @param {Project} project 
     */
    renderMainContent(project) {
        const content = document.querySelector("#content");
        this.$appendTodoInputComponent(content, project);
    }

    /**
     * Creates form elements and appends them to the `parentNode`
     * @param {Element} parentNode 
     * @param {Project} project 
     */
    $appendTodoInputComponent(parentNode, project){
        // Create form
        const div = document.createElement("div");
        div.classList.add("btn-to-input");
        div.innerHTML = `<button>Add task</button>
        <form class="todo-form">
            <input name="title" type="text" placeholder="Your todo goes here">
            <div class="form-btns">
                <button class="add-todo-btn">Add</button>
                <button class="cancel-todo-btn">Cancel</button>
            </div>
        </form>`;
        parentNode.appendChild(div);

        // Attach event listeners
        const addBtn = document.querySelector(".add-todo-btn");
        const todoForm = document.querySelector(".todo-form");
        addBtn.addEventListener("click", (e)=>{
            e.preventDefault();
            const formData = new FormData(todoForm);
            const todo = new Todo(formData.get("title"));
            this.app.addTodoUseCase(project, todo);
        });
    }
}
export default DisplayController;