// Variáveis do jogo
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameSpeed = 100;
let score = 0;
let gameRunning = false;
let gameLoop;

// Tamanho do grid
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Inicializa a cobra
function initSnake() {
    snake = [];
    for (let i = 3; i >= 0; i--) {
        snake.push({x: i * gridSize, y: 0});
    }
}

// Gera comida em posição aleatória
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount) * gridSize,
        y: Math.floor(Math.random() * tileCount) * gridSize
    };

    // Verifica se a comida não apareceu em cima da cobra
    for (let i = 0; i < snake.length; i++) {
        if (food.x === snake[i].x && food.y === snake[i].y) {
            generateFood();
            return;
        }
    }
}

// Desenha a cobra
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        const centerX = segment.x + gridSize/2;
        const centerY = segment.y + gridSize/2;
        const radius = gridSize/2;
        
        // Cria gradiente para efeito neon
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        
        // Cabeça da cobra (neon verde)
        if (i === 0) {
            gradient.addColorStop(0, '#0f0');
            gradient.addColorStop(0.7, '#0a0');
            gradient.addColorStop(1, 'transparent');
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#0f0';
        }
        // Corpo da cobra (neon azul)
        else {
            gradient.addColorStop(0, '#0ff');
            gradient.addColorStop(0.7, '#0aa');
            gradient.addColorStop(1, 'transparent');
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#0ff';
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Desenha a comida (neon rosa com efeito pulsante)
function drawFood() {
    const centerX = food.x + gridSize/2;
    const centerY = food.y + gridSize/2;
    const radius = gridSize/2;
    const pulse = Math.sin(Date.now() / 200) * 2 + radius;
    
    const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, pulse
    );
    gradient.addColorStop(0, '#f0f');
    gradient.addColorStop(0.8, '#a0a');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#f0f';
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Atualiza a posição da cobra
function updateSnake() {
    // Pega a posição da cabeça
    let head = {x: snake[0].x, y: snake[0].y};

    // Move na direção atual
    switch(direction) {
        case 'up':
            head.y -= gridSize;
            break;
        case 'down':
            head.y += gridSize;
            break;
        case 'left':
            head.x -= gridSize;
            break;
        case 'right':
            head.x += gridSize;
            break;
    }

    // Adiciona nova cabeça
    snake.unshift(head);

    // Verifica se comeu a comida
    if (head.x === food.x && head.y === food.y) {
        // Aumenta a pontuação baseado na dificuldade (maior velocidade = mais pontos)
        score += Math.floor((gameSpeed / 10) * 6);
        document.getElementById('score').textContent = score;
        generateFood();
    } else {
        // Remove a cauda se não comeu
        snake.pop();
    }
}

// Verifica colisões
function checkCollision() {
    // Colisão com as paredes
    if (snake[0].x < 0 || snake[0].x >= canvas.width || 
        snake[0].y < 0 || snake[0].y >= canvas.height) {
        gameOver();
    }

    // Colisão com o próprio corpo
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            gameOver();
        }
    }
}

// Game over
function gameOver() {
    clearInterval(gameLoop);
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverScreen').style.display = 'flex';
}

// Reinicia o jogo
document.getElementById('playAgain').addEventListener('click', function() {
    document.getElementById('gameOverScreen').style.display = 'none';
    startGame(gameSpeed);
});

// Loop principal do jogo
function gameUpdate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    direction = nextDirection;
    updateSnake();
    checkCollision();
    drawSnake();
    drawFood();
}

// Inicia o jogo
function startGame(speed) {
    if (gameRunning) {
        clearInterval(gameLoop);
    }
    
    gameSpeed = speed;
    score = 0;
    document.getElementById('score').textContent = score;
    initSnake();
    generateFood();
    direction = 'right';
    nextDirection = 'right';
    gameRunning = true;
    gameLoop = setInterval(gameUpdate, 1000 / (gameSpeed / 5));
}

// Controles do teclado
document.addEventListener('keydown', function(e) {
    if (!gameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});

// Eventos dos botões de dificuldade
document.getElementById('easy').addEventListener('click', function() {
    startGame(10); // Fácil (velocidade aumentada em 100%)
});

document.getElementById('medium').addEventListener('click', function() {
    startGame(20); // Médio (velocidade aumentada em 100%)
});

document.getElementById('hard').addEventListener('click', function() {
    startGame(30); // Difícil (velocidade aumentada em 100%)
});