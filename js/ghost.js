class Ghost {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.color = color;
        this.speed = 0.15;
        this.direction = 'right';
        this.isVulnerable = false;
        this.vulnerableTimer = 0;
        this.vulnerableDuration = 10; // seconds
        this.isDead = false;
        this.deadTimer = 0;
        this.deadDuration = 5; // seconds
    }
    
    update(map) {
        if (this.isDead) {
            this.deadTimer += 1/60; // Assuming 60 FPS
            if (this.deadTimer >= this.deadDuration) {
                this.reset();
            }
            return;
        }
        
        if (this.isVulnerable) {
            this.vulnerableTimer += 1/60; // Assuming 60 FPS
            if (this.vulnerableTimer >= this.vulnerableDuration) {
                this.isVulnerable = false;
            }
        }
        
        // Simple ghost AI: Try to move towards Pacman
        const possibleDirections = ['up', 'down', 'left', 'right'];
        let bestDirection = this.direction;
        let minDistance = Infinity;
        
        for (const dir of possibleDirections) {
            let nextX = this.x;
            let nextY = this.y;
            
            switch (dir) {
                case 'left':
                    nextX -= 1;
                    break;
                case 'right':
                    nextX += 1;
                    break;
                case 'up':
                    nextY -= 1;
                    break;
                case 'down':
                    nextY += 1;
                    break;
            }
            
            if (!map.isWall(nextX, nextY)) {
                const distance = Math.sqrt(
                    Math.pow(nextX - map.pacmanX, 2) + 
                    Math.pow(nextY - map.pacmanY, 2)
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    bestDirection = dir;
                }
            }
        }
        
        this.direction = bestDirection;
        
        // Move in the chosen direction
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
        const radius = 0.5 * cellSize;
        
        ctx.save();
        ctx.translate(x, y);
        
        // Draw ghost body
        ctx.beginPath();
        ctx.arc(0, 0, radius, Math.PI, 0);
        ctx.lineTo(radius, radius);
        ctx.lineTo(-radius, radius);
        ctx.closePath();
        
        if (this.isVulnerable) {
            ctx.fillStyle = '#0000ff';
        } else if (this.isDead) {
            ctx.fillStyle = '#ffffff';
        } else {
            ctx.fillStyle = this.color;
        }
        
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-radius/3, -radius/3, radius/6, 0, Math.PI * 2);
        ctx.arc(radius/3, -radius/3, radius/6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    makeVulnerable() {
        this.isVulnerable = true;
        this.vulnerableTimer = 0;
    }
    
    kill() {
        this.isDead = true;
        this.deadTimer = 0;
    }
    
    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = 'right';
        this.isVulnerable = false;
        this.isDead = false;
    }
} 