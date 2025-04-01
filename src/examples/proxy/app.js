class Counter {
    element;
    count = 0;

    constructor(element, start = 0) {
        this.count = start;
        this.element = element;
    }

    increment() {
        this.count++;
        this.render();
    }

    render() {
        this.element.innerHTML = this.getCount();
    }

    getCount() {
        return this.count;
    }
}

// Proxy ===========================
// ⚠️ With js, there is a native Proxy object that can be used to create a proxy object. But in this case, we are using a class for the sake of the example.
// ⚠️⚠️ for this example, the proxy is not a real proxy pattern, it's just a way to show how a proxy could be used in a real case.
class CounterProxy {

    counter;
    enabled = true;
    element;

    constructor(element, counter) {
        this.counter = counter;
        this.element = element;
    }

    // 📌 The proxy can intercept the increment method and decide if it should be called or not.
    increment() {
        if (!this.enabled) {
            return;
        }
        this.counter.increment();
        this.render();
    }

    render() {
        this.element.classList.remove('disabled');
        if(!this.enabled) {
            this.element.classList.add('disabled');
        }

        if(this.counter.getCount() % 2 === 0) {
            this.element.classList.add('even');
            this.element.classList.remove('odd');
        } else {
            this.element.classList.add('odd');
            this.element.classList.remove('even');
        }

        this.element.innerHTML = this.counter.getCount();
    }

    toggleEnabled() {
        this.enabled = !this.enabled;
        this.render();
    }
}


// UX ===========================

document.addEventListener('DOMContentLoaded', () => {
    const counterElement = document.querySelector('#counter');
    const counter = new Counter(counterElement);

    const lockToggle = document.querySelector('#lock');

    const proxy = new CounterProxy(counterElement, counter);
    proxy.render();

    lockToggle.addEventListener('click', () => {
        proxy.toggleEnabled();
    });


    counterElement.addEventListener('click', () => {
        proxy.increment();
    });
});
