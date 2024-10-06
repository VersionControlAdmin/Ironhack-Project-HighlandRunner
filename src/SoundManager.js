class SoundManager {
    constructor() {
        this.sounds = {
            weaponShooting: new Audio('./assets/sounds/weapon-shooting.wav'),
            gameBackgroundMusic: new Audio('./assets/sounds/background.mp3'),
        };
    }
    
    playWeaponShootingSound() {
        this.sounds.weaponShooting.play();
    }
    
    playBackgroundMusic() {
        this.sounds.gameBackgroundMusic.loop = true;
        this.sounds.gameBackgroundMusic.play();
    }

    stopBackgroundMusic() {
        this.sounds.gameBackgroundMusic.pause();
        this.sounds.gameBackgroundMusic.currentTime = 0;
    }

}