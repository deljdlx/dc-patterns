class Pizza
{
    ingredients = [];
    base = 'tomato';

    constructor(base, ingredients = []) {
        this.base = base;
        this.ingredients = ingredients;
    }

    getBase() {
        return this.base;
    }

    getIngredients() {
        return this.ingredients;
    }
}


// ⚠️ In the GoF pattern, a Director would typically orchestrate the build steps.
// In this case, it's overkill: the user acts as the director by interacting with the UI.
// The PizzaBuilder already encapsulates both the construction logic and UX feedback,
// which is perfectly suited for this kind of user-driven demo.

class PizzaBuilder {

    pizza;
    base = 'tomato';
    ingredients = [];

    constructor(stepContainer) {
        this.stepContainer = stepContainer;
    }

    setBase(base) {
        this.base = base;
        return this;
    }

    addIngredient(ingredient) {
        this.ingredients.push(ingredient);
        return this;
    }

    removeIngredient(ingredient) {
        this.ingredients = this.ingredients.filter(i => i !== ingredient);
        return this;
    }

    async bake() {
        await this.step('Baking the pizza', 3000);
    }

    async prepareBase() {
        await this.step(`Prepare the pizza base (${this.base})`, 1000);
    }

    async assemble() {
        for(let ingredient of this.ingredients) {
            await this.step(`Adding ${ingredient}`);
        }
    }


    async build() {

        this.stepContainer.innerHTML = '';
        this.ingredients = [...new Set(this.ingredients)];

        await this.prepareBase();
        await this.assemble();
        await this.bake();

        const pizza = new Pizza(this.base, this.ingredients);
        return pizza;
    }

    // Helper method to simulate async steps
    async step(log, duration = 1000) {
        return new Promise((resolve) => {
            const stepDiv = document.createElement('div');
            stepDiv.innerHTML = `
                ${log}
                <span class="loader">
                    <span></span><span></span><span></span>
                </span>
            `;
            this.stepContainer.appendChild(stepDiv);

            setTimeout(() => {
                stepDiv.querySelector('.loader').remove();
                resolve();
            }, duration);
        });
    }
}

// ===========================

document.addEventListener('DOMContentLoaded', () => {
    const stepContainer = document.querySelector('#steps');
    const pizzaBuilder = new PizzaBuilder(stepContainer);

    document.querySelectorAll('.base').forEach(base => {
        base.addEventListener('click', (event) => {
            const input = event.currentTarget.querySelector('input');
            if (input.checked) {
                pizzaBuilder.setBase(input.value);
            }
        });
    });

    document.querySelectorAll('.ingredient').forEach(ingredient => {
        ingredient.addEventListener('click', (event) => {
            const input = event.currentTarget.querySelector('input');

            if (input.checked) {
                pizzaBuilder.addIngredient(input.value);
            } else {
                pizzaBuilder.removeIngredient(input.value);
            }
        });
    });


    const createPizzaButton = document.querySelector('#createPizza');
    const pizzaElement = document.querySelector('#pizza');

    createPizzaButton.addEventListener('click', async () => {
        pizzaElement.innerHTML = '';
        document.querySelector('#pizza-illustration').style.display = 'none';
        const pizza = await pizzaBuilder.build(stepContainer);

        pizza.ingredients.forEach(ingredient => {
            const ingredientElement = document.createElement('div');
            ingredientElement.classList.add('ingredient');
            ingredientElement.textContent = ingredient;
            pizzaElement.appendChild(ingredientElement);
        });

        document.querySelector('.pizza__base').classList.add('pizza__base--' + pizza.getBase());
        document.querySelector('#pizza-illustration').style.display = 'block';
    });
});
