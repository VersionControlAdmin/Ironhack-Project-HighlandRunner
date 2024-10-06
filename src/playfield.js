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
            // The dataset property allows you to store custom data attributes on HTML elements.
            // These attributes are prefixed with 'data-' in the HTML and can be accessed via the dataset property in JavaScript.

            // Here, we are setting custom data attributes 'data-row' and 'data-col' on the cell element.
            // These attributes help track the position of the cell in a grid or table.

            cell.dataset.row = row; // Use DOM data attributes to track position
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
            /**
             * Retrieves the size of an element and its position relative to the viewport.
             * 
             * The `getBoundingClientRect` method returns a DOMRect object providing information about the size of an element and its position relative to the viewport.
             * 
             * @returns {DOMRect} An object containing the properties: `x`, `y`, `width`, `height`, `top`, `right`, `bottom`, and `left`.
             * - `x` and `y` represent the coordinates of the element's top-left corner.
             * - `width` and `height` represent the dimensions of the element.
             * - `top`, `right`, `bottom`, and `left` represent the distances from the respective sides of the viewport.
             */
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
        // Define possible movement directions (up, down, left, right)
        const directions = [
            { row: -1, col: 0 }, // up
            { row: 1, col: 0 },  // down
            { row: 0, col: -1 }, // left
            { row: 0, col: 1 }   // right
        ];

        // Initialize the queue with the starting position and path
        const queue = [{ row: startRow, col: startCol, path: [{ row: startRow, col: startCol }] }];
        // Create a set to keep track of visited cells
        const visited = new Set();
        // Mark the starting cell as visited
        visited.add(`${startRow},${startCol}`);

        // Process the queue until it's empty
        while (queue.length > 0) {
            // Dequeue the first element
            const current = queue.shift();
            const { row, col, path } = current;

            // Check if the destination is reached
            if (row === destRow && col === destCol) {
                // Return the path to the destination as an array of cell elements
                return path.map(({ row, col }) => this.getCellFromRowCol(row, col));
            }

            // Explore all possible directions
            for (const direction of directions) {
                const newRow = row + direction.row;
                const newCol = col + direction.col;
                const newKey = `${newRow},${newCol}`;

                // Check if the new position is within bounds, not occupied, and not visited
                if (
                    newRow >= 0 && newRow < this.initialOccupiedCellsArray.length &&
                    newCol >= 0 && newCol < this.initialOccupiedCellsArray[0].length &&
                    !this.isCellOccupied(newRow, newCol) &&
                    !visited.has(newKey)
                ) {
                    // Mark the new cell as visited
                    visited.add(newKey);
                    // Enqueue the new position with the updated path
                    queue.push({ row: newRow, col: newCol, path: [...path, { row: newRow, col: newCol }] });
                }
            }
        }
        // Return null if no path is found
        return null;
    }

    markActivePathCells(activePath) {
        // Remove the 'active-path-cell' class from all cells
        const allCells = document.querySelectorAll(".grid-cell");
        allCells.forEach((cell) => {
            cell.classList.remove("active-path-cell");
        });

        // Add the 'active-path-cell' class to the cells in the active path
        activePath.forEach((cell) => {
            cell.classList.add("active-path-cell");
        });
    }

}

