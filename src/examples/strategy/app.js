

class PeopleList {
    list = [];
    constructor(list = []) {
        this.list = list;
    }

    // 📌 Set the strategy.
    // With a OOP langage, strategy parameter would be an instance of a class that implements the RenderStrategy interface.
    setRenderStrategy(strategy) {
        this.strategy = strategy;
    }

    render(container) {
        container.innerHTML = '';

        // 📌 Use the strategy to render the list
        const element = this.strategy.render(this.list);
        container.appendChild(element);
    }
}

// Stategies ===========================

// With a real OOP language, each concrete strategy would implement an interface.
/**
 * For example, in TypeScript:
 *  interface RenderStrategy {
 *     render(list: any[]): HTMLElement;
 * }
  */

class TableStrategy {
    render(list) {
        const element = document.createElement('table');
        element.classList.add('table');
        element.innerHTML = list.map((item) => {
            return `<tr>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>${item.description}</td>
            </tr>`;
        }).join('');

        return element;
    }
}

class CardStrategy {
    render(list) {
        const container = document.createElement('div');
        container.classList.add('cards');
        container.innerHTML = list.map((item) => {
            return `<div class="card">
                <div class="card-image" style="background-image: url('${item.image}');"></div>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            </div>`;
        }).join('');

        return container;
    }
}

// UX ===========================

document.addEventListener('DOMContentLoaded', () => {
    const persons = [
        {
            name: 'Alan Turing',
            description: 'Mathematician, computer scientist, logician, cryptanalyst, philosopher, and theoretical biologist.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Alan_Turing_%281912-1954%29_in_1936_at_Princeton_University.jpg/250px-Alan_Turing_%281912-1954%29_in_1936_at_Princeton_University.jpg'
        },
        {
            name: 'Ada Lovelace',
            description: 'Mathematician and writer, chiefly known for her work on Charles Babbage\'s early mechanical general-purpose computer, the Analytical Engine.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Ada_Byron_daguerreotype_by_Antoine_Claudet_1843_or_1850_-_cropped.png/260px-Ada_Byron_daguerreotype_by_Antoine_Claudet_1843_or_1850_-_cropped.png'
        },
        {
            name: 'Grace Hopper',
            description: 'Computer scientist and United States Navy rear admiral. Created the first compiler for a computer programming language.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Commodore_Grace_M._Hopper%2C_USN_%28covered%29.jpg/260px-Commodore_Grace_M._Hopper%2C_USN_%28covered%29.jpg'
        },
        {
            name: 'Margaret Hamilton',
            description: 'Computer scientist, systems engineer, and business owner. Worked at MIT on the Apollo space program.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Margaret_Hamilton_1995.jpg/220px-Margaret_Hamilton_1995.jpg'
        },
        {
            name: 'Yukihiro Matsumoto',
            description: 'Computer scientist and software programmer best known as the chief designer of the Ruby programming language.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Yukihiro_Matsumoto_EuRuKo_2011.jpg/330px-Yukihiro_Matsumoto_EuRuKo_2011.jpg'
        },
        {
            name: 'Barbara Liskov',
            description: 'Computer scientist who is an Institute Professor at the MIT and Ford Professor of Engineering in its School of Engineering\'s electrical engineering and computer science department. Well known for her work in programming languages and software engineering.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Barbara_Liskov.PNG'

        },
        {
            name: 'Denis Ritchie',
            description: 'Computer scientist. He created the C programming language and, with long-time colleague Ken Thompson, the Unix operating system.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Dennis_Ritchie_2011.jpg/260px-Dennis_Ritchie_2011.jpg'
        },
        {
            name: 'Donald Knuth',
            description: 'Computer scientist, mathematician, and professor emeritus at Stanford University. Author of the multi-volume work The Art of Computer Programming.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Donald_Ervin_Knuth_%28cropped%29.jpg/330px-Donald_Ervin_Knuth_%28cropped%29.jpg',
        },
        {
            name: 'Ken Thompson',
            description: 'Computer scientist and co-creator of the Unix operating system.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Ken_Thompson%2C_2019.jpg/260px-Ken_Thompson%2C_2019.jpg'
        },
        {
            name: 'Martin Fowler',
            description: 'Software developer, author, and international public speaker on software development, specializing in object-oriented analysis and design, UML, patterns, and agile software development methodologies.',
            image: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Martin_Fowler_QCon_2007.jpg',
        },
    ];

    const displayAsTableTrigger = document.getElementById('view-as-table');
    const displayAsCardsTrigger = document.getElementById('view-as-cards');
    const listContainer = document.getElementById('people-list');

    const peopleList = new PeopleList(persons);
    peopleList.setRenderStrategy(new CardStrategy());
    peopleList.render(document.getElementById('people-list'));

    // ⚠️ Selecting the strategy
    displayAsTableTrigger.addEventListener('click', () => {
        peopleList.setRenderStrategy(new TableStrategy());
        peopleList.render(listContainer);
    });

    displayAsCardsTrigger.addEventListener('click', () => {
        peopleList.setRenderStrategy(new CardStrategy());
        peopleList.render(listContainer);
    });
});
