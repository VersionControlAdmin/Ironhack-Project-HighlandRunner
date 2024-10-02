class Tower {
    constructor(playField, cell) {
        this.playField = playField;
        this.cell = cell;
        this.damage = 1;
        this.radiusCellsShooting = 1;
        this.tower = document.createElement("div");
        this.tower.classList.add("tower");
        this.tower.style.width = `100%`;
        this.tower.style.height = `100%`;
        this.tower.style.backgroundImage = "url(./assets/towers/tower-mk2-inactive.png)";
        this.tower.style.backgroundSize = "cover";

        // Center the tower within the cell
        const cellRect = this.cell.getBoundingClientRect();
        const playFieldRect = this.playField.gameContainer.getBoundingClientRect();

        const cellCenterX = cellRect.left + (cellRect.width / 2) - playFieldRect.left;
        const cellCenterY = cellRect.top + (cellRect.height / 2) - playFieldRect.top;
        const towerWidth = this.playField.cellSizeWidth - 5;
        const towerHeight = this.playField.cellSizeHeight - 5;

        this.cell.appendChild(this.tower);
    }

    isInRadius(troop) {
        const towerRow = parseInt(this.cell.dataset.row);
        const towerCol = parseInt(this.cell.dataset.col);

        const troopRow = parseInt(troop.currentCell.dataset.row);
        const troopCol = parseInt(troop.currentCell.dataset.col);

        const rowDifference = Math.abs(towerRow - troopRow);
        const colDifference = Math.abs(towerCol - troopCol);

        return rowDifference <= this.radiusCellsShooting && colDifference <= this.radiusCellsShooting;
    }

    startShootingAnimation() {
        const currentBackgroundImage = this.tower.style.backgroundImage;
        const activeImage = "url(./assets/towers/tower-mk2-active.gif)";
        
        if (currentBackgroundImage !== activeImage) {
            this.tower.style.backgroundImage = activeImage;
        }
    }

    stopShootingAnimation() {
        this.tower.style.backgroundImage = "url(./assets/towers/tower-mk2-inactive.png)";
    }
}