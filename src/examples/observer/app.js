class Counter {
    // ⚠️ store the listeners in an object
    listeners = {
        change: [],
        increment: [],
        decrement: []
    };
    value = 0;
    element = null;

    constructor(element, value = 0) {
        this.value = value;
        this.element = element;
    }

    // ⚠️ add the observer to the listeners object
    addEventListener(evenName, observer) {
        this.listeners[evenName].push(observer);
    }

    // ⚠️ dispatch the event to the observers
    dispatch(eventName) {
        if(typeof this.listeners[eventName] === 'undefined') {
            return;
        }

        for (let observer of this.listeners[eventName]) {
            observer.handle(this.value);
        }
    }

    increment() {
        this.value++;
        this.element.innerHTML = this.value;
        this.dispatch('change');
        this.dispatch('increment');
    }

    decrement() {
        this.value--;
        this.element.innerHTML = this.value;
        this.dispatch('change');
        this.dispatch('decrement');
    }
}

class ClickLogger {
    name = '';
    eventName = '';
    message = '';

    element = null
    logContainer = null;

    constructor(container, eventName, name, message) {
        this.name = name;
        this.eventName = eventName;
        this.message = message;

        this.logContainer = container;
    }

    // ⚠️ handle the event, add an entry to the log container
    handle(value) {
        const logEntry = document.createElement('div');
        logEntry.classList.add('log-entry');

        const titleElement = document.createElement('div');
        titleElement.classList.add('log-title');
            const eventNameElement = document.createElement('span');
            eventNameElement.classList.add('log-event', this.eventName);
            titleElement.appendChild(eventNameElement);

            const nameElement = document.createElement('span');
            nameElement.classList.add('log-name');
            nameElement.innerHTML = this.name;
            titleElement.appendChild(nameElement);
        logEntry.appendChild(titleElement);

        const messageElement = document.createElement('em');
        messageElement.classList.add('log-message');
        messageElement.innerHTML = this.message + ' : ' + value;
        logEntry.appendChild(messageElement);

        this.logContainer.appendChild(logEntry);
    }

    getElement() {
        if(this.element !== null) {
            return this.element;
        }

        this.element = document.createElement('div');
        this.element.classList.add('observer');

        const eventNameElement = document.createElement('span');
        eventNameElement.classList.add('observer-event', this.eventName);
        this.element.appendChild(eventNameElement);

        const nameElement = document.createElement('span');
        nameElement.classList.add('observer-name');
        nameElement.innerHTML = this.name;
        this.element.appendChild(nameElement);

        return this.element;
    }
}

// UX ===========================

document.addEventListener('DOMContentLoaded', () => {
    const counter = new Counter(document.querySelector('#counter'), 0);
    const incrementButton = document.querySelector('#incrementTrigger');
    const decrementButton = document.querySelector('#decrementTrigger');

    const clearButton = document.querySelector('#clearLogs');
    const logContainer = document.querySelector('#logs');
    const observersContainer = document.querySelector('#observers');
    const form = document.querySelector('#observer-form')

    clearButton.addEventListener('click', () => {
        logContainer.innerHTML = '';
    });


    incrementButton.addEventListener('click', () => {
        counter.increment();
    });

    decrementButton.addEventListener('click', () => {
        counter.decrement();
    });

    // ===========================
    const demoLogger = new ClickLogger(logContainer, 'change', 'Demo logger', 'Button value changed');
    counter.addEventListener('change', demoLogger);
    observersContainer.appendChild(demoLogger.getElement());

    // ===========================

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.querySelector('#observer-name').value;
        const eventName = document.querySelector('#observer-event').value;
        const message = document.querySelector('#observer-message').value;

        // ⚠️ create a new observer and add it to the counter
        const clickLogger = new ClickLogger(logContainer, eventName, name, message);
        counter.addEventListener(eventName, clickLogger);
        observersContainer.appendChild(clickLogger.getElement());
    });
});
