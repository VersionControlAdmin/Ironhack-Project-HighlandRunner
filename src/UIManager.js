class UIManager {
    constructor(game ,lives, money, currentWave, gameScreen, waveSpan, moneySpan, liveSpan, newTowerButton, playField, soundManager) {
        this.game = game;
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
        this.soundManager = soundManager;
        this.uiBarBottomElement = document.querySelector(".ui-bar-bottom");
        this.endScoreSpan = document.querySelector("#end-score");
        this.removeTowerButtion = document.querySelector(".remove-tower-button");
        this.fastForwardButton = document.querySelector(".ui-fast-forward-button");
        this.towers = []; // Initialize towers array

        // Bind the handleClick and handleRemoveClick methods to the instance
        this.handleClick = this.handleClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    initiate() {
        // Set all Event Listeners
        this.placeTowerImg.addEventListener("click", () => this.placeTower());
        this.removeTowerButtion.addEventListener("click", () => this.removeTowerSelection());
        this.fastForwardButton.addEventListener("click",() => this.toggleFastForwardMode())
    }

    placeTower() {
        if (this.game.money < 100) {
            alert("You don't have enough money to purchase that tower for 100$");
            return;
        }
        this.playField.toggleGridVisibility();
        console.log("Tower place view toggled");

        this.uiBarBottomElement.style.zIndex = "0"; // Hide the UI bar

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
            this.playField.toggleGridVisibility();
            this.uiBarBottomElement.style.zIndex = "1000"; // Show the UI bar
            return; // Exit the method
        } 
        
        // Temporarily mark the cell as occupied
        if (cell) {
            cell.classList.add('occupied');
            cell.dataset.occupied = "true";
        }

        if (this.playField.findPathToDestination(this.game.spawnRow, this.game.spawnColumn, this.game.destinationRow, this.game.destinationColumn) === null) {
            // Show error message
            alert("You can't place a tower on the path!");

            // Remove the event listener after clicking on a path cell
            this.playField.gameContainer.removeEventListener('click', this.handleClick);

            // Revert the cell to unoccupied
            if (cell) {
            cell.classList.remove('occupied');
            delete cell.dataset.occupied;
            }
            this.playField.toggleGridVisibility();
            this.uiBarBottomElement.style.zIndex = "1000"; // Show the UI bar
            return; // Exit the method
        } else {
            // Revert the cell to unoccupied before proceeding
            if (cell) {
            cell.classList.remove('occupied');
            delete cell.dataset.occupied;
            }
            // Create and place the new tower
            console.log(cell);
            const newTower = new Tower(this.playField, cell, this.game, this.soundManager);
            this.towers.push(newTower);
            this.game.money -= newTower.towerPrice;

            // Mark the cell as occupied
            if (cell) {
                cell.classList.add('occupied');
                cell.dataset.occupied = "true";
            }

            // Hide the grid after placing the tower
            this.playField.toggleGridVisibility();
            this.uiBarBottomElement.style.zIndex = "1000"; // Show the UI bar
        }

        // Remove the event listener after placing the tower
        this.playField.gameContainer.removeEventListener('click', this.handleClick);
        this.uiBarBottomElement.style.zIndex = "1000"; // Show the UI bar
    }

    updateUiBarTop (lives, money, currentWave) {
        this.waveSpan.innerText = currentWave;
        this.moneySpan.innerText = money;
        this.liveSpan.innerText = lives;
    }

    updateEndScreen() {
        this.endScoreSpan.innerText = this.game.currentWave;
    }

    removeTowerSelection () {
        this.playField.toggleGridVisibility();
        console.log("Tower remove view toggled");

        this.uiBarBottomElement.style.zIndex = "0"; // Hide the UI bar

        // Enable pointer events to capture the click
        this.playField.gameContainer.style.pointerEvents = 'auto';

        // Add event listener to capture the next click
        console.log("Adding click event listener");
        this.playField.gameContainer.addEventListener('click', this.handleRemoveClick);
    }

    handleRemoveClick (event) {
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

        // Check if the cell is not occupied
        const cell = this.playField.gameContainer.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
        if (cell && (!cell.classList.contains('occupied') || !this.towers.some(tower => tower.cell === cell))) {
            alert("This cell is not occupied by a tower! You cannot sell/remove it");
            this.playField.gameContainer.removeEventListener('click', this.handleRemoveClick);
            this.playField.toggleGridVisibility();
            this.uiBarBottomElement.style.zIndex = "1000"; // Show the UI bar
            return;
        } else {
            // Remove the tower from the cell
            const tower = this.towers.find(tower => tower.cell === cell);
            if (tower) {
                this.removeTower(tower);
                this.playField.gameContainer.removeEventListener('click', this.handleRemoveClick);  
            }
            this.playField.gameContainer.removeEventListener('click', this.handleRemoveClick);
            this.playField.toggleGridVisibility();
            this.uiBarBottomElement.style.zIndex = "1000"; // Show the UI bar
        }
    }

    
    removeTower(tower) {
        const index = this.towers.indexOf(tower);
        if (index > -1) {
            this.towers.splice(index, 1);
            tower.cell.dataset.occupied = "false";
            tower.cell.classList.remove('occupied');
            tower.remove();
            this.game.money += Math.round(tower.towerPrice/3);
            console.log(`Tower removed. Remaining towers: ${this.towers.length}`);
        }
    }

    toggleFastForwardMode() {
        this.game.fastForwardStatus = !this.game.fastForwardStatus;
        this.game.updateGameLoopIntervals();
        this.fastForwardButton.classList.toggle('active');
    
        // Update troop animation classes based on fast forward status
        const troops = document.querySelectorAll('.troop');
        troops.forEach(troop => {
            // Determine the current animation class
            let currentClass = '';
            if (troop.classList.contains('troop-left-right')) currentClass = 'troop-left-right';
            if (troop.classList.contains('troop-right-left')) currentClass = 'troop-right-left';
            if (troop.classList.contains('troop-top-bottom')) currentClass = 'troop-top-bottom';
            if (troop.classList.contains('troop-bottom-top')) currentClass = 'troop-bottom-top';
            if (troop.classList.contains('troop-left-right-fast')) currentClass = 'troop-left-right-fast';
            if (troop.classList.contains('troop-right-left-fast')) currentClass = 'troop-right-left-fast';
            if (troop.classList.contains('troop-top-bottom-fast')) currentClass = 'troop-top-bottom-fast';
            if (troop.classList.contains('troop-bottom-top-fast')) currentClass = 'troop-bottom-top-fast';
    
            // Remove all animation classes
            troop.classList.remove(
                'troop-left-right', 'troop-right-left', 'troop-top-bottom', 'troop-bottom-top',
                'troop-left-right-fast', 'troop-right-left-fast', 'troop-top-bottom-fast', 'troop-bottom-top-fast'
            );
    
            // Add the appropriate class based on the fast forward status
            if (this.game.fastForwardStatus) {
                if (currentClass === 'troop-left-right' || currentClass === 'troop-left-right-fast') troop.classList.add('troop-left-right-fast');
                if (currentClass === 'troop-right-left' || currentClass === 'troop-right-left-fast') troop.classList.add('troop-right-left-fast');
                if (currentClass === 'troop-top-bottom' || currentClass === 'troop-top-bottom-fast') troop.classList.add('troop-top-bottom-fast');
                if (currentClass === 'troop-bottom-top' || currentClass === 'troop-bottom-top-fast') troop.classList.add('troop-bottom-top-fast');
            } else {
                if (currentClass === 'troop-left-right' || currentClass === 'troop-left-right-fast') troop.classList.add('troop-left-right');
                if (currentClass === 'troop-right-left' || currentClass === 'troop-right-left-fast') troop.classList.add('troop-right-left');
                if (currentClass === 'troop-top-bottom' || currentClass === 'troop-top-bottom-fast') troop.classList.add('troop-top-bottom');
                if (currentClass === 'troop-bottom-top' || currentClass === 'troop-bottom-top-fast') troop.classList.add('troop-bottom-top');
            }
        });
    }
}