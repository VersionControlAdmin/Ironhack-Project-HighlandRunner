class WaveManager {
    constructor (game ,playField, currentWave, spawn, destination) {
        this.game = game;
        this.playField = playField; 
        this.spawn = spawn;
        this.destination = destination;
        this.lastRoundsBasisLiveMultiplier = 1.5;
        this.troops = [];
        this.troopsPerWaveMultiplier = [
            ...Array.from({ length: 6 }, (_, i) => 0.8 + i * 0.04),
            ...Array.from({ length: 16 }, (_, i) => 1 + i * 0.02),
            ...Array.from({ length: 70 }, (_, i) => 1.3 + i * 0.01)
        ];
        console.log("WaveManager initiated");
    }

    startWave(currentWave) {
        console.log(`Starting wave ${currentWave}`);
        this.game.troopsMovingSpeedMs = Math.max(1000 * (1 - currentWave / 100), 500); // increases troops moving speed gradually, but guarantees one damage per tower per field can be dealt.
        let liveMultiplier = Math.max(this.lastRoundsBasisLiveMultiplier + Math.floor(currentWave * Math.random()/2), this.lastRoundsBasisLiveMultiplier); // increases troops health gradually, but guarantees one damage per tower per field can be dealt.
        this.lastRoundsBasisLiveMultiplier = liveMultiplier;
        const combinedTroopsLiveBudget = Math.ceil(this.game.score/100*8*this.troopsPerWaveMultiplier[Math.min(currentWave-1,this.troopsPerWaveMultiplier.length-1)]); // increases troops count gradually under the premise, the per 100 money a player manages to deal 5 damage, gradually increasing and getting harder
        const deploymentInterval = 1000; // Time in milliseconds between each troop deployment
        let combinedTroopsLiveBudgetLeft = combinedTroopsLiveBudget;
        liveMultiplier = Math.min(liveMultiplier, Math.max(combinedTroopsLiveBudget/30, 1.5)); // Making sure at least 5 troops are deployed
        let finalBossInterval = Math.max(2, Math.floor((Math.random() * 7) / (currentWave / 10 + 1)) + 2); // More likely to be lower as the wave number increases
        let daemonBossInterval = Math.max(2, Math.floor((Math.random() * 2) / (currentWave / 10 + 1)) + 2); // More likely to be lower as the wave number increases
        let deployedTroops = 0;

        const deployTroop = () => {
            if (combinedTroopsLiveBudgetLeft > 0) {
            this.game.wavePrepInProgressFlag = true;
            let currentEnemyType;
            if (currentWave % 15 === 0) {
                currentEnemyType = "finalBoss";
                combinedTroopsLiveBudgetLeft -= liveMultiplier * 10;
            } else if (currentWave > 8 && deployedTroops % finalBossInterval === 0 && combinedTroopsLiveBudgetLeft >= liveMultiplier * 5) {
                currentEnemyType = "finalBoss";
                combinedTroopsLiveBudgetLeft -= liveMultiplier * 10;
            } else if (currentWave > 2 && deployedTroops % daemonBossInterval === 0 && combinedTroopsLiveBudgetLeft >= liveMultiplier * 3) {
                currentEnemyType = "daemonBoss";
                combinedTroopsLiveBudgetLeft -= liveMultiplier * 5;
            } else {
                currentEnemyType = "daemonLady";
                combinedTroopsLiveBudgetLeft -= liveMultiplier * 1;
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
    }

    removeTroop(troop, arrivedAtDestination) {
        const index = this.troops.indexOf(troop);
        if (index > -1) {
            if (arrivedAtDestination) {
                this.game.money += troop.troopReward;
            }
            this.game.score += troop.troopReward;
            this.troops.splice(index, 1);
            console.log(`Troop removed. Remaining troops: ${this.troops.length}`);
        }
    }

    getTroopsInRadius(tower) {
        return this.troops.filter(troop => tower.isInRadius(troop));
    }
}