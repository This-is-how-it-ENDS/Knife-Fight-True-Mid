// main.js - Main entry point for the game
import { initPlayer } from './player.js';
import { initOpponent } from './opponent.js';
import { initGame, showScreen } from './game.js';
import { setupSocketIO } from './network.js';
import { setupUI } from './ui.js';
import { setupInputHandlers } from './input.js';

// Game instance variables
let gameInitialized = false;

// Initialize when the window loads
window.addEventListener('load', initializeGame);

function initializeGame() {
    // Only initialize once
    if (gameInitialized) return;
    gameInitialized = true;

    console.log('Initializing game...');
    
    // Initialize all game components
    setupUI();
    setupInputHandlers();
    setupSocketIO();
    initPlayer();
    initOpponent();
    initGame();
    
    // Start with the lobby screen
    showScreen('lobby');
    
    console.log('Game initialized successfully!');
}

// Expose essential functions to the global scope for HTML event handlers
// This maintains compatibility with existing HTML event bindings
window.createGame = () => window.gameNetwork.createGame();
window.joinGame = () => window.gameNetwork.joinGame();
window.returnToLobby = () => window.gameUI.returnToLobby();