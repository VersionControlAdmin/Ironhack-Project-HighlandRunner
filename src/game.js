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
        this.money = 30;
        this.currentWave = 1;
        this.gameLoopFrequency = 1000/60 //60fps;
        this.gameIsOverFlag = false;
        this.height = 1280;
        this.width = 720;
        this.playFieldRows = 7;
        this.playFieldColumns = 20;
        this.playField = new Playfield(this.height,this.width, this.gameScreen, this.gameContainer);
        this.spawnRow = 3;
        this.spawnColumn = 0;
        this.destinationRow = 3;
        this.destinationColumn = 19;
        this.gameIsOverFlag = false;
        this.spawn = this.playField.getCellRowColumnCenterPosition(this.spawnRow, this.spawnColumn);    
        this.destination = this.playField.getCellRowColumnCenterPosition(this.destinationRow, this.destinationColumn);  
        this.uiManager = new UIManager(this.lives,this.money,this.currentWave, this.gameScreen, this.waveSpan, this.moneySpan, this.liveSpan, this.placeTowerImg, this.playField);
        this.waveManager = new WaveManager(this.playField, this.currentWave, this.spawn, this.destination);
        this.initiate();
    }

    initiate () {
        this.startScreen.style.display = "none";
        this.gameScreen.style.display = "grid";
        this.playField.initiate();
        // this.playField.toggleGridVisibility();
        this.uiManager.initiate();
        this.waveManager.startWave();
        // all event listeners
        setTimeout(() => this.gameLoop(), 1000);
    }

    gameLoop() {

        // troops walking
        let currentPathTroops = this.playField.findPathToDestination(this.spawnRow, this.spawnColumn, this.destinationRow, this.destinationColumn);   
        console.log(currentPathTroops);
        if (this.waveManager.troops.length > 0) { 
            this.waveManager.troops.forEach((troop) => {
                troop.move(currentPathTroops);
            });
        }
        if (this.lives <= 0) {
            this.gameOver();
            return;
        }

        // checking if damage is taken for each troop + tower shooting animation
        this.waveManager.troops.forEach((troop) => {
            this.uiManager.towers.forEach((tower) => {
                if (tower.isInRadius(troop)) {
                    troop.takingDamage(tower);
                }
            });
        });

        // checking if there are any troops left on the field and no more needed for spawn
        if (this.waveManager.troops.length === 0) {
            // this.waveManager.currentWave += 1;
            this.currentWave +=1;
            this.waveManager.currentWave = this.currentWave;
            setTimeout(() => this.waveManager.startWave(), 3000)
        }


        setTimeout(() => this.gameLoop(), 1000); // Call gameLoop every second
    }

    gameOver() {
        this.gameIsOverFlag = true;
        this.endScreen.style.display = "block";
        this.gameScreen.style.display = "none";
    }
    
}