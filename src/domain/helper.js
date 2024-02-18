import {compareAsc} from "date-fns";

function getCurrentDateString(){

    const year = new Date().getFullYear().toString();
    const month = (new Date().getMonth()+1).toString().padStart(2, "0");
    const day = new Date().getDate().toString().padStart(2, "0");

    return year + "-" + month + "-" + day;
}

function capitalize(string){
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
function sortTodosByDateAsc(todoList){
    return todoList.sort((a,b)=>compareAsc(a.dueDate, b.dueDate));
}

function filterCurrentWeekTodos(projects){
    const today = new Date()
    const oneWeekFromNow = new Date(today);

    projects.forEach((project)=>{
        project
    })
    oneWeekFromNow.setDate(today.getDate() + 7);
    todos.filter((todo)=>todo.dueDate < oneWeekFromNow);
}


export {getCurrentDateString, capitalize, sortTodosByDateAsc, filterCurrentWeekTodos};