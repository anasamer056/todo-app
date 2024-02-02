import Project from "../domain/entities/project";
import Todo from "../domain/entities/todo";
import todoCircle from "../assets/icons/todo-circle.svg"
import showTodoBtn from "./components/todoInput/showTodoBtn.html"
import todoInputComponent from "./components/todoInput/todoInput.html";
import todoFromBtns from "./components/todoInput/todoFormBtns.html";
import updateTodoBtns from "./components/todoInput/updateTodoBtns.html";
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

        const projectTitleDiv = document.createElement("h3");
        projectTitleDiv.textContent = project.title;

        const todoContainer = document.createElement("div");
        todoContainer.classList.add("todo-container");

        const todos = this.app.readTodosUseCase(project);
        todos.forEach((todo, i) => {
            this.$renderTodo(todoContainer, project, todo, i);
        });

        content.appendChild(projectTitleDiv)
        content.appendChild(todoContainer);
        this.$appendTodoInputComponent(content, project);
    }

    $renderTodo(parentNode, project, todo, todoIndex) {
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

        // remove todo btn
        const removeTodoBtn = document.createElement("button");
        removeTodoBtn.classList.add("remove-btn")
        removeTodoBtn.textContent = '✖';
        removeTodoBtn.addEventListener("click", () => {
            console.log("test")
            this.app.removeTodoUseCase(project, todoIndex);
            this.renderMainContent(project);
        });
        todoWrapper.appendChild(removeTodoBtn);

        // UPDATE TODO EVENT LISTNER
        todoWrapper.addEventListener("click", (e) => {
            if (e.target.classList.contains("remove-btn")) return;
            this.renderTodoInputModal();
            const dialog = document.querySelector(".update-todo");
            dialog.showModal();
            const titleInput = document.querySelector(".update-todo #title");
            titleInput.value = todo.title;

            const cancelBtn = document.querySelector(".cancel-update-btn");
            console.log(cancelBtn)

            cancelBtn.addEventListener("click", (e) => {
                e.preventDefault();
                dialog.close();
            })

            const updateBtn = document.querySelector(".update-todo-btn");
            updateBtn.addEventListener("click", ()=>{
                const form = document.querySelector("dialog form");
                const data = new FormData(form);
                const newTodo = new Todo(data.get("title"));
                this.app.updateTodoUseCase(project, todoIndex, newTodo)
                this.renderMainContent(project);
            })
        })

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
        div.innerHTML = showTodoBtn + todoInputComponent;
        parentNode.appendChild(div);
        document.querySelector(".todo-form").innerHTML += todoFromBtns;

        // SHOW FORM EVENT LISTENER
        const todoForm = document.querySelector(".todo-form");
        const showInputBtn = document.querySelector(".show-todo-input");
        showInputBtn.addEventListener("click", () => {
            showInputBtn.style.display = "None";
            todoForm.classList.remove("form-invisible");
            todoForm.classList.add("form-visible");
        })

        // ADD TODO event listener
        const addBtn = document.querySelector(".add-todo-btn");
        addBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showInputBtn.style.display = "Block";
            const formData = new FormData(todoForm);
            const todo = new Todo(formData.get("title"));
            this.app.addTodoUseCase(project, todo);
            this.renderMainContent(project);
        });

        // CANCEL INPUT EVENT LISTENER
        const cancelBtn = document.querySelector(".cancel-todo-btn");
        cancelBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showInputBtn.style.display = "block";
            todoForm.classList.remove("form-visible");
            todoForm.classList.add("form-invisible");
        })

    }

    // SIDEBAR 


    renderSidebar() {
        const projectsContainer = document.querySelector("#projects-container")
        projectsContainer.innerHTML = "";
        const projects = this.app.readProjectsUseCase();
        this.$renderProjects(projectsContainer, projects);
        this.$appendProjectInputComponent();
    }

    $renderProjects(parentNode, projects) {
        for (const project of projects) {
            // MAIN WRAPPER
            const projectWrapper = document.createElement("div");
            projectWrapper.classList.add("list-item", "project-wrapper");

            // TITLE
            const title = document.createElement("div");
            title.textContent = project.title;
            projectWrapper.appendChild(title);

            // REMOVE PROJECT BTN
            const removeProjectBtn = document.createElement("div");
            removeProjectBtn.textContent = '✖';
            removeProjectBtn.classList.add("remove-btn")
            removeProjectBtn.addEventListener("click", () => {
                this.app.removeProjectUseCase(project);

                this.renderSidebar()
            })
            projectWrapper.appendChild(removeProjectBtn);


            // RENDER PROJECT EVENT LISTENER 
            projectWrapper.addEventListener("click", () => {
                this.renderMainContent(project);
            })


            parentNode.appendChild(projectWrapper);
        }
    }

    $appendProjectInputComponent() {
        // Create form 
        const projectsContainer = document.querySelector("#projects-container");
        const addProjectInput = document.createElement("div");
        addProjectInput.classList.add("btn-to-input");
        addProjectInput.innerHTML = projectInputComponent;
        projectsContainer.appendChild(addProjectInput)

        // SHOW FORM EVENT LISTENER
        const projectForm = document.querySelector(".project-form");
        const showInputBtn = document.querySelector(".show-project-input");
        showInputBtn.addEventListener("click", () => {
            showInputBtn.style.display = "None";
            projectForm.classList.remove("form-invisible");
            projectForm.classList.add("form-visible");
        })

        // ADD PROJECT EVENT LISTENER
        const addBtn = document.querySelector(".add-project-btn");
        addBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const formData = new FormData(projectForm);
            const project = new Project(formData.get("title"), Date.now());
            this.app.addProjectUseCase(project);
            this.renderSidebar();
        });

        // CANCEL INPUT EVENT LISTENER
        const cancelBtn = document.querySelector(".cancel-project-btn");
        cancelBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showInputBtn.style.display = "block";
            projectForm.classList.remove("form-visible");
            projectForm.classList.add("form-invisible");
        })
    }

    // DIALOG
    renderTodoInputModal() {
        const dialog = document.querySelector(".update-todo")
        const formWrapper = document.querySelector(".update-todo>div");
        formWrapper.innerHTML = todoInputComponent;
        const form = document.querySelector(".update-todo .todo-form");
        form.innerHTML += updateTodoBtns;
        form.classList.remove("form-invisible");
        form.classList.add("form-visible");

    }
}
export default DisplayController;