import Project from "../domain/entities/project";
import Todo from "../domain/entities/todo";
import todoCircle from "../assets/icons/todo-circle.svg"
import showTodoBtn from "./components/todoInput/showTodoBtn.html"
import todoInputComponent from "./components/todoInput/todoInput.html";
import todoFromBtns from "./components/todoInput/todoFormBtns.html";
import updateTodoBtns from "./components/todoInput/updateTodoBtns.html";
import projectInputComponent from "./components/projectInput.html"
import { getCurrentDateString, capitalize } from "../domain/helper.js";

class DisplayController {
    constructor(appController) {
        this.app = appController;
    }
    /**
     * Initiates the app upon first loading
     */
    init() {
        const firstProject = this.app.initProject();
        this.renderSidebar();
        this.renderAllTasks();
    }

    // MAIN CONTENT

    /**
     * Renders todos to the main part of the screen based on the `project`
     * @param {Project} project 
     */
    renderMainContent(project) {
        console.log(project)
        const content = document.querySelector("#content");
        this.renderMainContentDetails(content, project);
        this.$appendTodoInputComponent(content, project);
    }
    renderMainContentDetails(parentNode, project) {
        parentNode.innerHTML = '';

        const projectTitleDiv = document.createElement("h3");
        projectTitleDiv.textContent = "List: " + project.title;

        const todoContainer = document.createElement("div");
        todoContainer.classList.add("todo-container");

        const todos = project.todos;
        if (todos.length) {
            todos.forEach((todo, i) => {
                this.$renderTodo(todoContainer, project, todo, i);
            });
        } else {
            todoContainer.textContent = "Move along. Nothing to see here."
        }

        parentNode.appendChild(projectTitleDiv)
        parentNode.appendChild(todoContainer);
    }

    $renderTodo(parentNode, project, todo, todoIndex) {
        // MAIN DIV 
        const todoWrapper = document.createElement("div");
        todoWrapper.classList.add("todo-wrapper")

        const todoDetails = document.createElement("div");
        todoDetails.classList.add("todo-details");

        // PRIORITY FLAG
        const priority = document.createElement("div");

        priority.classList.add("priority", todo.priority);

        todoDetails.appendChild(priority);

        // CHECKBOX
        const svgWrapper = document.createElement("div");
        svgWrapper.classList.add("todo-circle");
        svgWrapper.innerHTML = todoCircle
        todoDetails.appendChild(svgWrapper);

        // TITLE
        todoDetails.innerHTML += `<div class="todo-title">${todo.title}</div>`

        // DATE
        todoDetails.innerHTML += `<div class="todo-date">${this.renderTodoDate(todo)}</div>`

        // remove todo btn
        const removeTodoBtn = document.createElement("button");
        removeTodoBtn.classList.add("remove-btn")
        removeTodoBtn.textContent = '✖';
        removeTodoBtn.addEventListener("click", () => {
            console.log("test")
            this.app.removeTodoUseCase(project, todoIndex);
            this.renderActiveView(project);
        });
        todoDetails.appendChild(removeTodoBtn);

        // UPDATE TODO EVENT LISTNER
        todoDetails.addEventListener("click", (e) => {
            if (e.target.classList.contains("remove-btn")) return;
            this.renderTodoInputModal();
            const dialog = document.querySelector(".update-todo");
            dialog.showModal();
            const titleInput = document.querySelector(".update-todo #title");
            titleInput.value = todo.title;
            const dueDateInput = document.querySelector(".update-todo #due-date");
            dueDateInput.value = todo.dueDate.toISOString().substring(0, 10);
            const priority = document.querySelector(".update-todo #priority");
            priority.value = todo.priority
            this.addProjectsToTodoForm(project);
            const cancelBtn = document.querySelector(".cancel-update-btn");

            cancelBtn.addEventListener("click", (e) => {
                e.preventDefault();
                dialog.close();
            })

            const updateBtn = document.querySelector(".update-todo-btn");
            updateBtn.addEventListener("click", () => {
                const form = document.querySelector("dialog form");
                const data = new FormData(form);
                const newTodo = new Todo(data.get("title"), data.get("due-date"), data.get("priority"));
                const newProject = this.app.updateTodoUseCase(project, todoIndex, newTodo)

                this.renderActiveView(newProject);
            })
        })
        todoWrapper.appendChild(todoDetails);
        parentNode.appendChild(todoWrapper);
    }

    renderTodoDate(todo) {
        if (todo.dueDate.getFullYear() === new Date().getFullYear()) {
            return todo.dueDate.toLocaleString('default', { month: 'short', day: "numeric" });
        }
        else return todo.dueDate.toLocaleString('default', { month: 'short', day: "numeric", year: "numeric" });
    }



    /**
     * Creates form elements and appends them to the `parentNode`
     * @param {Element} parentNode 
     * @param {Project} project 
     */

