class WaveManager {
    constructor (game ,playField, currentWave, spawn, destination) {
        this.game = game;
        this.playField = playField; 
        this.currentWave = currentWave;
        this.spawn = spawn;
        this.destination = destination;
        this.troops = [];
        console.log("WaveManager initiated");
    }

    startWave () {
        console.log(`Starting wave ${this.currentWave}`);
        const lives = 2 * this.currentWave;
        const speed = this.currentWave;
        const troopCount = this.currentWave * 1;
        for (let i = 0; i < troopCount; i++) {
            const newTroop = new Troop(this.game ,this.playField, this.spawn, lives, speed, this);
            this.troops.push(newTroop);
        }
    }

    removeTroop(troop) {
        const index = this.troops.indexOf(troop);
        if (index > -1) {
            this.troops.splice(index, 1);
            console.log(`Troop removed. Remaining troops: ${this.troops.length}`);
        }
    }
}