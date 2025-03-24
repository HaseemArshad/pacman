class Ghost {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.color = color;
        this.speed = 0.1; // Reduced speed for better gameplay
        this.direction = 'right';
        this.isVulnerable = false;
        this.vulnerableTimer = 0;
        this.vulnerableDuration = 10; // seconds
        this.isDead = false;
        this.deadTimer = 0;
        this.deadDuration = 5; // seconds
        this.startDelay = Math.random() * 2; // Random delay before starting to chase
        this.delayTimer = 0;
        this.personalityTimer = 0;
        this.personalityDuration = Math.random() * 5 + 3; // Random duration between 3-8 seconds
        this.isScattering = false;
    }
    
    update(map) {
        // Add initial delay before ghost starts moving
        if (this.delayTimer < this.startDelay) {
            this.delayTimer += 1/60;
            return;
        }
        
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
        
        // Update personality timer
        this.personalityTimer += 1/60;
        if (this.personalityTimer >= this.personalityDuration) {
            this.isScattering = !this.isScattering;
            this.personalityTimer = 0;
            this.personalityDuration = Math.random() * 5 + 3; // New random duration
        }
        
        const possibleDirections = ['up', 'down', 'left', 'right'];
        let bestDirection = this.direction;
        let minDistance = Infinity;
        
        // Randomize direction order to prevent predictable movement
        possibleDirections.sort(() => Math.random() - 0.5);
        
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
                let targetX, targetY;
                
                if (this.isVulnerable) {
                    // Run away from Pacman
                    targetX = map.pacmanX > 14 ? 0 : 27;
                    targetY = map.pacmanY > 15 ? 0 : 30;
                } else if (this.isScattering) {
                    // Move to corner based on ghost color
                    switch (this.color) {
                        case '#ff0000': // Red - top right
                            targetX = 27; targetY = 0;
                            break;
                        case '#ffb8ff': // Pink - top left
                            targetX = 0; targetY = 0;
                            break;
                        case '#00ffff': // Cyan - bottom right
                            targetX = 27; targetY = 30;
                            break;
                        case '#ffb852': // Orange - bottom left
                            targetX = 0; targetY = 30;
                            break;
                    }
                } else {
                    // Chase Pacman with slight variation
                    targetX = map.pacmanX + (Math.random() * 4 - 2);
                    targetY = map.pacmanY + (Math.random() * 4 - 2);
                }
                
                const distance = Math.sqrt(
                    Math.pow(nextX - targetX, 2) + 
                    Math.pow(nextY - targetY, 2)
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    bestDirection = dir;
                }
            }
        }
        
        // Occasionally maintain current direction to prevent erratic movement
        if (Math.random() < 0.7 && !map.isWall(this.x, this.y)) {
            bestDirection = this.direction;
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