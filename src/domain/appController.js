class AppController {
    constructor(db) {
        this.db = db
    }
    addTodoUseCase(project, todo){
        this.db.addTodoToDb(project, todo); 
    }
}

export default AppController;