import LocalStorage from "../data/localStorage";

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

    // -PROJECT
    addProjectUseCase(project){
        this.db.addProjectToDb(project);
    }

}

export default AppController;