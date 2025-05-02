// network.js - Handles socket.io communication

import { updatePlayerFromServer } from './player.js';
import { updateOpponentFromServer, opponent } from './opponent.js';
import { showScreen, startGameLoop, stopGameLoop, render } from './game.js';

// Network state variables
let socket;
let playerId;
let opponentId;
let gameId;
let isHost = false;
const UPDATE_INTERVAL = 50; // Send position updates every 50ms
let lastUpdateTime = 0;

// Export network interface
export const networkInterface = {
    createGame,
    joinGame,
    sendPlayerUpdate,
    getPlayerId: () => playerId,
    getOpponentId: () => opponentId,
    getGameId: () => gameId,
    isHost: () => isHost
};

// Initialize Socket.IO
export function setupSocketIO() {
    // Connect to the server
    socket = io();
    
    // Generate a random player ID
    playerId = 'player_' + Math.random().toString(36).substr(2, 9);
    
    // Setup event handlers
    setupSocketEvents();
    
    // Make network interface globally accessible
    window.gameNetwork = networkInterface;
}

// Setup Socket.IO event handlers
function setupSocketEvents() {
    socket.on('connect', () => {
        console.log('Connected to server');
    });
    
    socket.on('game_created', (data) => {
        gameId = data.game_id;
        
        // Display the game ID for sharing
        document.getElementById('game-id-display').textContent = gameId;
        
        // Set player position from server data
        updatePlayerFromServer(data.game_data.players[playerId]);
        
        // Show waiting screen
        showScreen('waiting');
        
        // Set player as host
        isHost = true;
        
        // Set player name display
        const playerName = document.getElementById('player-name').value.trim() || 'You';
        document.getElementById('player-name-display').textContent = playerName;
    });
    
    socket.on('player_joined', (data) => {
        console.log('Player joined:', data);
        
        // Update status
        document.getElementById('status').textContent = `${data.player_name} has joined the game!`;
        
        // Set opponent name
        document.getElementById('opponent-name-display').textContent = data.player_name;
        
        // Store opponent ID
        opponentId = data.player_id;
    });
    
    socket.on('game_start', (data) => {
        console.log('Game starting:', data);
        
        // If not host, set player position from server data
        if (!isHost) {
            updatePlayerFromServer(data.game_data.players[playerId]);
            
            // Set player name display
            const playerName = document.getElementById('player-name').value.trim() || 'You';
            document.getElementById('player-name-display').textContent = playerName;
        }
        
        // Find opponent ID and set opponent data
        for (const pid in data.game_data.players) {
            if (pid !== playerId) {
                opponentId = pid;
                updateOpponentFromServer(data.game_data.players[pid]);
                document.getElementById('opponent-name-display').textContent = data.game_data.players[pid].name;
                break;
            }
        }
        
        // Show game screen
        showScreen('game');
        
        // Start the game loop
        startGameLoop();
    });
    
    socket.on('player_state', (data) => {
        // Update opponent state
        if (data.player_id !== playerId && opponentId === data.player_id) {
            updateOpponentFromServer(data.state);
            
            // Make sure to render after receiving opponent updates
            // This ensures the opponent is drawn even when the tab is not focused
            render();
        }
    });
    
    socket.on('player_disconnected', (data) => {
        if (data.player_id === opponentId) {
            opponent.connected = false;
            document.getElementById('status').textContent = "Opponent disconnected!";
            render(); // Force a render to show disconnection message
        }
    });
    
    socket.on('error', (data) => {
        alert('Error: ' + data.message);
    });
}

// Create a new game
function createGame() {
    const playerName = document.getElementById('player-name').value.trim() || 'Player';
    const customGameId = document.getElementById('custom-game-id')?.value.trim() || '';
    
    socket.emit('create_game', {
        player_id: playerId,
        player_name: playerName,
        custom_game_id: customGameId
    });
}

// Join an existing game
function joinGame() {
    const playerName = document.getElementById('player-name').value.trim() || 'Player';
    const gameIdInput = document.getElementById('game-id-input').value.trim();
    
    if (gameIdInput) {
        gameId = gameIdInput;
        
        socket.emit('join_game', {
            player_id: playerId,
            player_name: playerName,
            game_id: gameId
        });
    } else {
        alert('Please enter a Game ID');
    }
}

// Send player update to server
export function sendPlayerUpdate() {
    const timestamp = performance.now();
    
    // Only send updates periodically
    if (socket && gameId && (!lastUpdateTime || timestamp - lastUpdateTime >= UPDATE_INTERVAL)) {
        lastUpdateTime = timestamp;
        
        socket.emit('player_update', {
            game_id: gameId,
            player_id: playerId,
            update_data: {
                x: window.gamePlayer.x,
                y: window.gamePlayer.y,
                direction: window.gamePlayer.direction
            }
        });
    }
}