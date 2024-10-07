class Troop { 
    constructor(game, playField, spawn, troopLiveMultiplier, waveManager, enemyType) {
        this.game = game;
        this.waveManager = waveManager;
        this.playField = playField;
        this.spawn = spawn;
        this.spawnCell = this.playField.getCellFromRowCol(3, 0);
        this.destinationCell = this.waveManager.destination;
        this.enemyType = enemyType;
        this.troopLives = null;
        this.maxLives = null; // Store the maximum lives for the status bar calculation
        this.troop = document.createElement("div");
        this.troopLiveMultiplier = troopLiveMultiplier;

        //Set Troop lives & picturebased on enemy type
        switch(this.enemyType) {
            case "daemonLady":
                this.troopLives = 1 * this.troopLiveMultiplier;
                this.troop.style.backgroundImage = "url(./assets/troops/daemon-lady-walking.gif)";
                break;
            case "daemonBoss":
                this.troopLives = 3 * this.troopLiveMultiplier;
                this.troop.style.backgroundImage = "url(./assets/troops/daemon-bird-walking.gif)";
                break;
            case "finalBoss":
                this.troopLives = 5 * this.troopLiveMultiplier;
                this.troop.style.backgroundImage = "url(./assets/troops/daemon-man-walking.gif)";
                break;
            default:
                this.troopLives = 1 * this.troopLiveMultiplier;
                this.troop.style.backgroundImage = "url(./assets/troops/daemon-lady-walking.gif)";
                break;  
        }

        this.maxLives = this.troopLives;
        this.troop.classList.add("troop");
        (this.game.fastForwardStatus) ? this.troop.classList.add("troop-left-right-fast") : this.troop.classList.add("troop-left-right");
        this.troop.style.backgroundSize = "cover";
        this.troop.style.backgroundPosition = "left"; // Align background image to the left
        this.troop.style.width = "100%"; // Make troop take full width of spawnCell
        this.troop.style.height = "100%"; // Make troop take full height of spawnCell
        this.troop.style.position = "absolute"; // Position troops absolutely within spawnCell
        this.troop.style.zIndex = "1"; // Set the z-index to control stacking order
        this.troop.style.left = "0"; // Start from the left of the cell

        // Create the status bar element
        this.statusBar = document.createElement("div");
        this.statusBar.classList.add("status-bar");
        this.statusBar.style.position = "absolute";
        this.statusBar.style.top = "-10px"; // Position the status bar above the troop
        this.statusBar.style.left = "0";
        this.statusBar.style.width = "100%";
        this.statusBar.style.height = "5px";
        this.statusBar.style.backgroundColor = "red";

        // Create the status bar fill element
        this.statusBarFill = document.createElement("div");
        this.statusBarFill.classList.add("status-bar-fill");
        this.statusBarFill.style.width = "100%";
        this.statusBarFill.style.height = "100%";
        this.statusBarFill.style.backgroundColor = "green";

        // Append the status bar fill to the status bar
        this.statusBar.appendChild(this.statusBarFill);

        // Append the status bar to the troop
        this.troop.appendChild(this.statusBar);

        console.log(this.troop);
        console.log(this.spawnCell);

        this.spawnCell.style.position = "relative"; // Ensure the spawnCell is positioned relatively
        this.currentCell = this.spawnCell; // Set the current cell to the spawn cell
        this.spawnCell.appendChild(this.troop);
    }

    move(activeRoute) {
        if (!activeRoute || activeRoute.length === 0) {
            console.error("Active route is empty or undefined.");
            return;
        }
    
        if (!this.troop) {
            console.log("Troop does no longer exist.");
            return;
        }
    
        // Get the current position of the troop
        if (!this.currentCell) {
            console.error("Current cell is null.");
            return;
        }
    
        this.destinationCell = activeRoute[activeRoute.length - 1];
    
        let currentIndex = activeRoute.indexOf(this.currentCell);
    
        // If the current cell is not part of the active route, find the closest cell within the route
        if (currentIndex === -1) {
            let minDistance = Infinity;
            for (let i = 0; i < activeRoute.length; i++) {
                const cell = activeRoute[i];
                /**
                 * Calculates the Euclidean distance between the current cell and a given cell.
                 * 
                 * @param {HTMLElement} cell - The target cell to calculate the distance to.
                 * @returns {number} The distance between the current cell and the target cell.
                 * 
                 * Math.hypot() is used to calculate the Euclidean distance between two points
                 * in a plane. It returns the square root of the sum of the squares of its arguments.
                 */
                const distance = Math.hypot(
                    cell.offsetLeft - this.currentCell.offsetLeft,
                    cell.offsetTop - this.currentCell.offsetTop
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    currentIndex = i;
                }
            }
        }
    
        // Determine the next cell in the route
        const nextIndex = currentIndex + 1;
    
        if (nextIndex >= activeRoute.length) {
            console.log("Troop has reached the end of the route.");
            this.troop.remove();
            this.waveManager.removeTroop(this); // Remove the troop from the DOM
            this.game.lives -= 1; // Reduce game lives by one
            console.log(`Game lives remaining: ${this.game.lives}`);
            return;
        }
    
        const nextCell = activeRoute[nextIndex];
        if (!nextCell) {
            console.error("Next cell is null.");
            return;
        }
    
        // Move the troop to the next cell
        nextCell.style.position = "relative"; // Ensure the nextCell is positioned relatively
        nextCell.appendChild(this.troop);
        this.currentCell = nextCell;
    
        // Reset troop's position and size within the new cell
        this.troop.style.width = "100%";
        this.troop.style.height = "100%";
        this.troop.style.position = "absolute";
        this.troop.style.zIndex = "1";
        this.troop.style.left = "0"; // Ensure the troop is aligned to the left within the cell
    
        // Preserve the initial offset and update the translation
        const initialOffsetY = this.troop.initialOffsetY || 0;
        this.troop.style.transform = `translateY(${initialOffsetY}px)`;
    
        // Check if the troop is within the destination cell  
        if (this.currentCell === this.destinationCell) {
            console.log("Troop has reached the destination.");
            this.troop.remove();
            this.waveManager.removeTroop(this); // Remove the troop from the DOM
            this.game.lives -= 1; // Reduce game lives by one
            console.log(`Game lives remaining: ${this.game.lives}`);
            return;
        }
    
        // Determine the cell after the next cell in the route
        const afterNextIndex = nextIndex + 1;
    
        if (afterNextIndex >= activeRoute.length) {
            console.log("Troop has reached the end of the route.");
            this.troop.remove();
            this.waveManager.removeTroop(this); // Remove the troop from the DOM
            this.game.lives -= 1; // Reduce game lives by one
            console.log(`Game lives remaining: ${this.game.lives}`);
            return;
        }
    
        const afterNextCell = activeRoute[afterNextIndex];
        if (!afterNextCell) {
            console.error("After next cell is null.");
            return;
        }
    
        // Determine the direction of movement
        const dx = afterNextCell.offsetLeft - this.currentCell.offsetLeft;
        const dy = afterNextCell.offsetTop - this.currentCell.offsetTop;

        // Remove any existing direction classes
        this.troop.classList.remove(
            'troop-left-right', 'troop-right-left', 'troop-bottom-top', 'troop-top-bottom',
            'troop-left-right-fast', 'troop-right-left-fast', 'troop-top-bottom-fast', 'troop-bottom-top-fast'
        );

        // Apply the appropriate animation class based on the direction and fast forward status
        if (dx > 0) {
            this.troop.classList.add(this.game.fastForwardStatus ? 'troop-left-right-fast' : 'troop-left-right');
        } else if (dx < 0) {
            this.troop.classList.add(this.game.fastForwardStatus ? 'troop-right-left-fast' : 'troop-right-left');
        } else if (dy > 0) {
            this.troop.classList.add(this.game.fastForwardStatus ? 'troop-top-bottom-fast' : 'troop-top-bottom');
        } else if (dy < 0) {
            this.troop.classList.add(this.game.fastForwardStatus ? 'troop-bottom-top-fast' : 'troop-bottom-top');
        }
    }

    takingDamage(tower) {
        // Check if the tower is in radius of this troop
        if (tower.isInRadius(this)) {
            // Apply damage to this troop
            this.troopLives -= tower.damage;
            if (this.troopLives <= 0) {
                this.troop.remove();
                this.waveManager.removeTroop(this);
            } else {
                // Update the status bar width based on the remaining lives
                const livesPercentage = (this.troopLives / this.maxLives) * 100;
                this.statusBarFill.style.width = `${livesPercentage}%`;
            }
        }
    }
}