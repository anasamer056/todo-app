import LocalStorage from "../data/localStorage";
import Project from "./entities/project";

class AppController {
    /**
     * @constructor
     * @param {LocalStorage} db 
     */
    constructor(db) {
        this.db = db
    }
    // -TODO
    addTodoUseCase(project, todo){
        this.db.addTodoToDb(project, todo); 
    }
    readTodosUseCase(project) {
        return this.db.readTodosFromDb(project);
    }
    removeTodoUseCase(project, todoIndex){
        this.db.removeTodoFromDb(project, todoIndex);
    }

    // -PROJECT
    addProjectUseCase(project){
        this.db.addProjectToDb(project);
    }

    readProjectsUseCase(){
        return this.db.readPojectsFromDb();
    }
    removeProjectUseCase(project){
        this.db.removeProjectFromDb(project);
    }

    /**
     * Creates the very first project if it doesn't exist
     */
    initProject(){
        const projects = this.db.readPojectsFromDb();
        if (projects.length > 0) return projects[0]; 
        else {
            const project = new Project("Personal", Date.now())
            this.db.addProjectToDb(project);
            return project
        }
    }

}

export default AppController;