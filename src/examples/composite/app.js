// Composite pattern illustration

// ⚠️ The BeerNode class is the base class for all nodes in the tree.
class BeerNode {
  children = [];
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  add(child) {
    this.children.push(child);
  }

  render() {
    throw new Error('Must be implemented');
  }
}


// ⚠️ The BeerCategory class represents a composite node in the tree.
class BeerCategory extends BeerNode {
  constructor(name) {
    super(name);
  }

  render() {
    const li = document.createElement('li');
    li.classList.add('category');
    li.innerHTML = `<strong>${this.name}</strong>`;
    const ul = document.createElement('ul');
    this.children.forEach(child => ul.appendChild(child.render()));
    li.appendChild(ul);
    return li;
  }
}


// ⚠️ The Beer class represents a leaf node in the tree.
class Beer extends BeerNode {
  render() {
    const li = document.createElement('li');
    li.classList.add('beer');
    li.textContent = this.name;
    return li;
  }

  // ⚠️ A beer cannot have children, so we throw an error if we try to add one
  add() {
    throw new Error('Cannot add children to a leaf node');
  }
}


// UX ===========================
document.addEventListener('DOMContentLoaded', async () => {

  // build the tree from the JSON data; not part of the pattern, but needed to build the tree
  function buildBeerTreeFromJson(obj) {
    if (!obj.children || obj.children.length === 0) {
      return new Beer(obj.name);
    }
    const category = new BeerCategory(obj.name);
    obj.children.forEach(child => {
      category.add(buildBeerTreeFromJson(child));
    });
    return category;
  }

  const beers = await fetch('./beers.json').then(async (response) => {
    return response.json()
  });

  const textarea = document.getElementById('beer-json');
  textarea.value = JSON.stringify(beers, null, 2);

  document.getElementById('build-tree').addEventListener('click', () => {
    const rawJson = document.getElementById('beer-json').value;
    const container = document.getElementById('beer-tree');
    container.innerHTML = '';

    try {
      const data = JSON.parse(rawJson);
      const root = buildBeerTreeFromJson(data);

      // ⚠️ render the tree
      const tree = root.render();

      const ul = document.createElement('ul');
      ul.classList.add('tree');
      ul.appendChild(tree);

      container.appendChild(ul);
    } catch (e) {
      container.textContent = '❌ JSON is invalid';
    }
  });
});