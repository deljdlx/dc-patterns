class DesignPattern {

  isRisky = false;
  isGof = false;

  constructor(item) {

    Object.entries(item).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  toHTMLElement() {
    const div = document.createElement("div");
    div.classList.add(
      "pattern",
      "column-" + this.column,
      "period-" + this.period,
    );

    if(this.isGof) {
      div.classList.add("gof");
    }

    if(this.isRisky) {
      div.classList.add("risky");
    }

    div.innerHTML = `<span class="pattern-name">${this.name}</span>`;
    if((this.demo)) {
      div.innerHTML += `<a href="${this.demo}" target="_blank" title="View demo">👀</a>`;
    }
    div.pattern = this;

    return div;
  }
}

class DesignPatternTable {
  constructor(containerSelector, jsonUrl) {
    this.container = document.querySelector(containerSelector);
    this.jsonUrl = jsonUrl;
    this.patterns = [];
    this.periods = [];
  }

  async load() {
    const response = await fetch(this.jsonUrl);
    const data = await response.json();
    this.patterns = data.patterns.map(item => new DesignPattern(item));
    this.periods = data.periods;
    this.render();
  }

  render() {
    const periods = {};

    this.patterns.forEach(pattern => {
      if (!periods[pattern.period]) {
        periods[pattern.period] = [];
      }
      periods[pattern.period].push(pattern);
    });

    Object.keys(periods).sort().forEach(period => {
      const row = document.createElement("div");
      row.className = "row";

      const label = document.createElement("div");
      label.className = "period-label";
      label.textContent = this.periods[period];
      row.appendChild(label);

      for (let i = 1; i <= 8; i++) {
        const pattern = periods[period].find(p => p.column === i);
        if (pattern) {
          const element = pattern.toHTMLElement();
          element.addEventListener("click", () => {
            this.showPopup(pattern);
          });
          row.appendChild(element);
        } else {
          const empty = document.createElement("div");
          empty.className = "pattern";
          empty.innerHTML = "—";
          row.appendChild(empty);
        }
      }

      this.container.appendChild(row);
    });
  }

  showPopup(pattern) {

    let title = pattern.name;

    if(pattern.isGof) {
      title += " (⭐GoF)";
    }


    console.group('%capplication.js :: 101 =============================', 'color: #539874; font-size: 1rem');
    console.log('pattern', pattern);
    console.groupEnd();

    if(pattern.demo) {
      title += `
        <a href="${pattern.demo}" target="_blank" title="View demo">
          View demo
        </a>
      `;
    }


    const content =  `
      <div class="pattern-description">
        <h3>Description</h3>
        <p>${pattern.description}</p>
      </div>

      <div class="pattern-example">
        <h3>Exemple</h3>
        <p>${pattern.example}</p>
      </div>
      <div class="pattern-use-cases">
        <h3>Cas d'usage</h3>
        <ul>
          ${pattern.useCases.map(useCase => `<li>${useCase}</li>`).join("")}
        </ul>
      </div>

      <div>
        <h3>Risques</h3>
        <ul>
          ${pattern.pitfalls.map(risk => `<li>${risk}</li>`).join("")}
        </ul>
      </div>

      <div>
        <h3>Patterns associés</h3>
        <ul>
          ${pattern.relatedPatterns.map(related => `<li>${related}</li>`).join("")}
        </ul>
      </div>
    `;

    document.getElementById("popup-title").innerHTML = title;
    document.getElementById("popup-description").innerHTML = content;
    document.getElementById("popup-overlay").style.display = "flex";
  }
}
