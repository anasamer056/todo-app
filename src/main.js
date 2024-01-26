import './style.css';
import AppController from './domain/appController';
import LocalStorage from './data/localStorage';
import Todo from './domain/entities/todo';
import Project from './domain/entities/project';

const db = new LocalStorage();
const appController = new AppController(db); 

const addBtn = document.querySelector(".add-todo-btn");

addBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    console.log("test");
    const todo = new Todo("first todo");
    const project = new Project("second");
    appController.addTodoUseCase(project, todo);
});
