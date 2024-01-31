import Project from "../domain/entities/project";
import Todo from "../domain/entities/todo";
import AppController from "../domain/appController";
import LocalStorage from "../data/localStorage";
import todoCircle from "../assets/icons/todo-circle.svg"
import todoInputComponent from "./components/todoInput.html";
import projectInputComponent from "./components/projectInput.html"

class DisplayController {
    constructor(appController) {
        this.app = appController;
    }
    /**
     * Initiates the app upon first loading
     */
    init() {
        const firstProject = this.app.initProject();
        this.renderMainContent(firstProject);
        this.renderSidebar();
    }

    // MAIN CONTENT

    /**
     * Renders todos to the main part of the screen based on the `project`
     * @param {Project} project 
     */
    renderMainContent(project) {
        const content = document.querySelector("#content");
        content.innerHTML = '';
        const todoContainer = document.createElement("div");
        todoContainer.classList.add("todo-container");

        const todos = this.app.readTodosUseCase(project);
        for (const todo of todos) {
            this.$renderTodo(todoContainer, todo);
        }

        content.appendChild(todoContainer);
        this.$appendTodoInputComponent(content, project);
    }

    $renderTodo(parentNode, todo) {
        // MAIN DIV 
        const todoWrapper = document.createElement("div");
        todoWrapper.classList.add("todo-wrapper");

        // CHECKBOX
        const svgWrapper = document.createElement("div");
        svgWrapper.classList.add("todo-circle");
        svgWrapper.innerHTML = todoCircle
        todoWrapper.appendChild(svgWrapper);

        // TITLE
        todoWrapper.innerHTML += `<div class="todo-title">${todo.title}</div>`

        // DATE
        todoWrapper.innerHTML += `<div class="todo-date">No date</div>`

        // CLOSE BTN
        todoWrapper.innerHTML += `<button class="close-btn-todo">
            ✖
        </button>`

        parentNode.appendChild(todoWrapper);
    }

    /**
     * Creates form elements and appends them to the `parentNode`
     * @param {Element} parentNode 
     * @param {Project} project 
     */
    $appendTodoInputComponent(parentNode, project) {
        // Create form
        const div = document.createElement("div");
        div.classList.add("btn-to-input");
        div.innerHTML = todoInputComponent;
        parentNode.appendChild(div);

        // Attach event listeners
        const addBtn = document.querySelector(".add-todo-btn");
        const todoForm = document.querySelector(".todo-form");
        addBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const formData = new FormData(todoForm);
            const todo = new Todo(formData.get("title"));
            this.app.addTodoUseCase(project, todo);
            this.renderMainContent(project);
        });
    }
    
    // SIDEBAR 


    renderSidebar(){
        const projectsContainer = document.querySelector("#projects-container")
        projectsContainer.innerHTML = "";
        const projects = this.app.readProjectsUseCase();
        this.$renderProjects(projectsContainer, projects);
        this.$appendProjectInputComponent();
    }

    $renderProjects(parentNode, projects){
        for (const project of projects){
            const div = document.createElement("div");
            div.textContent = project.title;
            parentNode.appendChild(div);
        }
    }

    $appendProjectInputComponent(){
        // Create form 
        const projectsContainer = document.querySelector("#projects-container");
        const addProjectInput = document.createElement("div");
        addProjectInput.classList.add("btn-to-input");
        addProjectInput.innerHTML = projectInputComponent;
        projectsContainer.appendChild(addProjectInput)

        // Attach event listeners
        const addBtn = document.querySelector(".add-project-btn");
        const todoForm = document.querySelector(".project-form");
        addBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const formData = new FormData(todoForm);
            const project = new Project(formData.get("title"), Date.now());
            this.app.addProjectUseCase(project);
            this.renderSidebar();
        });
    }
}
export default DisplayController;