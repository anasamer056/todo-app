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
    console.log(todoList)
    return todoList.sort((a,b)=>compareAsc(a.dueDate, b.dueDate));
}

export {getCurrentDateString, capitalize, sortTodosByDateAsc};