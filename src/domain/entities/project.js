/**
 * Represents projects or lists into which the user can save todos
 */
class Project {
    /**
     * Creates a `Project`
     * @param {string} title - The title of the project
     */
    constructor(title, timestamp){
        this.title = title;
        this.timestamp = timestamp;
    }

    static fromJSON(projectJson){
        const parsedJson = JSON.parse(projectJson);
        return new Project(parsedJson.project.title, parsedJson.project.timestamp);
    }
}

export default Project;