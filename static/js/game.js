// game.js - Handles game loop and rendering

import { updatePlayer, drawPlayer } from './player.js';
import { drawOpponent, opponent } from './opponent.js';
import { sendPlayerUpdate } from './network.js';

// Game state variables
let canvas;
let ctx;
let gameLoopRunning = false;
let lastFrameTime = 0;

// Game interface
export const gameInterface = {
    startGameLoop,
    stopGameLoop,
    showScreen,
    update,
    render
};

// Initialize game
export function initGame() {
    // Initialize canvas
    canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    ctx = canvas.getContext('2d');
    
    // Make game interface and canvas globally accessible
    window.gameInterface = gameInterface;
    window.gameCanvas = canvas;
    window.gameCtx = ctx;
    
    // Expose game loop functions globally for UI module
    window.gameLoop = gameLoop;
    window.gameUpdate = update;
    window.gameLoopRunning = gameLoopRunning;
    
    console.log('Game initialized with canvas:', canvas.width, 'x', canvas.height);
}

// Show specific screen and hide others (redirects to UI module)
export function showScreen(screenId) {
    // This function is implemented in UI module
    // We export it here to maintain the same interface
    window.gameUI.showScreen(screenId);
}

// Start game loop
export function startGameLoop() {
    if (!gameLoopRunning) {
        gameLoopRunning = true;
        window.gameLoopRunning = true;
        
        // Start with the appropriate update method based on visibility
        if (document.hidden || document.visibilityState === 'hidden') {
            window.gameUI.switchToIntervalUpdates();
        } else {
            requestAnimationFrame(gameLoop);
        }
        
        console.log('Game loop started');
    }
}

// Stop game loop
export function stopGameLoop() {
    gameLoopRunning = false;
    window.gameLoopRunning = false;
    console.log('Game loop stopped');
}

// Game loop
function gameLoop(timestamp) {
    if (!gameLoopRunning) return;
    
    // Calculate delta time
    const deltaTime = timestamp - lastFrameTime || 16;
    lastFrameTime = timestamp;
    
    // Update game state
    update(deltaTime);
    
    // Send updates to server periodically
    sendPlayerUpdate();
    
    // Render game
    render();
    
    // Continue loop if still using animation frames
    if (gameLoopRunning && !window.gameUI.updateIntervalId) {
        requestAnimationFrame(gameLoop);
    }
}

// Update game state
export function update(deltaTime) {
    // Update player physics based on input
    updatePlayer(window.gameKeys);
}

// Render game
export function render() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw floor
    const floorY = 400;
    ctx.fillStyle = '#444';
    ctx.fillRect(0, floorY, canvas.width, canvas.height - floorY);
    
    // Draw opponent
    drawOpponent(ctx);
    
    // Draw player
    drawPlayer(ctx);
    
    // Draw disconnected message
    if (!opponent.connected) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 100, canvas.width, 60);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Opponent Disconnected', canvas.width / 2, 140);
    }
}