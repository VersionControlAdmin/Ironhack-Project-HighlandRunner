class Tower {
    constructor(playField, cell, game, soundManager) {
        this.playField = playField;
        this.cell = cell;
        this.game = game;
        this.soundManager = soundManager;
        this.upgradeButton = null;
        this.levelDisplay = null;
        this.towerUpgradeData = [
            {
            towerLevel: 1,
            towerUpgradePricing: 100,
            inactivePngPath: "url(./assets/towers/tower_level1-inactive.png)",
            activeGifPath: "url(./assets/towers/tower_level1-active.gif)",
            radiusCellsShooting: 1,
            damage: 0.5
            },
            {
            towerLevel: 2,
            towerUpgradePricing: 200,
            inactivePngPath: "url(./assets/towers/tower_level2-inactive.png)",
            activeGifPath: "url(./assets/towers/tower_level2-active.gif)",
            radiusCellsShooting: 1,
            damage: 1.1
            },
            {
            towerLevel: 3,
            towerUpgradePricing: 400,
            inactivePngPath: "url(./assets/towers/tower_level3-inactive.png)",
            activeGifPath: "url(./assets/towers/tower_level3-active.gif)",
            radiusCellsShooting: 1,
            damage: 2.42
            },
            {
            towerLevel: 4,
            towerUpgradePricing: 800,
            inactivePngPath: "url(./assets/towers/tower_level4-inactive.png)",
            activeGifPath: "url(./assets/towers/tower_level4-active.gif)",
            radiusCellsShooting: 1,
            damage: 5.324
            },
            {
            towerLevel: 5,
            towerUpgradePricing: 1600,
            inactivePngPath: "url(./assets/towers/tower_level5-inactive.png)",
            activeGifPath: "url(./assets/towers/tower_level5-active.gif)",
            radiusCellsShooting: 2,
            damage: 11.7128
            },
            {
            towerLevel: 6,
            towerUpgradePricing: 3200,
            inactivePngPath: "url(./assets/towers/tower_level6-inactive.png)",
            activeGifPath: "url(./assets/towers/tower_level6-active.gif)",
            radiusCellsShooting: 2,
            damage: 25.76816
            },
            {
            towerLevel: 7,
            towerUpgradePricing: 6400,
            inactivePngPath: "url(./assets/towers/tower_level7-inactive.png)",
            activeGifPath: "url(./assets/towers/tower_level7-active.gif)",
            radiusCellsShooting: 2,
            damage: 56.689952
            },
            {
            towerLevel: 8,
            towerUpgradePricing: 12800,
            inactivePngPath: "url(./assets/towers/tower_level8-inactive.png)",
            activeGifPath: "url(./assets/towers/tower_level8-active.gif)",
            radiusCellsShooting: 3,
            damage: 124.7178944
            }
        ];

        const initialUpgradeData = this.towerUpgradeData[0];
        this.damage = initialUpgradeData.damage;
        this.towerLevel = initialUpgradeData.towerLevel;
        this.radiusCellsShooting = initialUpgradeData.radiusCellsShooting;
        this.towerPrice = initialUpgradeData.towerUpgradePricing;

        this.tower = document.createElement("div");
        this.tower.classList.add("tower");
        this.tower.style.width = `100%`;
        this.tower.style.height = `100%`;
        this.tower.style.backgroundImage = initialUpgradeData.inactivePngPath;
        this.tower.style.backgroundSize = "cover";

        // Center the tower within the cell
        const cellRect = this.cell.getBoundingClientRect();
        const playFieldRect = this.playField.gameContainer.getBoundingClientRect();
        this.cell.appendChild(this.tower);

        // Add click event listener for the upgrade option
        this.tower.addEventListener('click', () => {
            this.handleClickUpgrade();
            this.highlightRadius();
            }
        );
    }

    handleClickUpgrade() {
        // Do nothing if the grid is actively shown
        if (this.playField.gameContainer.classList.contains("show-grid")) {
            return;
        }

        // Display the upgrade button and current level
        if (this.towerLevel < this.towerUpgradeData.length) {
            const upgradeButton = document.createElement('button');
            upgradeButton.innerText = `Upgrade to Level ${this.towerLevel + 1} for ${this.towerUpgradeData[this.towerLevel - 1].towerUpgradePricing}$`;
            upgradeButton.style.position = 'absolute';
            upgradeButton.style.left = `${this.cell.getBoundingClientRect().left}px`;
            upgradeButton.style.top = `${this.cell.getBoundingClientRect().top - 30}px`;
            upgradeButton.style.zIndex = 1000;
            upgradeButton.classList.add("upgrade-button");
            this.upgradeButton = upgradeButton;
            document.body.appendChild(this.upgradeButton);

            const levelDisplay = document.createElement('div');
            levelDisplay.innerText = `Current Level: ${this.towerLevel}`;
            levelDisplay.style.position = 'absolute';
            levelDisplay.style.left = `${this.cell.getBoundingClientRect().left}px`;
            levelDisplay.style.top = `${this.cell.getBoundingClientRect().top - 50}px`;
            levelDisplay.style.zIndex = 1000;
            levelDisplay.classList.add("level-display");
            this.levelDisplay = levelDisplay;
            document.body.appendChild(this.levelDisplay);

            // Handle upgrade button click
            upgradeButton.addEventListener('click', () => {
                this.upgrade();
                document.body.removeChild(upgradeButton);
                document.body.removeChild(levelDisplay);
            });

            // Remove buttons if the next click is outside the upgrade button
            const handleClickOutside = (event) => {
                if (!upgradeButton.contains(event.target)) {
                    document.body.removeChild(upgradeButton);
                    document.body.removeChild(levelDisplay);
                    document.removeEventListener('click', handleClickOutside);
                    this.clearHighlightRadius();
                }
            };

            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 0);
        }
    }

    isInRadius(troop) {
        // Get the row number of the tower's cell
        const towerRow = parseInt(this.cell.dataset.row);
        // Get the column number of the tower's cell
        const towerCol = parseInt(this.cell.dataset.col);

        // Get the row number of the troop's current cell
        const troopRow = parseInt(troop.currentCell.dataset.row);
        // Get the column number of the troop's current cell
        const troopCol = parseInt(troop.currentCell.dataset.col);

        // Calculate the absolute difference in rows between the tower and the troop
        const rowDifference = Math.abs(towerRow - troopRow);
        // Calculate the absolute difference in columns between the tower and the troop
        const colDifference = Math.abs(towerCol - troopCol);

        // Check if the troop is within the shooting radius of the tower
        return rowDifference <= this.radiusCellsShooting && colDifference <= this.radiusCellsShooting;
    }

    startShootingAnimation(troop) {
        const currentBackgroundImage = this.tower.style.backgroundImage;
        const activeImage = this.towerUpgradeData[this.towerLevel - 1].activeGifPath;
        
        if (currentBackgroundImage !== activeImage) {
            this.tower.style.backgroundImage = activeImage;
        }

        // Calculate the angle to rotate the tower towards the troop
        const towerRect = this.tower.getBoundingClientRect();
        const troopRect = troop.currentCell.getBoundingClientRect();

        const deltaX = troopRect.left + (troopRect.width / 2) - (towerRect.left + (towerRect.width / 2));
        const deltaY = troopRect.top + (troopRect.height / 2) - (towerRect.top + (towerRect.height / 2));

        // Adjust the angle by 90 degrees to correct the direction, The Math.atan2(deltaY, deltaX) function in JavaScript is used to calculate the angle (in radians) between the positive x-axis and the point given by the coordinates (deltaX, deltaY). This is particularly useful in scenarios where you need to determine the direction from one point to another in a 2D space.
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;

        // Rotate the tower to face the troop
        this.tower.style.transform = `rotate(${angle}deg)`;

        this.soundManager.playWeaponShootingSound();
    }

    stopShootingAnimation() {
        this.tower.style.backgroundImage = this.towerUpgradeData[this.towerLevel-1].inactivePngPath;
    }

    remove() {
        this.tower.remove();
    }

    upgrade() {
        if (this.game.money >= this.towerUpgradeData[this.towerLevel-1].towerUpgradePricing) {
            this.game.money -= this.towerUpgradeData[this.towerLevel-1].towerUpgradePricing;
            this.towerLevel++;
            this.updateTowerStats();
            if (this.levelDisplay) {
                this.levelDisplay.remove();
            }
            if (this.upgradeButton) {
                this.upgradeButton.remove();
            }
        }
        else {
            alert("Insufficient funds for upgrading the selected tower.")
        }
        this.clearHighlightRadius();
    }

    updateTowerStats() {
        const upgradeData = this.towerUpgradeData[this.towerLevel - 1];
        this.tower.style.backgroundImage = upgradeData.inactivePngPath;
        this.damage = upgradeData.damage;
        this.towerLevel = upgradeData.towerLevel;
        this.radiusCellsShooting = upgradeData.radiusCellsShooting;
        this.towerPrice = upgradeData.towerUpgradePricing;
    }

    highlightRadius() {
        const towerRow = parseInt(this.cell.dataset.row);
        const towerCol = parseInt(this.cell.dataset.col);

        for (let row = towerRow - this.radiusCellsShooting; row <= towerRow + this.radiusCellsShooting; row++) {
            for (let col = towerCol - this.radiusCellsShooting; col <= towerCol + this.radiusCellsShooting; col++) {
                if (row >= 0 && col >= 0 && row < this.playField.height && col < this.playField.width) {
                    const cell = this.playField.gameContainer.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
                    if (cell) {
                        cell.classList.add('highlighted-cell');
                    }
                }
            }
        }
    }

    clearHighlightRadius() {
        const highlightedCells = this.playField.gameContainer.querySelectorAll('.highlighted-cell');
        highlightedCells.forEach(cell => cell.classList.remove('highlighted-cell'));
    }
    
}