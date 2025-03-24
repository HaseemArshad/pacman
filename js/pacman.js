class Pacman {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.speed = 0.2;
        this.radius = 0.5;
        this.mouthOpen = true;
        this.mouthAngle = 0.3;
        this.animationSpeed = 0.2;
        this.animationTimer = 0;
    }
    
    setDirection(direction) {
        this.nextDirection = direction;
    }
    
    update(map) {
        // Update mouth animation
        this.animationTimer += this.animationSpeed;
        this.mouthOpen = Math.sin(this.animationTimer) > 0;
        
        // Try to change direction
        if (this.nextDirection !== this.direction) {
            const nextX = this.x + (this.nextDirection === 'left' ? -1 : this.nextDirection === 'right' ? 1 : 0);
            const nextY = this.y + (this.nextDirection === 'up' ? -1 : this.nextDirection === 'down' ? 1 : 0);
            
            if (!map.isWall(nextX, nextY)) {
                this.direction = this.nextDirection;
            }
        }
        
        // Calculate next position
        let nextX = this.x;
        let nextY = this.y;
        
        switch (this.direction) {
            case 'left':
                nextX -= this.speed;
                break;
            case 'right':
                nextX += this.speed;
                break;
            case 'up':
                nextY -= this.speed;
                break;
            case 'down':
                nextY += this.speed;
                break;
        }
        
        // Check for wall collisions
        if (!map.isWall(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;
        }
        
        // Handle tunnel wrapping
        if (this.x < 0) this.x = 27;
        if (this.x > 27) this.x = 0;
    }
    
    draw(ctx) {
        const cellSize = 16;
        const x = this.x * cellSize + cellSize / 2;
        const y = this.y * cellSize + cellSize / 2;
        const radius = this.radius * cellSize;
        
        ctx.save();
        ctx.translate(x, y);
        
        // Rotate based on direction
        switch (this.direction) {
            case 'up':
                ctx.rotate(-Math.PI / 2);
                break;
            case 'down':
                ctx.rotate(Math.PI / 2);
                break;
            case 'left':
                ctx.rotate(Math.PI);
                break;
        }
        
        // Draw Pacman
        ctx.beginPath();
        const mouthSize = this.mouthOpen ? this.mouthAngle : 0;
        ctx.arc(0, 0, radius, mouthSize, Math.PI * 2 - mouthSize);
        ctx.lineTo(0, 0);
        ctx.fillStyle = '#ffff00';
        ctx.fill();
        
        ctx.restore();
    }
    
    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = 'right';
        this.nextDirection = 'right';
    }
} 