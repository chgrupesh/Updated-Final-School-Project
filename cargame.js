const gameArea = document.getElementById("game");
const playerCar = document.getElementById("playerCar");
const scoreDisplay = document.getElementById("score");
const fuelDisplay = document.getElementById("fuel");
const startButton = document.getElementById("startButton");
const gameInterface = document.getElementById("gameInterface");
const gameOverInterface = document.getElementById("gameOverInterface");
const restartButton = document.getElementById("restartButton");
const finalScoreDisplay = document.getElementById("finalScore");

let score = 0;
let fuel = 100;
let playerSpeed = 2; // Slower player speed
let enemySpeed = 3; // Initial enemy speed
let fuelItemSpeed = 2;
let pointItemSpeed = 2;
let enemies = [];
let fuels = [];
let points = [];
let gameRunning = false;
let keysPressed = {};
let playerY = 500;

// Start Game
function startGame() {
  gameInterface.style.display = "none";
  gameOverInterface.style.display = "none";
  gameArea.style.display = "block";
  gameRunning = true;
  score = 0;
  fuel = 100;
  enemies = [];
  fuels = [];
  points = [];
  keysPressed = {}; // Reset keysPressed to prevent movement issues
  playerCar.style.left = "175px"; // Reset player car position
  playerY = 500; // Reset vertical position
  playerCar.style.top = `${playerY}px`;

  updateScore();
  updateFuel();

  // Set up game intervals
  enemyInterval = setInterval(createEnemyCar, 1500); // Slow down enemy spawn rate (every 3 seconds)
  setInterval(createFuelItem, 5000); // Slower interval for fuel items
  setInterval(createPointItem, 4000); // Spawn point items every 3 seconds
  gameLoop();
}

// Player Movement
function movePlayer() {
  const playerRect = playerCar.getBoundingClientRect();
  const gameAreaRect = gameArea.getBoundingClientRect();

  if (keysPressed["ArrowLeft"] && playerRect.left > gameAreaRect.left) {
    playerCar.style.left = `${playerCar.offsetLeft - playerSpeed}px`;
  }
  if (keysPressed["ArrowRight"] && playerRect.right < gameAreaRect.right) {
    playerCar.style.left = `${playerCar.offsetLeft + playerSpeed}px`;
  }
  if (keysPressed["ArrowUp"] && playerY > 0) {
    playerY -= playerSpeed;
    playerCar.style.top = `${playerY}px`;
  }
  if (keysPressed["ArrowDown"] && playerY < gameArea.clientHeight - playerCar.offsetHeight) {
    playerY += playerSpeed;
    playerCar.style.top = `${playerY}px`;
  }
}

// Enemy, Fuel, and Point Item Movement
function moveGameObjects() {
  enemies.forEach((enemyCar, index) => {
    enemyCar.style.top = `${parseInt(enemyCar.style.top) + enemySpeed}px`;
    if (parseInt(enemyCar.style.top) > gameArea.clientHeight) {
      enemyCar.remove();
      enemies.splice(index, 1);
    }
  });

  fuels.forEach((fuelItem, index) => {
    fuelItem.style.top = `${parseInt(fuelItem.style.top) + fuelItemSpeed}px`;
    if (parseInt(fuelItem.style.top) > gameArea.clientHeight) {
      fuelItem.remove();
      fuels.splice(index, 1);
    }
  });

  points.forEach((pointItem, index) => {
    pointItem.style.top = `${parseInt(pointItem.style.top) + pointItemSpeed}px`;
    if (parseInt(pointItem.style.top) > gameArea.clientHeight) {
      pointItem.remove();
      points.splice(index, 1);
    }
  });
}

// Collision Detection
function checkCollisions() {
  enemies.forEach((enemyCar, index) => {
    if (isColliding(enemyCar, playerCar)) {
      endGame();
    }
  });

  fuels.forEach((fuelItem, index) => {
    if (isColliding(fuelItem, playerCar)) {
      fuel = Math.min(fuel + 15, 100); // Increase fuel by 5%
      updateFuel();
      fuelItem.remove();
      fuels.splice(index, 1);
    }
  });

  points.forEach((pointItem, index) => {
    if (isColliding(pointItem, playerCar)) {
      score += 10; // Increase score by 10
      updateScore();
      pointItem.remove();
      points.splice(index, 1);
    }
  });
}

function isColliding(obj1, obj2) {
  const rect1 = obj1.getBoundingClientRect();
  const rect2 = obj2.getBoundingClientRect();
  const buffer = 10; // Collision buffer area
  return !(
    rect1.bottom + buffer < rect2.top ||
    rect1.top - buffer > rect2.bottom ||
    rect1.right + buffer < rect2.left ||
    rect1.left - buffer > rect2.right
  );
}

// Game Loop
let timeElapsed = 0; // Track game time
function gameLoop() {
  if (!gameRunning) return;

  movePlayer();
  moveGameObjects();
  checkCollisions();
  updateFuel(); // Make sure fuel is updated on every frame

  // Increase difficulty every 30 seconds
  timeElapsed++;
  if (timeElapsed % 1800 === 0) { // Every 30 seconds
    enemySpeed += 0.1; // Slow enemy speed increase
    fuelItemSpeed += 0.05;
    pointItemSpeed += 0.05;
  }

  requestAnimationFrame(gameLoop);
}

// Utility Functions
function createEnemyCar() {
  const enemyCar = document.createElement("div");
  enemyCar.classList.add("enemyCar");

  // Random horizontal position, with a little padding
  const randomX = Math.random() * (gameArea.clientWidth - 50);
  enemyCar.style.left = `${randomX}px`;

  // Initial top position above the game area
  enemyCar.style.top = `-100px`;
  gameArea.appendChild(enemyCar);
  enemies.push(enemyCar);
}

function createFuelItem() {
  const fuelItem = document.createElement("div");
  fuelItem.classList.add("fuelItem");
  fuelItem.style.left = `${Math.random() * (gameArea.clientWidth - 30)}px`;
  fuelItem.style.top = `-30px`;
  gameArea.appendChild(fuelItem);
  fuels.push(fuelItem);
}

function createPointItem() {
  const pointItem = document.createElement("div");
  pointItem.classList.add("pointItem");
  pointItem.style.left = `${Math.random() * (gameArea.clientWidth - 20)}px`;
  pointItem.style.top = `-30px`;
  gameArea.appendChild(pointItem);
  points.push(pointItem);
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function updateFuel() {
  // Slower fuel consumption rate
  fuel -= 0.02 + playerSpeed * 0.01; // Reduce the rate of fuel decrease
  fuel = Math.max(fuel, 0); // Ensure fuel never goes below 0

  fuelDisplay.textContent = `Fuel: ${Math.floor(fuel)}%`;

  if (fuel <= 0) {
    endGame(); // End the game when fuel reaches 0
  }
}

function endGame() {
  gameRunning = false;
  enemies.forEach((enemy) => enemy.remove());
  fuels.forEach((fuel) => fuel.remove());
  points.forEach((point) => point.remove());
  enemies = [];
  fuels = [];
  points = [];
  keysPressed = {}; // Reset keysPressed on game over
  gameArea.style.display = "none";
  gameOverInterface.style.display = "flex";
  finalScoreDisplay.textContent = score;

  if (score > highScore) {
    highScore = score; // Update high score
  }

  // Display the high score
  document.getElementById("highScoreDisplay").textContent = `High Score: ${highScore}`;
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

document.addEventListener("keydown", (event) => {
  keysPressed[event.key] = true;
});
document.addEventListener("keyup", (event) => {
  keysPressed[event.key] = false;
}); 