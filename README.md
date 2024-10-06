## HighlandRunner Tower Defense Game Documentation

This document provides an overview of the HighlandRunner Tower Defense game code.

### Game Overview

HighlandRunner is a tower defense game where the player must defend a sacred hill from waves of invading daemons. The player can place towers on the map to attack the daemons and prevent them from reaching the end of the path.

### Code Structure

The game code is structured into several classes:

- **Game:** The main game class that manages the game loop, UI, and other game objects.
- **Playfield:** Represents the game map and handles grid-based operations like pathfinding.
- **Troop:** Represents an enemy unit that moves along a path.
- **Tower:** Represents a defensive structure that attacks troops within its range.
- **UIManager:** Manages the game UI, including buttons, displays, and user interactions.
- **WaveManager:** Spawns and manages waves of enemy troops.
- **SoundManager:** Handles sound effects and music playback.

### Inputs

- **Mouse Clicks:** Used to interact with UI elements (buttons) and place towers on the playfield.

### Outputs

- **Visual Display:** The game renders the playfield, towers, troops, and UI elements on the screen.
- **Sound Effects:** Sound effects are played for various game events like tower attacks and troop deaths.
- **Music:** Background music enhances the game atmosphere.

## File Breakdown

### `index.html`

- **Purpose:** The main HTML file that sets up the game structure and includes necessary JavaScript files.
- **Key Elements:**
    - Start Screen: Displays the game title, logo, start button, and game instructions.
    - Game Screen: Contains the game UI, playfield, and game elements.
    - End Screen: Displays the game over message and restart button.

### `src/SoundManager.js`

- **Purpose:** Manages sound effects and music for the game.
- **Methods:**
    - `playWeaponShootingSound()`: Plays the weapon shooting sound effect.
    - `playBackgroundMusic()`: Starts playing the background music in a loop.
    - `stopBackgroundMusic()`: Stops the background music.

### `src/UIManager.js`

- **Purpose:** Handles user interface elements and interactions.
- **Responsibilities:**
    - Updating the UI with game information (lives, money, wave).
    - Handling tower placement and removal through grid interactions.
    - Managing the fast-forward game mode.

### `src/WaveManager.js`

- **Purpose:** Controls the spawning and management of enemy waves.
- **Methods:**
    - `startWave(currentWave)`: Spawns a new wave of enemies based on the current wave number.
    - `removeTroop(troop)`: Removes a troop from the game and updates game state accordingly.
    - `getTroopsInRadius(tower)`: Returns an array of troops within the attack range of a given tower.

### `src/game.js`

- **Purpose:** The core game logic and game loop management.
- **Responsibilities:**
    - Initializing the game objects (playfield, wave manager, UI manager).
    - Running the game loop to update game state, handle user input, and render the game.
    - Managing game state transitions (start screen, game screen, end screen).
    - Handling game over conditions.

### `src/playfield.js`

- **Purpose:** Represents the game map and grid-based logic.
- **Methods:**
    - `createGrid(rows, columns, container)`: Creates the visual grid for the playfield.
    - `markCellOccupied(row, col)`: Marks a cell as occupied, preventing tower placement.
    - `isCellOccupied(row, col)`: Checks if a cell is occupied.
    - `toggleGridVisibility()`: Toggles the visibility of the grid lines.
    - `setInitialOccupiedCells()`: Marks initial cells as occupied based on the map layout.
    - `getCellFromRowCol(row, col)`: Returns the HTML element representing a cell at a given row and column.
    - `findPathToDestination(startRow, startCol, destRow, destCol)`: Implements a pathfinding algorithm to determine the route for troops from the spawn point to the destination.

### `src/script.js`

- **Purpose:** Entry point of the game; sets up event listeners for starting and restarting the game.

### `src/tower.js`

- **Purpose:** Represents a tower that attacks enemies within its range.
- **Methods:**
    - `isInRadius(troop)`: Checks if a troop is within the tower's attack range.
    - `startShootingAnimation(troop)`: Starts the tower's shooting animation and plays the shooting sound effect.
    - `stopShootingAnimation()`: Stops the tower's shooting animation.
    - `remove()`: Removes the tower from the game.
    - `upgrade()`: Upgrades the tower's stats and visual appearance.

### `src/troop.js`

- **Purpose:** Represents an enemy unit that moves along a path.
- **Methods:**
    - `move(activeRoute)`: Moves the troop along the specified path.
    - `takingDamage(tower)`: Applies damage to the troop from a tower. If the troop's health reaches zero, it is removed from the game.

### `styles/style.css`

- **Purpose:** Contains the CSS rules for styling the game's visual appearance.

## How to Play

1. Start the game by clicking the 