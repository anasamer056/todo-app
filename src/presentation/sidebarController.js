import DisplayController from "./displayController";
import AppController from "../domain/appController";

const displayController = new DisplayController();
const app = new AppController();

class SidebarController {
    
    static enableAll(){
        this.enableAllTasksView();
    }
    static enableAllTasksView(){
        const allTasks = document.querySelector("#all-tasks");
        allTasks.addEventListener("click", ()=>{
            const todoList = app.readProjectsUseCase();
            console.log("all tasks")
        })
    }
}

export default SidebarController;