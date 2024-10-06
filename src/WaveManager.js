class WaveManager {
    constructor (game ,playField, currentWave, spawn, destination) {
        this.game = game;
        this.playField = playField; 
        this.spawn = spawn;
        this.destination = destination;
        this.lastRoundsBasisLiveMultiplier = 1
        this.troops = [];
        console.log("WaveManager initiated");
    }

    startWave(currentWave) {
        console.log(`Starting wave ${currentWave}`);
        this.game.troopsMovingSpeedMs = Math.max(1000 * (1 - currentWave / 100), 500); // increases troops moving speed gradually, but guarantees one damage per tower per field can be dealt.
        const liveMultiplier = Math.max(1 * (1 + Math.floor(currentWave * Math.random() / 2)), this.lastRoundsBasisLiveMultiplier); // increases troops health gradually, but guarantees one damage per tower per field can be dealt.
        this.lastRoundsBasisLiveMultiplier = liveMultiplier;
        const troopCount = currentWave * 1;
        const deploymentInterval = 1000; // Time in milliseconds between each troop deployment

        let deployedTroops = 0;

        const deployTroop = () => {
            if (deployedTroops < troopCount) {
                let currentEnemyType = "daemonLady";
                if (currentWave > 10 && deployedTroops % Math.max(1, Math.floor(troopCount / (currentWave / 4))) === 0) {
                    currentEnemyType = "finalBoss";
                } else if (currentWave > 5 && deployedTroops % Math.max(1, Math.floor(troopCount / (currentWave / 2))) === 0) {
                    currentEnemyType = "daemonBoss";
                }
                const newTroop = new Troop(this.game, this.playField, this.spawn, liveMultiplier, this, currentEnemyType);
                this.troops.push(newTroop);
                deployedTroops++;
                console.log(`Deployed troop ${deployedTroops}/${troopCount}`);
                setTimeout(deployTroop, deploymentInterval);
            } else {
                console.log(`All troops deployed for wave ${currentWave}`);
                this.game.wavePrepInProgressFlag = false;
            }
        };

        deployTroop();
        this.game.wavePrepInProgressFlag = true;
    }

    removeTroop(troop) {
        const index = this.troops.indexOf(troop);
        if (index > -1) {
            this.game.money += 10;
            this.troops.splice(index, 1);
            console.log(`Troop removed. Remaining troops: ${this.troops.length}`);
        }
    }

    getTroopsInRadius(tower) {
        return this.troops.filter(troop => tower.isInRadius(troop));
    }
}