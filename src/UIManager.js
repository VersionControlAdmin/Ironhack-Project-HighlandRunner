class UIManager {
    constructor(lives, money, currentWave, gameScreen, waveSpan, moneySpan, liveSpan, newTowerButton, playField) {
        this.lives = lives;
        this.money = money;
        this.currentWave = currentWave;
        this.gameScreen = gameScreen;
        this.waveSpan = waveSpan;
        this.moneySpan = moneySpan;
        this.liveSpan = liveSpan;
        this.newTowerButton = newTowerButton;
        this.playField = playField;
        this.placeTowerImg = newTowerButton;
        this.towers = []; // Initialize towers array

        // Bind the handleClick method to the instance
        this.handleClick = this.handleClick.bind(this);
    }

    initiate() {
        // Set all Event Listeners
        this.placeTowerImg.addEventListener("click", () => this.placeTower());
    }

    placeTower() {
        this.playField.toggleGridVisibility();
        console.log("Tower place view toggled");

        // Enable pointer events to capture the click
        this.playField.gameContainer.style.pointerEvents = 'auto';

        // Add event listener to capture the next click
        console.log("Adding click event listener");
        this.playField.gameContainer.addEventListener('click', this.handleClick);
    }

    handleClick(event) {
        console.log("Click event captured");

        const rect = this.playField.gameContainer.getBoundingClientRect();
        console.log(rect);
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        console.log(`X: ${x}, Y: ${y}`);

        // Calculate row and column based on click coordinates
        const cellWidth = this.playField.gameContainer.clientWidth / 20;
        const cellHeight = this.playField.gameContainer.clientHeight / 7;
        const col = Math.floor(x / cellWidth);
        const row = Math.floor(y / cellHeight);
        console.log(`Row: ${row}, Column: ${col}`);

        // Check if the cell is occupied
        const cell = this.playField.gameContainer.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
        if (cell && cell.classList.contains('occupied')) {
            // Show error message
            alert("This cell is occupied!");

            // Remove the event listener after clicking on an occupied cell
            this.playField.gameContainer.removeEventListener('click', this.handleClick);
            return; // Exit the method
        } else {
            // Create and place the new tower
            console.log(cell);
            const newTower = new Tower(this.playField, cell);
            this.towers.push(newTower);

            // Mark the cell as occupied
            if (cell) {
                cell.classList.add('occupied');
                cell.dataset.occupied = "true";
            }

            // Hide the grid after placing the tower
            this.playField.toggleGridVisibility();
        }

        // Remove the event listener after placing the tower
        this.playField.gameContainer.removeEventListener('click', this.handleClick);
    }
}