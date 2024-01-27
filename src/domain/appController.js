import LocalStorage from "../data/localStorage";

class AppController {
    /**
     * @constructor
     * @param {LocalStorage} db 
     */
    constructor(db) {
        this.db = db
    }
    addTodoUseCase(project, todo){
        this.db.addTodoToDb(project, todo); 
    }
    
}

export default AppController;