// ui.js - Handles UI management

import { stopGameLoop } from './game.js';

// UI state variables
let updateIntervalId = null;

// Export UI interface
export const uiInterface = {
    returnToLobby,
    switchToIntervalUpdates,
    switchToAnimationFrameUpdates
};

// Initialize UI handlers
export function setupUI() {
    // Set up UI event listeners
    document.getElementById('create-game-btn').addEventListener('click', window.createGame);
    document.getElementById('join-game-btn').addEventListener('click', window.joinGame);
    document.getElementById('play-again-btn').addEventListener('click', returnToLobby);
    
    // Make UI interface globally accessible
    window.gameUI = uiInterface;
}

// Show specific screen and hide others
export function showScreen(screenId) {
    const screens = ['lobby', 'waiting', 'game', 'game-over-screen'];
    
    screens.forEach(id => {
        const screen = document.getElementById(id);
        if (screen) {
            if (id === screenId) {
                screen.classList.remove('hidden');
            } else {
                screen.classList.add('hidden');
            }
        }
    });
}

// Return to lobby
function returnToLobby() {
    showScreen('lobby');
    
    // Stop game loop
    stopGameLoop();
    
    // Clear any interval
    if (updateIntervalId) {
        clearInterval(updateIntervalId);
        updateIntervalId = null;
    }
}

// Switch to interval-based updates when tab is not focused
function switchToIntervalUpdates() {
    // Only create interval if it doesn't exist and game is running
    if (!updateIntervalId && window.gameLoopRunning) {
        // Clear any existing animation frame
        cancelAnimationFrame(window.gameLoopRunning);
        
        // Create interval that updates and sends position regularly
        updateIntervalId = setInterval(() => {
            window.gameUpdate(16); // Approximate 60fps delta time
            window.gameNetwork.sendPlayerUpdate();
        }, 16); // ~60fps update rate
    }
}

// Switch back to animation frame updates when tab is focused
function switchToAnimationFrameUpdates() {
    // Clear interval if it exists
    if (updateIntervalId) {
        clearInterval(updateIntervalId);
        updateIntervalId = null;
        
        // Restart animation frame loop if game is running
        if (window.gameLoopRunning) {
            requestAnimationFrame(window.gameLoop);
        }
    }
}