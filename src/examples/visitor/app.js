// ⚠️ We are using a decorator pattern to add some useful methods to the DOM elements.
class DomElementDecorator
{
    element;
    constructor(element) {
        this.element = element;
    }

    // 📌 The "visitor" parameter should be an instance of "Visitor"
    // in a real OOP language : accept(visitor: Visitor): any
    accept(visitor) {
        return visitor.visit(this);
    }

    // some useful methods
    getTagName() {
        return this.element.tagName;
    }

    isTitle() {
        return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(this.getTagName());
    }

    getInnerHTML() {
        return this.element.innerHTML;
    }

    getHeight() {
        return this.element.offsetHeight;
    }

    getWidth() {
        return this.element.offsetWidth;
    }

    isTextNode() {
        return this.element.nodeType === Node.TEXT_NODE;
    }

    getChildNodes() {
        const children = this.element.childNodes;
        if(!children) {
            return [];
        }

        return Array.from(children).filter((node) => node.nodeType === Node.ELEMENT_NODE);
    }
}


// Visitor, should be an interface in a real OOP language ===========================
class Visitor
{
    visit(element) {
        throw new Error('You have to implement the method visit!');
    }
}


// first visitor exemple ===========================

class TableOfContentVisitor extends Visitor
{
    // 📌 The "element" parameter should be an instance of "DomElementDecorator"
    visit(element) {
        if(!element.isTitle()) {
            return null;
        }
        const li = document.createElement('li');
        li.classList.add('toc-' + element.getTagName());
        li.innerHTML = element.getInnerHTML();
        return li;
    }
}

class TableOfContentGenerator
{
    dom;
    constructor(dom) {
        this.dom = dom;
    }

    generate() {
        const toc = document.createElement('ul');
        toc.classList.add('toc');
        const children = this.iterate(this.dom);

        children.forEach((child) => {
            if(child) {
                toc.appendChild(child);
            }
        });

        return toc;
    }

    iterate(node) {
        const children = [];
        node.childNodes.forEach((childNode) => {
            const wrappedNode = new DomElementDecorator(childNode);
            const element = wrappedNode.accept(new TableOfContentVisitor());
            if(element) {
                children.push(element);
            }
            children.push(...this.iterate(childNode));
        });

        return children;
    }
}

// Second visitor exemple ===========================

class NodeViewerVisitor extends Visitor
{
    // 📌 The "element" parameter should be an instance of "DomElementDecorator"
    visit(element) {
        if(!element.getTagName()) {
            return null;
        }
        let block = document.createElement('div');
        block.classList.add('block');


        if(!element.getChildNodes().length) {
            block.style.height = element.getHeight() + 'px';
        }

        const content = document.createElement('div');
        content.classList.add('block-content');
        content.innerHTML = element.getTagName();
        block.appendChild(content);

        return block;
    }
}

class NodesViewer
{
    dom;
    constructor(dom) {
        this.dom = dom;
    }

    generate() {
        const root = this.iterate(this.dom);
        return root;
    }

    iterate(node) {

        const wrappedNode = new DomElementDecorator(node);
        const root = wrappedNode.accept(new NodeViewerVisitor());

        if(!root) {
            return null;
        }

        node.childNodes.forEach((childNode) => {
            const child = this.iterate(childNode);
            if(child) {
                root.appendChild(child);
            }
        });

        return root;
    }
}


// UX ===========================

document.addEventListener('DOMContentLoaded', () => {
    let firtContent =
`<article>
    <h1>YAGNI: You Aren't Gonna Need It</h1>

    <p><strong>YAGNI</strong> is a principle in software development that reminds developers to <em>only implement things when they are actually needed</em>, not when they just foresee that they might need them.</p>

    <blockquote>
        "Always implement things when you actually need them, never when you just foresee that you need them."
        — Ron Jeffries, Extreme Programming
    </blockquote>

    <h2>Origins of YAGNI</h2>

    <p>The concept of YAGNI comes from the world of <strong>Extreme Programming (XP)</strong>, a methodology that values simplicity, frequent feedback, and incremental improvement.</p>

    <h3>Part of the XP Philosophy</h3>
    <p>In XP, developers are encouraged to avoid speculative work. Instead, they should focus on solving the problems that are in front of them — and nothing more.</p>

    <h2>Why YAGNI Matters</h2>

    <p>Overengineering can lead to bloated, complex systems that are hard to maintain. YAGNI helps prevent this by advocating for minimalism in code.</p>

    <h3>Benefits of YAGNI</h3>
    <ul>
        <li><strong>Faster development</strong> by focusing only on current requirements</li>
        <li><strong>Less maintenance</strong> of unused or unnecessary features</li>
        <li><strong>Greater adaptability</strong> as needs evolve</li>
    </ul>

    <h3>Risks of Ignoring YAGNI</h3>
    <p>When developers write code for "what if" scenarios that never come, it adds cognitive and technical overhead.</p>

    <h4>Examples of overengineering</h4>
    <ul>
        <li>Building a plugin system when you only need two features</li>
        <li>Creating abstract factories for a single implementation</li>
        <li>Designing for multi-tenancy when your app has only one client</li>
    </ul>

    <h2>YAGNI in Practice</h2>

    <p>Here’s a simple rule of thumb: <strong>If it’s not in the requirements, don’t build it.</strong></p>

    <h3>How to Apply YAGNI</h3>
    <ol>
        <li>Ask: “Do I need this right now?”</li>
        <li>Defer: Move speculative ideas to a backlog or a note</li>
        <li>Refactor: If the need arises later, build exactly what’s needed</li>
    </ol>

    <h2>YAGNI vs. Future-Proofing</h2>

    <p>Some developers confuse YAGNI with being short-sighted. But YAGNI doesn’t mean you never prepare for change — it means you avoid solving problems that haven’t happened yet.</p>

    <h3>Balance is Key</h3>
    <p>Use good architecture and clean code to enable change, <em>but don’t write the code for the change before it’s required</em>.</p>
</article>
    `;

    const textarea = document.querySelector('#content');
    const preview = document.querySelector('#preview');
    const tocTrigger = document.querySelector('#toc-trigger');
    const nodesTrigger = document.querySelector('#nodes-trigger');
    const tocContainer = document.querySelector('#toc');

    textarea.value = firtContent;
    preview.innerHTML = firtContent;

    const tocGenerator = new TableOfContentGenerator(preview);
    const nodesViewer = new NodesViewer(preview);


    tocTrigger.addEventListener('click', () => {
        preview.innerHTML = textarea.value;


        tocContainer.innerHTML = '';
        const toc = tocGenerator.generate();
        tocContainer.appendChild(toc);
    });

    nodesTrigger.addEventListener('click', () => {
        preview.innerHTML = textarea.value;
        tocContainer.innerHTML = '';
        const blocks = nodesViewer.generate();
        tocContainer.appendChild(blocks);
    });
});
