import DisplayController from "./displayController";
class SidebarController {
    constructor(){
        this.displayController = new DisplayController();
    }
    static enableAll(){
        this.enableAllTasksView();
    }
    static enableAllTasksView(){
        const allTasks = document.querySelector("#all-tasks");
        allTasks.addEventListener("click", ()=>{
            console.log("all tasks")
        })
    }
}

export default SidebarController;