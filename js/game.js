class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 448;  // 28 * 16
        this.canvas.height = 496; // 31 * 16
        
        this.score = 0;
        this.lives = 3;
        this.highScore = localStorage.getItem('pacmanHighScore') || 0;
        this.isRunning = false;
        this.gameLoop = null;
        
        this.map = new GameMap();
        this.pacman = new Pacman(14, 23); // Updated starting position
        this.ghosts = [
            new Ghost(13, 11, 'red'),
            new Ghost(14, 11, 'pink'),
            new Ghost(15, 11, 'cyan'),
            new Ghost(13, 11, 'orange')
        ];
        
        this.setupEventListeners();
        this.updateHighScore();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.pacman.setDirection('up');
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.pacman.setDirection('down');
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.pacman.setDirection('left');
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.pacman.setDirection('right');
                    break;
            }
        });
        
        // Mobile controls
        document.getElementById('upButton').addEventListener('click', () => this.pacman.setDirection('up'));
        document.getElementById('downButton').addEventListener('click', () => this.pacman.setDirection('down'));
        document.getElementById('leftButton').addEventListener('click', () => this.pacman.setDirection('left'));
        document.getElementById('rightButton').addEventListener('click', () => this.pacman.setDirection('right'));
        
        document.getElementById('startButton').addEventListener('click', () => this.start());
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.score = 0;
        this.lives = 3;
        this.updateScore();
        this.updateLives();
        
        this.pacman.reset();
        this.ghosts.forEach(ghost => ghost.reset());
        
        this.gameLoop = setInterval(() => this.update(), 1000 / 60);
    }
    
    update() {
        this.pacman.update(this.map);
        
        // Update Pacman's position in the map for ghost AI
        this.map.updatePacmanPosition(this.pacman.x, this.pacman.y);
        
        // Check for dot collection
        const dotEaten = this.map.eatDot(this.pacman.x, this.pacman.y);
        if (dotEaten) {
            this.score += 10;
            this.updateScore();
        }
        
        // Update ghosts
        this.ghosts.forEach(ghost => {
            ghost.update(this.map);
            
            // Check for collision with Pacman
            if (this.checkCollision(this.pacman, ghost)) {
                this.handlePacmanGhostCollision(ghost);
            }
        });
        
        // Check for game over
        if (this.lives <= 0) {
            this.gameOver();
        }
        
        // Check for level completion
        if (this.map.isLevelComplete()) {
            this.nextLevel();
        }
        
        this.draw();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw map
        this.map.draw(this.ctx);
        
        // Draw dots
        this.map.drawDots(this.ctx);
        
        // Draw Pacman
        this.pacman.draw(this.ctx);
        
        // Draw ghosts
        this.ghosts.forEach(ghost => ghost.draw(this.ctx));
    }
    
    checkCollision(pacman, ghost) {
        const distance = Math.sqrt(
            Math.pow(pacman.x - ghost.x, 2) + 
            Math.pow(pacman.y - ghost.y, 2)
        );
        return distance < 1;
    }
    
    handlePacmanGhostCollision(ghost) {
        if (ghost.isVulnerable) {
            this.score += 200;
            this.updateScore();
            ghost.reset();
        } else {
            this.lives--;
            this.updateLives();
            this.pacman.reset();
            this.ghosts.forEach(g => g.reset());
        }
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.updateHighScore();
        }
    }
    
    updateLives() {
        document.getElementById('lives').textContent = this.lives;
    }
    
    updateHighScore() {
        document.getElementById('highScore').textContent = this.highScore;
        localStorage.setItem('pacmanHighScore', this.highScore);
    }
    
    gameOver() {
        clearInterval(this.gameLoop);
        this.isRunning = false;
        alert('Game Over! Your score: ' + this.score);
    }
    
    nextLevel() {
        this.map.reset();
        this.pacman.reset();
        this.ghosts.forEach(ghost => ghost.reset());
    }
} 