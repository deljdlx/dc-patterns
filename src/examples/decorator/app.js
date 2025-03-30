class Task {
    title = '';
    description = '';
    category = '';

    constructor(title, description, category) {
        this.title = title;
        this.description = description;
        this.category = category;
    }

    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getCategory() {
        return this.category;
    }
}

// ===========================

class TaskRenderer
{
    container;
    constructor(container) {
        this.container = container;
    }

    render(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');

        // ⚠️ this method does not exist in the Task class !
        taskElement.classList.add(task.getClassName());


        taskElement.innerHTML = `
            <h3>${task.getTitle()}</h3>
            <p>${task.getDescription()}</p>
        `;
        this.container.appendChild(taskElement);
    }
}

// ===========================

class DecoratedTask
{
    constructor(task)
    {
        this.task = task;
    }

    // ⚠️ this method does not exist in the Task class
    // the decorator add the getClassName method to the Task class to allow the TaskRenderer to render the task
    getClassName() {
        return 'category-' + this.task.getCategory();
    }


    // all other methods are delegated to the Task object
    getTitle() {
        return this.task.getTitle();
    }

    getDescription() {
        return this.task.getDescription();
    }

    getCategory() {
        return this.task.getCategory();
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const taskRenderer = new TaskRenderer(
        document.querySelector('#tasks')
    );

    const form = document.getElementById('task-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // create a task object from the form data
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const category = document.getElementById('task-category').value;
        const task = new Task(title, description, category);

        // ⚠️ we have to decorate the task before rendering, because Task class does not have the getClassName method
        const decoratedTask = new DecoratedTask(task);

        // render the task
        taskRenderer.render(decoratedTask);
    });
});
