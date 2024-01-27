import Project from "../domain/entities/project";
import Todo from "../domain/entities/todo";

class LocalStorage {
    constructor(){
        
    }
    /**
     * Writes a `todo` to the local storage under `project`
     * @param {Project} project 
     * @param {Todo} todo 
     */
    addTodoToDb(project, todo){
        if(!this.$storageAvailable()){
            throw new localStorageNotAvailable();
        }
        
        if(localStorage.getItem(project.title)){
            const todoList = JSON.parse(localStorage.getItem(project.title));
            todoList.push(todo);
            localStorage.setItem(project.title, JSON.stringify(todoList));
        } else {
            localStorage.setItem(project.title, JSON.stringify([todo]));
        }
        
    }

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
class localStorageNotAvailable extends Error {
    constructor(){
        super("Local storage not available"); 
    }
}

export default LocalStorage;