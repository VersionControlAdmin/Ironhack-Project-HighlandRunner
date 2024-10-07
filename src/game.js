class Game {
    constructor () {
        this.startScreen = document.querySelector(".start-screen");
        this.endScreen = document.querySelector(".end-screen");
        this.gameScreen = document.querySelector(".game-screen");
        this.waveSpan = document.querySelector(".wave-count");
        this.liveSpan = document.querySelector(".live-count");
        this.moneySpan = document.querySelector(".money-count");
        this.gameContainer = document.querySelector(".game-container");
        this.placeTowerImg = document.querySelector("#tower-mk2-img");
        console.log(this.placeTowerImg);
        this.lives = 100;
        this.money = 170;
        this.score = this.money;
        this.currentWave = 0;
        this.gameLoopFrequency = 1000/60 //60fps;
        this.gameIsOverFlag = false;
        this.height = 1280;
        this.width = 720;
        this.playFieldRows = 7;
        this.playFieldColumns = 20;
        this.spawnRow = 3;
        this.spawnColumn = 0;
        this.destinationRow = 3;
        this.destinationColumn = 19;
        this.wavePrepInProgressFlag = false;
        this.gameIsOverFlag = false;
        this.dealDamageFlag = true;
        this.troopsMovingSpeedMs = 1000; 
        this.fastForwardStatus = false;
        this.movingTroopsInterval = null;
        this.dealDamageInterval = null;
        this.updateGameInterval = null;
        this.initiate();
    }

    initiate () {
        this.startScreen.style.display = "none";
        this.gameScreen.style.display = "grid";
        this.playField = new Playfield(this.height,this.width, this.gameScreen, this.gameContainer);
        this.playField.initiate();
        this.spawn = this.playField.getCellFromRowCol(this.spawnRow, this.spawnColumn);    
        this.destination = this.playField.getCellFromRowCol(this.destinationRow, this.destinationColumn);
        console.log(`Destination from game: ${this.destination}`)
        this.soundManager = new SoundManager ();
        this.soundManager.playBackgroundMusic();
        this.uiManager = new UIManager(this ,this.lives,this.money,this.currentWave, this.gameScreen, this.waveSpan, this.moneySpan, this.liveSpan, this.placeTowerImg, this.playField, this.soundManager);
        this.waveManager = new WaveManager(this ,this.playField, this.currentWave, this.spawn, this.destination);
        // this.playField.toggleGridVisibility();
        this.uiManager.initiate();
        this.uiManager.updateUiBarTop(this.lives, this.money, this.currentWave);
        // all event listeners
        this.updateGameLoopIntervals();
    }

    gameLoopMovingTroops() {
        this.moveTroops();
    }

    gameLoopUpdateGame() {
        this.checkStartNewWave();
        this.checkGameOver();
        this.handleDamageAndShooting();
        this.updateUI();
    }
    
    moveTroops() {
        let currentPathTroops = this.playField.findPathToDestination(this.spawnRow, this.spawnColumn, this.destinationRow, this.destinationColumn);   
        this.playField.markActivePathCells(currentPathTroops);
        if (this.waveManager.troops.length > 0) { 
            this.waveManager.troops.forEach((troop) => {
                troop.move(currentPathTroops, this.destination);
            });
        }
    }
    
    checkGameOver() {
        if (this.lives <= 0) {
            this.endScreen.style.display = "block";
            this.gameScreen.style.display = "none";
            this.uiManager.updateEndScreen();
            this.soundManager.stopBackgroundMusic();
            this.stopGameLoop();
            return;
        }
    }

    stopGameLoop() {
        if (this.movingTroopsInterval) clearInterval(this.movingTroopsInterval);
        if (this.dealDamageInterval) clearInterval(this.dealDamageInterval);
        if (this.updateGameInterval) clearInterval(this.updateGameInterval);
    }
    
    handleDamageAndShooting() {
        this.uiManager.towers.forEach((tower) => {
            let firstTroopInRadius = null;
    
            for (let troop of this.waveManager.troops) {
                if (tower.isInRadius(troop)) {
                    firstTroopInRadius = troop;
                    break;
                }
            }
    
            if (firstTroopInRadius) {
                if(this.dealDamageFlag) {
                    firstTroopInRadius.takingDamage(tower);
                }
                tower.startShootingAnimation(firstTroopInRadius);
            } else {
                tower.stopShootingAnimation();
            }
        });
        this.dealDamageFlag = false;
    }
    
    checkStartNewWave() {
        if (this.waveManager.troops.length === 0 && this.wavePrepInProgressFlag === false) {
            this.currentWave += 1;
            this.waveManager.currentWave = this.currentWave;
            setTimeout(() => this.waveManager.startWave(this.currentWave), 3000);
            this.wavePrepInProgressFlag = true;
        }
    }
    
    updateUI() {
        this.uiManager.updateUiBarTop(this.lives, this.money, this.currentWave);
    }

    updateGameLoopIntervals() {
        // Clear existing intervals
        if (this.movingTroopsInterval) clearInterval(this.movingTroopsInterval);
        if (this.dealDamageInterval) clearInterval(this.dealDamageInterval);
        if (this.updateGameInterval) clearInterval(this.updateGameInterval);

        // Set new intervals based on the fast forward status
        const speedMultiplier = this.fastForwardStatus ? 0.5 : 1;

        this.movingTroopsInterval = setInterval(() => {
            this.gameLoopMovingTroops();
        }, this.troopsMovingSpeedMs * speedMultiplier);

        this.dealDamageInterval = setInterval(() => {
            this.dealDamageFlag = true;
        }, 500 * speedMultiplier);

        this.updateGameInterval = setInterval(() => {
            this.gameLoopUpdateGame();
        }, 100 * speedMultiplier);
    }
}