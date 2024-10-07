class WaveManager {
    constructor (game ,playField, currentWave, spawn, destination) {
        this.game = game;
        this.playField = playField; 
        this.spawn = spawn;
        this.destination = destination;
        this.lastRoundsBasisLiveMultiplier = 1
        this.troops = [];
        this.troopsPerWaveMultiplier = [0.8,0.85,0.9,0.92,0.94,0.96,0.98,1,1.01,1.02,1.03,1.04,1.05];
        console.log("WaveManager initiated");
    }

    startWave(currentWave) {
        console.log(`Starting wave ${currentWave}`);
        this.game.troopsMovingSpeedMs = Math.max(1000 * (1 - currentWave / 100), 500); // increases troops moving speed gradually, but guarantees one damage per tower per field can be dealt.
        const liveMultiplier = Math.max(1 * (1 + Math.floor(currentWave * Math.random() / 2)), this.lastRoundsBasisLiveMultiplier); // increases troops health gradually, but guarantees one damage per tower per field can be dealt.
        this.lastRoundsBasisLiveMultiplier = liveMultiplier;
        const combinedTroopsLiveBudget = Math.ceil(this.game.score/100*5/liveMultiplier*this.troopsPerWaveMultiplier[currentWave-1]); // increases troops count gradually under the premise, the per 100 money a player manages to deal 5 damage, gradually increasing and getting harder
        const deploymentInterval = 1000; // Time in milliseconds between each troop deployment
        let combinedTroopsLiveBudgetLeft = combinedTroopsLiveBudget;
        const finalBossInterval = Math.floor(Math.random() * 5) + 2; // Random interval between 2 and 6
        const daemonBossInterval = Math.floor(Math.random() * 2) + 2; // Random interval between 2 and 5
        let deployedTroops = 0;

        const deployTroop = () => {
            if (combinedTroopsLiveBudgetLeft >= 0) {
                let currentEnemyType = "daemonLady";

                if (currentWave > 10 && deployedTroops % finalBossInterval === 0 && combinedTroopsLiveBudgetLeft >= liveMultiplier * 5) {
                    currentEnemyType = "finalBoss";
                    combinedTroopsLiveBudgetLeft -= liveMultiplier * 5;
                } else if (currentWave > 5 && deployedTroops % daemonBossInterval === 0 && combinedTroopsLiveBudgetLeft >= liveMultiplier * 3) {
                    currentEnemyType = "daemonBoss";
                    combinedTroopsLiveBudgetLeft -= liveMultiplier * 3;
                } else {
                    combinedTroopsLiveBudgetLeft -= liveMultiplier;
                }
                const newTroop = new Troop(this.game, this.playField, this.spawn, liveMultiplier, this, currentEnemyType);
                this.troops.push(newTroop);
                deployedTroops++;
                console.log(`Deployed troop ${deployedTroops}`);
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
            this.game.score += 10;
            this.troops.splice(index, 1);
            console.log(`Troop removed. Remaining troops: ${this.troops.length}`);
        }
    }

    getTroopsInRadius(tower) {
        return this.troops.filter(troop => tower.isInRadius(troop));
    }
}