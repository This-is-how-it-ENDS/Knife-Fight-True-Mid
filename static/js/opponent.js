// opponent.js - Handles opponent state and behavior

// Export opponent object for global access
export const opponent = {
    x: 0,
    y: 0,
    width: 40,
    height: 60,
    color: '#33A1FF',
    direction: -1,
    connected: true
};

// Initialize opponent
export function initOpponent() {
    resetOpponent();
    // Make opponent globally accessible
    window.gameOpponent = opponent;
}

// Reset opponent to default state
export function resetOpponent() {
    opponent.x = 600;
    opponent.y = 300;
    opponent.direction = -1;
    opponent.connected = true;
}

// Update opponent from server data
export function updateOpponentFromServer(serverPlayer) {
    if (!serverPlayer) return;
    
    opponent.x = serverPlayer.x || opponent.x;
    opponent.y = serverPlayer.y || opponent.y;
    opponent.color = serverPlayer.color || opponent.color;
    opponent.direction = serverPlayer.direction || opponent.direction;
}

// Draw opponent
export function drawOpponent(ctx) {
    // Draw body
    ctx.fillStyle = opponent.color;
    ctx.fillRect(opponent.x, opponent.y, opponent.width, opponent.height);
    
    // Draw eyes (facing direction)
    ctx.fillStyle = '#FFF';
    if (opponent.direction > 0) {
        ctx.fillRect(opponent.x + 25, opponent.y + 15, 8, 8);
    } else {
        ctx.fillRect(opponent.x + 5, opponent.y + 15, 8, 8);
    }
}