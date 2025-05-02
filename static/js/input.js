// input.js - Handles keyboard input

// Export keys object for global access
export const keys = {
    left: false,  // A
    right: false, // D
    up: false,    // W
    down: false   // S
};

// Initialize input handlers
export function setupInputHandlers() {
    // Make keys globally accessible
    window.gameKeys = keys;
    
    // Keyboard controls - Using WASD
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Using visibilitychange to detect when tab is inactive
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Use blur/focus to detect when window loses/gains focus
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
}

// Handle key down events
function handleKeyDown(e) {
    switch(e.key.toLowerCase()) {
        case 'a':
            keys.left = true;
            break;
        case 'd':
            keys.right = true;
            break;
        case 'w':
            keys.up = true;
            break;
        case 's':
            keys.down = true;
            break;
    }
}

// Handle key up events
function handleKeyUp(e) {
    switch(e.key.toLowerCase()) {
        case 'a':
            keys.left = false;
            break;
        case 'd':
            keys.right = false;
            break;
        case 'w':
            keys.up = false;
            break;
        case 's':
            keys.down = false;
            break;
    }
}

// Handle visibility change (tab switch)
function handleVisibilityChange() {
    if (document.hidden) {
        console.log("Tab hidden - switching to interval-based updates");
        window.gameUI.switchToIntervalUpdates();
    } else {
        console.log("Tab visible again - switching to animation frame updates");
        window.gameUI.switchToAnimationFrameUpdates();
    }
}

// Handle window losing focus
function handleWindowBlur() {
    console.log("Window lost focus - switching to interval-based updates");
    window.gameUI.switchToIntervalUpdates();
}

// Handle window gaining focus
function handleWindowFocus() {
    console.log("Window gained focus - switching to animation frame updates");
    window.gameUI.switchToAnimationFrameUpdates();
}