    $appendTodoInputComponent(parentNode, project) {
        // CREATE FORM
        const div = document.createElement("div");
        div.classList.add("btn-to-input");
        div.innerHTML = showTodoBtn + todoInputComponent;
        parentNode.appendChild(div);
        document.querySelector(".todo-form").innerHTML += todoFromBtns;
        document.querySelector(".todo-form #due-date").value = getCurrentDateString();

        // POPULATE SELECT TAG FOR PROJECT NAMES
        console.log(project)
        this.addProjectsToTodoForm(project);


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
            const todo = new Todo(formData.get("title"), formData.get("due-date"), formData.get("priority"));
            const allProjects = this.app.readProjectsUseCase();
            const selectedProject = allProjects[formData.get("project")];
            console.log("here")
            const newProject = this.app.addTodoUseCase(selectedProject, todo);

            this.renderActiveView(newProject);
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
    renderActiveView(newProject) {
        const content = document.querySelector("#content");

        if (content.classList.length === 0) {
            this.renderMainContent(newProject);
        } else if (content.classList.contains("all-tasks")) {
            this.renderAllTasks();
        } else if (content.classList.contains("week-tasks")) {
            this.renderWeekTasks();
        } else if (content.classList.contains("today-tasks")) {
            this.renderTodayTasks();
        }
        this.renderSidebar();
    }

    highlightSidebarItem(activeItem) {
        const sidebar = document.querySelector(".sidebar");
        const sidebarItems = sidebar.querySelectorAll(".list-item");
        console.log(sidebarItems);
        sidebarItems.forEach((item) => {
            item.classList.remove("active-item");
        })
        activeItem.classList.add("active-item");
    }


    addProjectsToTodoForm(renderedProject) {

        const projectSelect = document.querySelector("select#project");
        const projectsList = this.app.readProjectsUseCase();
        console.log(projectsList);
        projectsList.forEach((project, i) => {
            const option = document.createElement("option");
            option.textContent = capitalize(project.title);
            option.value = i;
            console.log(option)
            // Select project if it's the currently rendered project
            if (project.timestamp === renderedProject.timestamp) {
                option.setAttribute("selected", "selected");
            }
            projectSelect.appendChild(option);
        })
    }

    // SIDEBAR 


    renderSidebar() {
        const projectsContainer = document.querySelector("#projects-container")
        projectsContainer.innerHTML = "";
        const projects = this.app.readProjectsUseCase();
        console.log("list", projects);
        this.$renderProjects(projectsContainer, projects);
        this.$appendProjectInputComponent();
        this.enableAllSidebarFeatures();
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
                const content = document.querySelector("#content");
                content.className = "";
                this.highlightSidebarItem(projectWrapper);

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
        const projectSelect = dialog.querySelector(".update-todo #project");
        projectSelect.parentElement.remove();
        form.classList.remove("form-invisible");
        form.classList.add("form-visible");
    }

    //Sidebar 
    enableAllSidebarFeatures() {
        const allTasks = document.querySelector("#all-tasks");
        allTasks.addEventListener("click", () => {
            this.renderAllTasks();
            this.highlightSidebarItem(allTasks);
        });

        const weekTasks = document.querySelector("#week-tasks");
        weekTasks.addEventListener("click", () => {
            this.renderWeekTasks();
            this.highlightSidebarItem(weekTasks);
        });

        const todayTasks = document.querySelector("#today-tasks");
        todayTasks.addEventListener("click", () => {
            this.renderTodayTasks();
            this.highlightSidebarItem(todayTasks);
        })
    }

    renderAllTasks() {
        const projects = this.app.getProjectsSortedByDate();
        this.renderSummaryTasks(projects);
        content.classList.add("all-tasks");
    }
    renderWeekTasks() {
        const content = document.querySelector("#content");
        content.innerHTML = "";
        const weekProjects = this.app.getWeekProjectsUseCase();
        this.renderSummaryTasks(weekProjects);
        content.classList.add("week-tasks");
    }
    renderTodayTasks() {
        const content = document.querySelector("#content");
        content.innerHTML = "";
        const todayProjects = this.app.getTodayProjectsUseCase();
        this.renderSummaryTasks(todayProjects);
        content.classList.add("today-tasks");
    }

    renderSummaryTasks(projects) {
        const content = document.querySelector("#content");
        content.classList = "";
        const projectsWrapper = document.createElement("div");
        projectsWrapper.classList.add("projects-wrapper");
        content.innerHTML = "";
        projectsWrapper.innerHTML = "";
        projects.forEach((project) => {
            const projectContainer = document.createElement("div")
            this.renderMainContentDetails(projectContainer, project);
            projectsWrapper.appendChild(projectContainer)
        })
        content.appendChild(projectsWrapper);
        const allProjects = this.app.readProjectsUseCase();
        this.$appendTodoInputComponent(content, allProjects[0]);
    }
}
export default DisplayController;