
// Here a Multiton pattern is used to create a Governement with Ministries.
// Immediately Invoked Function Expression(IIFE), hides the class from the global scope, but exposes the getInstance method
const Ministry = (() => {
    // 📌 store the named instances
    let instances = {};

    // The class can not be instantiated from outside the IIFE
    class Ministry {
        name = '';
        minister = null;

        constructor(name) {
            this.name = name;
        }

        setMinister(minister) {
            this.minister = minister;
        }

        getMinister() {
            return this.minister;
        }

        render(container) {
            const button = document.createElement('button');
            button.classList.add('ministry');
            button.innerHTML = `<h3>${this.name}</h3> <em>${this.minister.name}</em>`;
            container.appendChild(button);


            button.addEventListener('click', () => {
                this.handleClick();
            });
        }

        handleClick() {
            const container = document.getElementById('minister');
            const minister = this.getMinister();
            const ministerElement = document.createElement('div');
            ministerElement.classList.add('person');
            ministerElement.innerHTML = `<strong>${minister.name}</strong>: ${minister.description}`;

            container.innerHTML = '';
            container.appendChild(ministerElement);
        }
    }

    return {
        // 📌 Get a Singleton instance by name
        getInstance: (name) => {
            if (typeof instances[name] === 'undefined') {
                instances[name] = new Ministry(name);
            }
            return instances[name];
        }
    }
})();

// ===========================

class Governement {
    ministries = {};

    constructor(name) {
        this.name = name;
    }

    createMinistry(domain, person) {
        // 📌 call the multiton to get the instance of the ministry
        const ministstry = Ministry.getInstance(domain);
        ministstry.setMinister(person);
        this.ministries[domain] = ministstry;

        return ministstry;
    }

    getMinistries() {
        return this.ministries;
    }

    getMinistry(name) {
        if(typeof this.ministries[name] === 'undefined') {
            throw new Error(`Ministry ${name} does not exist`);
        }
        return this.ministries[name];
    }



    render(container) {
        for (const ministryName in this.getMinistries()) {
            const ministry = this.getMinistry(ministryName);
            ministry.render(container);
        }
    }
}

// ===========================
// UX, not part of the pattern
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    const ministries = [
        'Health',
        'Education',
        'Finance',
        'Security',
        'Energy',
        'Foreign Affairs',
    ];

    const persons = [
        {name: 'Alan Turing', description: 'Mathematician, computer scientist, logician, cryptanalyst, philosopher, and theoretical biologist.'},
        {name: 'Ada Lovelace', description: 'Mathematician and writer, chiefly known for her work on Charles Babbage\'s early mechanical general-purpose computer, the Analytical Engine.'},
        {name: 'Grace Hopper', description: 'Computer scientist and United States Navy rear admiral.'},
        {name: 'Margaret Hamilton', description: 'Computer scientist, systems engineer, and business owner.'},
        {name: 'Yukihiro Matsumoto', description: 'Computer scientist and software programmer best known as the chief designer of the Ruby programming language.'},
        {name: 'Barbara Liskov', description: 'Computer scientist who is an Institute Professor at the Massachusetts Institute of Technology and Ford Professor of Engineering in its School of Engineering\'s electrical engineering and computer science department.'},
        {name: 'Denis Ritchie', description: 'Computer scientist. He created the C programming language and, with long-time colleague Ken Thompson, the Unix operating system.'},
        {name: 'Donald Knuth', description: 'Computer scientist, mathematician, and professor emeritus at Stanford University.'},
        {name: 'Ken Thompson', description: 'Computer scientist and co-creator of the Unix operating system.'},
        {name: 'Martin Fowler', description: 'Software developer, author, and international public speaker on software development, specializing in object-oriented analysis and design, UML, patterns, and agile software development methodologies.'},
    ]

    const ministriesContainer = document.getElementById('ministries');
    const government = new Governement('Algoland');

    const trigger = document.getElementById('createGovernmentTrigger');
    trigger.addEventListener('click', () => {
        // create a ministry for each domain
        ministries.forEach(domain => {
            const randomKey = Math.floor(Math.random() * persons.length);
            const minister = persons[randomKey];
            government.createMinistry(domain, minister);
        });

        ministriesContainer.innerHTML = '';
        government.render(ministriesContainer);
    });
});
