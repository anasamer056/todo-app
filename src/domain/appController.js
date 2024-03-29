import LocalStorage from "../data/localStorage";
import Project from "./entities/project";
import { sortTodosByDateAsc, filterCurrentWeekTodos, filterTodayTodos} from "./helper";

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
        return this.db.addTodoToDb(project, todo); 
    }
    readTodosUseCase(project) {
        return this.db.readTodosFromDb(project);
    }
    // getWeekTodosUseCase(project) {
    //     return filterCurrentWeekTodos(this.db.readTodosFromDb(project));
    // }
    
    removeTodoUseCase(project, todoIndex){
        this.db.removeTodoFromDb(project, todoIndex);
    }
    updateTodoUseCase(project, todoIndex, newTodo){
        return this.db.updateTodoInDb(project, todoIndex, newTodo);
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

    getProjectsSortedByDate(){
        return sortTodosByDateAsc(this.db.readPojectsFromDb())
    }

    getWeekProjectsUseCase(){
        return sortTodosByDateAsc(filterCurrentWeekTodos(this.db.readPojectsFromDb()))
    }
    
    getTodayProjectsUseCase(){
        return filterTodayTodos(this.db.readPojectsFromDb());
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