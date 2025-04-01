// ========== Adapter Pattern: oz → ml ==========
class Cocktail {
  constructor(name, ingredients) {
    this.name = name;
    this.ingredients = ingredients;
  }
}


class CocktailAdapter {
  constructor(originalCocktail) {
    this.originalCocktail = originalCocktail;
  }

  get name() {
    return this.originalCocktail.name;
  }

  get ingredients() {
    return this.originalCocktail.ingredients.map(ing => ({
      name: ing.name,
      amount: Math.round(ing.amount * 29.5735),
      unit: 'ml',
      color: ing.color
    }));
  }
}




// ========== Gradient Generator not part of the pattern ==========
function generateGradient(cocktail) {
  const total = cocktail.ingredients.reduce((sum, i) => sum + i.amount, 0);
  const ingredients = [...cocktail.ingredients].reverse();
  const transitions = 10;

  let current = 0;
  const stops = [];

  for (let i = 0; i < ingredients.length; i++) {
    const ing = ingredients[i];
    const start = (current / total) * 100;
    const end = ((current + ing.amount) / total) * 100;
    const mid = end - transitions;

    stops.push(`${ing.color} ${start.toFixed(1)}%`);

    if (i < ingredients.length - 1) {
      stops.push(`${ing.color} ${mid.toFixed(1)}%`);
    } else {
      stops.push(`${ing.color} ${end.toFixed(1)}%`);
    }

    current += ing.amount;
  }

  return `linear-gradient(to top, ${stops.join(', ')})`;
}

// ========== DOM rendering ; not part of the pattern ==========
function renderCocktailData(cocktail, targetId) {
  const el = document.getElementById(targetId);
  el.innerHTML = `
      <h3>${cocktail.name} (${cocktail.ingredients[0].unit})</h3>
      <ul>
          ${cocktail.ingredients.map(i => `
              <li>
                  <span style="display:inline-block;width:12px;height:12px;background:${i.color};margin-right:5px;border-radius:3px;"></span>
                  ${i.name} – ${i.amount} ${i.unit}
              </li>
          `).join("")}
      </ul>
  `;
}

function renderCocktailVisual(cocktail, el) {
  el.style.background = generateGradient(cocktail);
}

document.addEventListener("DOMContentLoaded", async() => {

  const cocktails = await fetch("cocktails.json").then(res => res.json());

  const glass = document.getElementById("glass");
  const cocktailSelector = document.getElementById("cocktail-select");
  Object.keys(cocktails).forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.text = name;
    cocktailSelector.appendChild(option);
  });

  let currentCocktail = null;

  document.getElementById('cocktail-select').addEventListener('change', (e) => {
    const name = e.target.value;
    currentCocktail = cocktails[name];
    glass.background = '#fff';

    renderCocktailData(currentCocktail, "original-data");
    document.getElementById("adapted-data").innerHTML = "";
    glass.style.background = "transparent";
  });

  document.getElementById("adapt-btn").addEventListener("click", () => {

    // instantiate the original cocktail
    const cocktail = new Cocktail(currentCocktail.name, currentCocktail.ingredients);

    // 📌 Use the adapter to convert the cocktail into a cocktail with international units
    const adaptedCocktail = new CocktailAdapter(cocktail);

    // now we can use the adapted cocktail as if it was a regular cocktail
    renderCocktailData(adaptedCocktail, "adapted-data");
    renderCocktailVisual(adaptedCocktail, glass);
  });
});
