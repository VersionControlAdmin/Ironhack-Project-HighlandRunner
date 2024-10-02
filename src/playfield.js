class Playfield {
    constructor(height, width, gameScreen, gameContainer) {
        this.height = height;
        this.width = width;
        this.gameScreen = gameScreen;
        this.gameContainer = gameContainer;
        this.cellSizeHeight = this.height / 7;
        this.cellSizeWidth = this.width / 20;
        this.initialOccupiedCellsArray = [
            [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
            [true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
            [true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
            [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            [true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
            [true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true],
            [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
        ]
        this.mapimg = "./assets/maps/playfield-background-default.png";
    }

    initiate() {
        this.gameScreen.style.display = "block";
        this.gameScreen.style.backgroundImage = `url(${this.mapimg})`;
        console.log(this.gameScreen.style.backgroundImage);
        this.gameScreen.style.backgroundSize = "cover";
        this.gameScreen.style.backgroundPosition = "center";
        this.createGrid(7,20,this.gameContainer);
        this.setInitialOccupiedCells();
    } 

    createGrid(rows, columns, container) { //container = gameScreen
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < columns; col++) {
            const cell = document.createElement("div");
            cell.classList.add("grid-cell");
            cell.dataset.row = row; // Use data attributes to track position
            cell.dataset.col = col;
            container.appendChild(cell);
          }
        }
    }

    markCellOccupied(row, col) {
        const cell = document.querySelector(`.grid-cell[data-row='${row}'][data-col='${col}']`);
        if (cell) {
            cell.classList.add("occupied");
            cell.dataset.occupied = "true"; // Set a data attribute for occupancy
        }
    }

    isCellOccupied(row, col) {
        const cell = document.querySelector(`.grid-cell[data-row='${row}'][data-col='${col}']`);
        return cell && cell.dataset.occupied === "true";
    }

    toggleGridVisibility() {
        this.gameContainer.classList.toggle("show-grid"); // Toggle the 'show-grid' class
      }

    setInitialOccupiedCells() {
        for (let row = 0; row < this.initialOccupiedCellsArray.length; row++) {
          for (let col = 0; col < this.initialOccupiedCellsArray[row].length; col++) {
            if (this.initialOccupiedCellsArray[row][col]) {
              this.markCellOccupied(row, col);
            }
            }
        }
    }

    getCellRowColumnCenterPosition(row, col) {
        const cell = document.querySelector(`.grid-cell[data-row='${row}'][data-col='${col}']`);
        if (cell) {
            const rect = cell.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            return { x: centerX, y: centerY };
        }
        return null;
    }

    getCellObjectCenterPosition(cell) {
        if (cell) {
            const rect = cell.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            return { x: centerX, y: centerY };
        }
        return null;
    }

    getCellFromRowCol(row, col) {
        const cell = document.querySelector(`.grid-cell[data-row='${row}'][data-col='${col}']`);
        return cell ? cell : null;
    }

    // this method finds the active route for troops to travel to get to their destination, it returns an array in order of the next to each others cells which are not occupied but the closest to the destination. The destination cell is given as input as well as the spawn cell.
    findPathToDestination(startRow, startCol, destRow, destCol) {
        const directions = [
            { row: -1, col: 0 }, // up
            { row: 1, col: 0 },  // down
            { row: 0, col: -1 }, // left
            { row: 0, col: 1 }   // right
        ];

        const queue = [{ row: startRow, col: startCol, path: [] }];
        const visited = new Set();
        visited.add(`${startRow},${startCol}`);

        while (queue.length > 0) {
            const current = queue.shift();
            const { row, col, path } = current;

            if (row === destRow && col === destCol) {
                return path.map(({ row, col }) => this.getCellFromRowCol(row, col));
            }

            for (const direction of directions) {
                const newRow = row + direction.row;
                const newCol = col + direction.col;
                const newKey = `${newRow},${newCol}`;

                if (
                    newRow >= 0 && newRow < this.initialOccupiedCellsArray.length &&
                    newCol >= 0 && newCol < this.initialOccupiedCellsArray[0].length &&
                    !this.isCellOccupied(newRow, newCol) &&
                    !visited.has(newKey)
                ) {
                    visited.add(newKey);
                    queue.push({ row: newRow, col: newCol, path: [...path, { row: newRow, col: newCol }] });
                }
            }
        }

        // If no path found, walk straight to the destination through all cells ignoring if occupied or not
        const straightPath = [];
        let currentRow = startRow;
        let currentCol = startCol;

        while (currentRow !== destRow || currentCol !== destCol) {
            if (currentRow < destRow) currentRow++;
            else if (currentRow > destRow) currentRow--;

            if (currentCol < destCol) currentCol++;
            else if (currentCol > destCol) currentCol--;

            straightPath.push({ row: currentRow, col: currentCol });
        }

        return straightPath.map(({ row, col }) => this.getCellFromRowCol(row, col));
    }

}

