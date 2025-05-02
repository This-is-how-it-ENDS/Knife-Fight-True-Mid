// player.js - Handles player state and behavior

// Constants
const gravity = 0.5;
const floorY = 400;

// Export player object for global access
export const player = {
    x: 0,
    y: 0,
    width: 40,
    height: 60,
    color: '#FF5733',
    speedX: 0,
    speedY: 0,
    direction: 1,  // 1 = right, -1 = left
    isJumping: false
};

// Initialize player
export function initPlayer() {
    resetPlayer();
    // Make player globally accessible
    window.gamePlayer = player;
}

// Reset player to default state
export function resetPlayer() {
    player.x = 100;
    player.y = 300;
    player.speedX = 0;
    player.speedY = 0;
    player.direction = 1;
    player.isJumping = false;
}

// Update player from server data
export function updatePlayerFromServer(serverPlayer) {
    if (!serverPlayer) return;
    
    player.x = serverPlayer.x;
    player.y = serverPlayer.y;
    player.color = serverPlayer.color;
    player.direction = serverPlayer.direction;
}

// Update player physics
export function updatePlayer(keys) {
    // Handle player movement - using WASD controls
    player.speedX = 0;
    
    if (keys.left) {
        player.speedX = -5;
        player.direction = -1;
    }
    if (keys.right) {
        player.speedX = 5;
        player.direction = 1;
    }
    
    // Jumping
    if (keys.up && !player.isJumping) {
        player.speedY = -12;
        player.isJumping = true;
    }
    
    // Apply gravity
    player.speedY += gravity;
    
    // Move player
    player.x += player.speedX;
    player.y += player.speedY;
    
    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > window.gameCanvas.width) player.x = window.gameCanvas.width - player.width;
    
    // Floor collision
    if (player.y + player.height > floorY) {
        player.y = floorY - player.height;
        player.speedY = 0;
        player.isJumping = false;
    }
}

// Draw player
export function drawPlayer(ctx) {
    // Draw body
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw eyes (facing direction)
    ctx.fillStyle = '#FFF';
    if (player.direction > 0) {
        ctx.fillRect(player.x + 25, player.y + 15, 8, 8);
    } else {
        ctx.fillRect(player.x + 5, player.y + 15, 8, 8);
    }
}