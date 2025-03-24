class GameMap {
    constructor() {
        this.cellSize = 16;
        this.width = 28;
        this.height = 31;
        this.walls = [];
        this.dots = [];
        this.powerDots = [];
        this.pacmanX = 14;
        this.pacmanY = 17;
        
        this.reset();
    }
    
    reset() {
        // Initialize walls array
        this.walls = Array(this.height).fill().map(() => Array(this.width).fill(false));
        this.dots = Array(this.height).fill().map(() => Array(this.width).fill(false));
        this.powerDots = Array(this.height).fill().map(() => Array(this.width).fill(false));
        
        // Classic Pacman maze layout
        const layout = [
            "1111111111111111111111111111",
            "1000000000000110000000000001",
            "1011110111110110111110111111",
            "1011110110000000000110110001",
            "1011110110110110110110110001",
            "1000000000110000110000000001",
            "1011110110000110110110111111",
            "1011110110110000000110110001",
            "1000110000110110110110110001",
            "1110110110000000110000110001",
            "1000000110110110110110110001",
            "1011111110110000110000111111",
            "1011110000000110110110000001",
            "1011110110110110110110110111",
            "1000110110110000110000110001",
            "1110110110110110110110110111",
            "1000000000000110000000000001",
            "1011110111110110111110111111",
            "1011110110000000000110110001",
            "1011110110110110110110110001",
            "1000110000110000110000110001",
            "1110110110110110110110110111",
            "1000110110000000110000110001",
            "1011110110110110110110111111",
            "1011110000110000110000000001",
            "1011110110110110110110110111",
            "1000000110110000110000110001",
            "1110110110110110110110110111",
            "1000000000000110000000000001",
            "1111111111111111111111111111",
            "1111111111111111111111111111"
        ];
        
        // Parse layout and set walls
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.walls[y][x] = layout[y][x] === '1';
            }
        }
        
        // Set dots (every empty space gets a dot)
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (!this.walls[y][x]) {
                    this.dots[y][x] = true;
                }
            }
        }
        
        // Set power dots (in the corners)
        this.powerDots[3][3] = true;
        this.powerDots[3][24] = true;
        this.powerDots[23][3] = true;
        this.powerDots[23][24] = true;
    }
    
    isWall(x, y) {
        // Handle out of bounds
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return true;
        }
        
        // Round coordinates to nearest cell
        const cellX = Math.floor(x);
        const cellY = Math.floor(y);
        
        return this.walls[cellY][cellX];
    }
    
    eatDot(x, y) {
        const cellX = Math.floor(x);
        const cellY = Math.floor(y);
        
        if (this.dots[cellY][cellX]) {
            this.dots[cellY][cellX] = false;
            return true;
        }
        
        if (this.powerDots[cellY][cellX]) {
            this.powerDots[cellY][cellX] = false;
            return true;
        }
        
        return false;
    }
    
    isLevelComplete() {
        // Check if all dots and power dots are eaten
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.dots[y][x] || this.powerDots[y][x]) {
                    return false;
                }
            }
        }
        return true;
    }
    
    draw(ctx) {
        // Draw walls
        ctx.fillStyle = '#0000ff';
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.walls[y][x]) {
                    ctx.fillRect(
                        x * this.cellSize,
                        y * this.cellSize,
                        this.cellSize,
                        this.cellSize
                    );
                }
            }
        }
    }
    
    drawDots(ctx) {
        // Draw regular dots
        ctx.fillStyle = '#ffffff';
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.dots[y][x]) {
                    ctx.beginPath();
                    ctx.arc(
                        x * this.cellSize + this.cellSize / 2,
                        y * this.cellSize + this.cellSize / 2,
                        2,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        }
        
        // Draw power dots
        ctx.fillStyle = '#ffffff';
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.powerDots[y][x]) {
                    ctx.beginPath();
                    ctx.arc(
                        x * this.cellSize + this.cellSize / 2,
                        y * this.cellSize + this.cellSize / 2,
                        6,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        }
    }
    
    updatePacmanPosition(x, y) {
        this.pacmanX = x;
        this.pacmanY = y;
    }
} 