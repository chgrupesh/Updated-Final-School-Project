// Select all Play Now buttons and game content containers
const playButtons = document.querySelectorAll('.play-now');
playButtons.forEach(button => {
  button.addEventListener('click', function() {
    const gameCard = this.closest('.game-card'); // Find the closest game card
    const gameContent = gameCard.querySelector('.game-content'); // Get the hidden content
    gameContent.classList.add('show'); // Add class to show content with fade-in transition

    // Optionally disable the button to prevent multiple clicks
    this.disabled = true;
    this.textContent = 'Game Starting...'; // Change button text while the game is starting
  });
});
