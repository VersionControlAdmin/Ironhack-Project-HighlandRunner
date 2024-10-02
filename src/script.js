window.onload = function () {
    const startButton = document.querySelector(".start-button");
    const restartButton = document.querySelector(".restart-button");

    // Event Listeners
    startButton.addEventListener("click", () => startGame());
    restartButton.addEventListener("click", () => location.reload());

    function startGame() {
        console.log("Game initated");
        currentGame = new Game();
        // currentGame.start();
    }
}