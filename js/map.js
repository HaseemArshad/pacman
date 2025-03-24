class GameMap {
    constructor() {
        this.cellSize = 16;
        this.width = 28;
        this.height = 31;
        this.walls = [];
        this.dots = [];
        this.powerDots = [];
        this.pacmanX = 14;
        this.pacmanY = 23;
        
        this.reset();
    }
    
    reset() {
        // Initialize walls array
        this.walls = Array(this.height).fill().map(() => Array(this.width).fill(false));
        this.dots = Array(this.height).fill().map(() => Array(this.width).fill(false));
        this.powerDots = Array(this.height).fill().map(() => Array(this.width).fill(false));
        
        // Classic Pacman maze layout (1 = wall, 0 = path)
        const layout = [
            "1111111111111111111111111111",
            "1000000000000110000000000001",
            "1011110111110110111110111101",
            "1P11110111110110111110111P01",
            "1011110111110110111110111101",
            "1000000000000000000000000001",
            "1011110110111111110110111101",
            "1011110110111111110110111101",
            "1000000110000110000110000001",
            "1111110111110110111110111111",
            "1111110111110110111110111111",
            "1111110110000000000110111111",
            "1111110110111--1110110111111",
            "1111110110100000010110111111",
            "0000000000100000010000000000",
            "1111110110100000010110111111",
            "1111110110111111110110111111",
            "1111110110000000000110111111",
            "1111110110111111110110111111",
            "1111110110111111110110111111",
            "1000000000000110000000000001",
            "1011110111110110111110111101",
            "1011110111110110111110111101",
            "1P00110000000000000000110P01",
            "1110110110111111110110110111",
            "1000000110000110000110000001",
            "1011111110110110110111111101",
            "1011111110110110110111111101",
            "1000000000000110000000000001",
            "1111111111111111111111111111",
            "1111111111111111111111111111"
        ];
        
        // Parse layout and set walls
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.walls[y][x] = layout[y][x] === '1';
                // Add dots only in paths (where there's a '0')
                if (layout[y][x] === '0') {
                    this.dots[y][x] = true;
                }
                // Add power dots where there's a 'P'
                if (layout[y][x] === 'P') {
                    this.powerDots[y][x] = true;
                }
            }
        }
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