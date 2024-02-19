import { compareAsc } from "date-fns";

function getCurrentDateString() {

    const year = new Date().getFullYear().toString();
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const day = new Date().getDate().toString().padStart(2, "0");

    return year + "-" + month + "-" + day;
}

function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
function sortTodosByDateAsc(projects) {
    projects.forEach((project, i) => {
        project.todos = project.todos.sort((a, b) => compareAsc(a.dueDate, b.dueDate));

        if (project.todos.length === 0){
            projects.splice(i,1);
        }
    })
    console.log("blabalba");
    return projects;
}

function filterCurrentWeekTodos(projects) {
    const today = new Date()
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);

    projects.forEach((project, i) => {
        project.todos = project.todos.filter((todo) => todo.dueDate < oneWeekFromNow);

        if (project.todos.length === 0){
            projects.splice(i,1);
        }
    })
    return projects;
}

function filterTodayTodos(projects) {
    const today = new Date();
    projects.forEach((project, i) => {
        project.todos = project.todos.filter((todo) => todo.dueDate.toDateString() === today.toDateString());
        
        if (project.todos.length === 0){
            projects.splice(i,1);
        }
    })
    return projects;
}



export { getCurrentDateString, capitalize, sortTodosByDateAsc, filterCurrentWeekTodos, filterTodayTodos };