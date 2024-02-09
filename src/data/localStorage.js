import Project from "../domain/entities/project";
import Todo from "../domain/entities/todo";
import LocalStorageWrapper from "./entities/localStorageWrapper";

class LocalStorage {
    constructor(){
        
    }
    // -TODO 
    /**
     * Writes a `todo` to the local storage under `project`
     * @param {Project} project 
     * @param {Todo} todo 
     */
    addTodoToDb(project, todo){
        if(!this.$storageAvailable()){
            throw new LocalStorageNotAvailable();
        }

        const parsedData = JSON.parse(localStorage.getItem(project.timestamp));
        const todoList = parsedData.todoList;
        todoList.push(todo);
        localStorage.setItem(project.timestamp, JSON.stringify(new LocalStorageWrapper(project, todoList)));        
    }

    readTodosFromDb(project){
      if (!localStorage.getItem(project.timestamp)){
        throw new ProjectNotFound();
      }
      const parsedData = JSON.parse(localStorage.getItem(project.timestamp));
      return Todo.parseTodoList(parsedData.todoList);
    }

    removeTodoFromDb(project, todoIndex){
      const parsedData = JSON.parse(localStorage.getItem(project.timestamp));
      const todoList = parsedData.todoList; 
      todoList.splice(todoIndex, 1);
      localStorage.setItem(project.timestamp, JSON.stringify(new LocalStorageWrapper(project, todoList)));
    }

    updateTodoInDb(project, todoIndex, newTodo){

      const parsedData = JSON.parse(localStorage.getItem(project.timestamp));
      const todoList = parsedData.todoList;
      todoList[todoIndex] = newTodo;
      localStorage.setItem(project.timestamp, JSON.stringify(new LocalStorageWrapper(project, todoList))); 
    }

    // PROJECT
    
    addProjectToDb(project){
      if(!this.$storageAvailable()){
        throw new LocalStorageNotAvailable();
      } else {
        localStorage.setItem(project.timestamp, JSON.stringify(new LocalStorageWrapper(project, [])))
      }
    }

    readPojectsFromDb(){
      const projectList = Object.keys(localStorage);
      projectList.sort((a,b)=>a-b);
      const result = [];
      for (const item of projectList){
        const projectJson = localStorage.getItem(item)
        const project = Project.fromJSON(projectJson);
        result.push(project);
      }
      // console.warn(result);
      return result
    }

    removeProjectFromDb(project){
      localStorage.removeItem(project.timestamp);  
    }

    // HELPER

    /**
     * Checks whether localStorage is supported and available
     * @returns {boolean}
     */
    $storageAvailable() {
        let storage;
        try {
          storage = window["localStorage"];
          const x = "__storage_test__";
          storage.setItem(x, x);
          storage.removeItem(x);
          return true;
        } catch (e) {
          return (
            e instanceof DOMException &&
            // everything except Firefox
            ( e.code === 22 ||
              // Firefox
              e.code === 1014 ||
              // test name field too, because code might not be present
              // everything except Firefox
              e.name === "QuotaExceededError" ||
              // Firefox
              e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
          );
        }
      } 
}

/**
 * Error to throw when app can't access localStorage
 * @extends Error
 */
class LocalStorageNotAvailable extends Error {
    constructor(){
        super("Local storage not available"); 
    }
}

class ProjectNotFound extends Error {
  constructor() {
    super("Project not found");
  }
}

export default LocalStorage;