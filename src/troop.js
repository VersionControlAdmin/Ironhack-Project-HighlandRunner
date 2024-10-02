class Troop {
    constructor (playField, spawn, lives, speed, waveManager) {
        this.playField = playField;
        this.spawn = spawn;
        this.spawnCell = this.playField.getCellFromRowCol(3,0);
        this.gameLives = lives;
        this.speed = speed;
        this.troopLives = lives;
        this.waveManager =  waveManager;
        this.troop = document.createElement("div");
        this.troop.classList.add("troop");
        this.troop.style.backgroundImage = "url(./assets/troops/daemon-lady-walking.gif)";
        this.troop.style.backgroundSize = "cover";
        this.troop.style.width = "100%"; // Make troop take full width of spawnCell
        this.troop.style.height = "100%"; // Make troop take full height of spawnCell
        this.troop.style.position = "absolute"; // Position troops absolutely within spawnCell
        this.troop.style.zIndex = "1"; // Set the z-index to control stacking order
        // Calculate random offset to crowd troops to one side
        const offsetX = Math.random() * 20 - 10; // Random offset between -10px and 10px
        const offsetY = Math.random() * 20 - 10; // Random offset between -10px and 10px
        this.troop.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

        console.log(this.troop);
        console.log(this.spawnCell);

        this.spawnCell.style.position = "relative"; // Ensure the spawnCell is positioned relatively
        this.currentCell = this.spawnCell; // Set the current cell to the spawn cell
        this.spawnCell.appendChild(this.troop);
    }

    // active route is an array of next to each other cells which define the current route that the troops are moving along. 
    // This method moves the troop to the next cell in the active route when called.    
    move(activeRoute, destinationCell) {
        if (!activeRoute || activeRoute.length === 0) {
            console.error("Active route is empty or undefined.");
            return;
        }

        if (!this.troop) {
            console.log("Troop does no longer exist.");
            return;
        }

        // Get the current position of the troop
        const currentCell = this.troop.parentElement;
        let currentIndex = activeRoute.indexOf(currentCell);

        // If the current cell is not part of the active route, find the closest cell within the route
        if (currentIndex === -1) {
            let minDistance = Infinity;
            for (let i = 0; i < activeRoute.length; i++) {
                const cell = activeRoute[i];
                const distance = Math.hypot(
                    cell.offsetLeft - currentCell.offsetLeft,
                    cell.offsetTop - currentCell.offsetTop
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
            this.troop.remove(); // Remove the troop from the DOM
            this.gameLives -= 1; // Reduce game lives by one
            console.log(`Game lives remaining: ${this.gameLives}`);
            return;
        }

        const nextCell = activeRoute[nextIndex];

        // Move the troop to the next cell
        nextCell.style.position = "relative"; // Ensure the nextCell is positioned relatively
        nextCell.appendChild(this.troop);
        this.currentCell = nextCell;

        // Reset troop's position and size within the new cell
        this.troop.style.width = "100%";
        this.troop.style.height = "100%";
        this.troop.style.position = "absolute";
        this.troop.style.zIndex = "1";
        
        // Calculate random offset to crowd troops to one side
        const offsetX = Math.random() * 20 - 10; // Random offset between -10px and 10px
        const offsetY = Math.random() * 20 - 10; // Random offset between -10px and 10px
        this.troop.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

        // Change the background color of the current cell to red for debugging
        currentCell.style.backgroundColor = "red";
         
        // Check if the troop is within the destination cell
        if (nextCell === destinationCell) {
            console.log("Troop has reached the destination.");
            this.troop.remove(); // Remove the troop from the DOM
            this.gameLives -= 1; // Reduce game lives by one
            console.log(`Game lives remaining: ${this.gameLives}`);
        }
    }

    takingDamage(tower) {
        if (tower.isInRadius(this)) {
            tower.startShootingAnimation();
            this.troopLives -= tower.damage;
            if (this.troopLives <= 0) {
                this.troop.remove();
                tower.stopShootingAnimation();
                this.waveManager.removeTroop(this);
            }
        }
    }
}