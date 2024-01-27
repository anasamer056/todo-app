import Project from "../domain/entities/project";
import Todo from "../domain/entities/todo";
import AppController from "../domain/appController";
import LocalStorage from "../data/localStorage";

class DisplayController {
    constructor(appController){
        this.app = appController;
    }
    init(){
        this.renderMainContent(new Project("main"));
    }
    renderMainContent(project) {
        const content = document.querySelector("#content");
        this.$appendTodoInputComponent(content, project);
    }
    $appendTodoInputComponent(parentNode, project){
        const div = document.createElement("div");
        div.classList.add("btn-to-input");
        div.innerHTML = `<button>Add task</button>
        <form>
            <input type="text" placeholder="Your todo goes here">
            <div class="form-btns">
                <button class="add-todo-btn">Add</button>
                <button class="cancel-todo-btn">Cancel</button>
            </div>
        </form>`;
        parentNode.appendChild(div);

        const addBtn = document.querySelector(".add-todo-btn");
        addBtn.addEventListener("click", (e)=>{
            e.preventDefault();
            console.log("test");
            const todo = new Todo("first todo");
            this.app.addTodoUseCase(project, todo);
        });
    }
}

export default DisplayController;