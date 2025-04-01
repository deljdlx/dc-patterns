// =================== Matrix Structure ===================

class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.cells = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.cells.push({ x, y });
      }
    }
  }

  getSize() {
    return this.rows * this.cols;
  }
}

// =================== Iterator Interface ===================

class MatrixIterator {
  constructor(matrix) {
    this.matrix = matrix;
    this.index = 0;
  }

  next() {
    throw new Error("Must be implemented");
  }

  hasNext() {
    throw new Error("Must be implemented");
  }
}

// ========== Row-wise Iterator (line by line) ==========

class RowIterator extends MatrixIterator {
  constructor(matrix) {
    super(matrix);
    this.total = matrix.getSize();
  }

  next() {
    if (!this.hasNext()) return null;
    const { cols } = this.matrix;
    const y = Math.floor(this.index / cols);
    const x = this.index % cols;
    this.index++;
    return { x, y };
  }

  hasNext() {
    return this.index < this.total;
  }
}

// ========== Column-wise Iterator ==========

class ColumnIterator extends MatrixIterator {
  constructor(matrix) {
    super(matrix);
    this.x = 0;
    this.y = 0;
  }

  next() {
    if (!this.hasNext()) return null;
    const pos = { x: this.x, y: this.y };

    this.y++;
    if (this.y >= this.matrix.rows) {
      this.y = 0;
      this.x++;
    }

    return pos;
  }

  hasNext() {
    return this.x < this.matrix.cols;
  }
}


// Fancy iterator, just for the demo and the fun ===========================
// This illustrates how you can create a more complex iterator.

class FancyIterator extends MatrixIterator {
  constructor(matrix) {
      super(matrix);
      this.path = this.computeSpiralPath();
      this.index = 0;
  }

  // Precompute spiral path
  computeSpiralPath() {
      const visited = new Set();
      const path = [];

      const { rows, cols } = this.matrix;
      let top = 0, bottom = rows - 1;
      let left = 0, right = cols - 1;

      while (top <= bottom && left <= right) {
          for (let x = left; x <= right; x++) path.push({ x, y: top });
          top++;
          for (let y = top; y <= bottom; y++) path.push({ x: right, y });
          right--;
          for (let x = right; x >= left; x--) path.push({ x, y: bottom });
          bottom--;
          for (let y = bottom; y >= top; y--) path.push({ x: left, y });
          left++;
      }

      return path;
  }

  hasNext() {
      return this.index < this.path.length;
  }

  next() {
      if (!this.hasNext()) return null;
      return this.path[this.index++];
  }
}


// =================== Painter ===================

class MatrixPainter {
  constructor(matrix, iterator, cellSelectorPrefix = "cell-") {
    this.matrix = matrix;
    this.iterator = iterator;
    this.cellSelectorPrefix = cellSelectorPrefix;
    this.interval = null;
  }

  start(delay = 100) {
    if (this.interval) return;

    this.interval = setInterval(() => {
      if (this.iterator.hasNext()) {
        const { x, y } = this.iterator.next();
        const cell = document.getElementById(`${this.cellSelectorPrefix}${x}-${y}`);
        if (cell) cell.classList.add('active');
      } else {
        clearInterval(this.interval);
        this.interval = null;
      }
    }, delay);
  }

  reset() {
    document.querySelectorAll(`.${this.cellSelectorPrefix}cell`).forEach(cell => {
      cell.classList.remove('active');
    });
    this.iterator.index = 0;
    this.iterator.x = 0;
    this.iterator.y = 0;
    clearInterval(this.interval);
    this.interval = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Dynamically create the grid
  function generateGrid(rows, cols) {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const div = document.createElement('div');
        div.id = `cell-${x}-${y}`;
        div.className = 'cell cell-cell';
        container.appendChild(div);
      }
    }
  }

  const rows = 8;
  const cols = 8;
  const matrix = new Matrix(rows, cols);

  const container = document.getElementById('matrix-container');
  container.style.width = `${cols * 44}px`;

  generateGrid(rows, cols);

  // Iterator switcher
  let painter = null;

  document.getElementById('row-mode').addEventListener('click', () => {
    if (painter) painter.reset();
    const rowIterator = new RowIterator(matrix);
    painter = new MatrixPainter(matrix, rowIterator);
    painter.start(100);
  });

  document.getElementById('col-mode').addEventListener('click', () => {
    if (painter) painter.reset();
    const colIterator = new ColumnIterator(matrix);
    painter = new MatrixPainter(matrix, colIterator);
    painter.start(100);
  });

  document.getElementById('fancy-mode').addEventListener('click', () => {
    if (painter) painter.reset();
    const fancy = new FancyIterator(matrix);
    painter = new MatrixPainter(matrix, fancy);
    painter.start(100);
});

  document.getElementById('reset').addEventListener('click', () => {
    if (painter) painter.reset();
  });
});
