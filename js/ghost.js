class Ghost {
    // Static property to track which ghosts are currently chasing
    static activeChaseGhosts = new Set();
    static lastChaserSwitch = 0;
    static switchInterval = 3000; // Switch chasers every 3 seconds

    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.color = color;
        this.speed = 0.08; // Reduced speed for smoother movement
        this.direction = 'right';
        this.isVulnerable = false;
        this.vulnerableTimer = 0;
        this.vulnerableDuration = 10; // seconds
        this.isDead = false;
        this.deadTimer = 0;
        this.deadDuration = 5; // seconds
        this.startDelay = Math.random() * 2; // Random delay before starting to chase
        this.delayTimer = 0;
        this.isChasing = false; // Whether this ghost is actively chasing
        this.targetX = x; // Target position for smooth movement
        this.targetY = y;
        this.lastDirectionChange = 0; // Timer to prevent rapid direction changes
    }
    
    static updateChasers(ghosts, timestamp) {
        // Switch chasers every few seconds
        if (timestamp - Ghost.lastChaserSwitch > Ghost.switchInterval) {
            Ghost.activeChaseGhosts.clear();
            
            // Randomly select 1-2 ghosts to be chasers
            const numChasers = Math.random() < 0.5 ? 1 : 2;
            const availableGhosts = ghosts.filter(ghost => !ghost.isDead && !ghost.isVulnerable);
            
            for (let i = 0; i < numChasers && i < availableGhosts.length; i++) {
                const randomIndex = Math.floor(Math.random() * availableGhosts.length);
                const selectedGhost = availableGhosts.splice(randomIndex, 1)[0];
                Ghost.activeChaseGhosts.add(selectedGhost);
            }
            
            Ghost.lastChaserSwitch = timestamp;
        }
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
        
        // Update whether this ghost is chasing
        this.isChasing = Ghost.activeChaseGhosts.has(this);
        
        // Only change direction after a minimum time has passed
        if (Date.now() - this.lastDirectionChange > 500) { // Minimum 500ms between direction changes
            const currentX = Math.round(this.x);
            const currentY = Math.round(this.y);
            
            // Only consider new direction when close to grid center
            if (Math.abs(this.x - currentX) < 0.1 && Math.abs(this.y - currentY) < 0.1) {
                const possibleDirections = ['up', 'down', 'left', 'right'];
                let bestDirection = this.direction;
                let minDistance = Infinity;
                
                // Remove opposite direction to prevent back-and-forth movement
                const oppositeDir = {
                    'up': 'down',
                    'down': 'up',
                    'left': 'right',
                    'right': 'left'
                };
                const currentIndex = possibleDirections.indexOf(oppositeDir[this.direction]);
                if (currentIndex > -1 && Math.random() < 0.8) { // 80% chance to prevent reversal
                    possibleDirections.splice(currentIndex, 1);
                }
                
                for (const dir of possibleDirections) {
                    let nextX = currentX;
                    let nextY = currentY;
                    
                    switch (dir) {
                        case 'left': nextX--; break;
                        case 'right': nextX++; break;
                        case 'up': nextY--; break;
                        case 'down': nextY++; break;
                    }
                    
                    if (!map.isWall(nextX, nextY)) {
                        let targetX, targetY;
                        
                        if (this.isVulnerable) {
                            targetX = map.pacmanX > 14 ? 0 : 27;
                            targetY = map.pacmanY > 15 ? 0 : 30;
                        } else if (!this.isChasing) {
                            switch (this.color) {
                                case '#ff0000': targetX = 27; targetY = 0; break;
                                case '#ffb8ff': targetX = 0; targetY = 0; break;
                                case '#00ffff': targetX = 27; targetY = 30; break;
                                case '#ffb852': targetX = 0; targetY = 30; break;
                            }
                        } else {
                            targetX = map.pacmanX;
                            targetY = map.pacmanY;
                            
                            switch (this.color) {
                                case '#ffb8ff': // Pink - try to get ahead
                                    targetX = map.pacmanX + (map.pacmanX - this.x);
                                    targetY = map.pacmanY + (map.pacmanY - this.y);
                                    break;
                                case '#00ffff': // Cyan - flank right
                                    targetX += 2;
                                    break;
                                case '#ffb852': // Orange - flank left
                                    targetX -= 2;
                                    break;
                            }
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
                
                if (bestDirection !== this.direction) {
                    this.direction = bestDirection;
                    this.lastDirectionChange = Date.now();
                    this.x = currentX;
                    this.y = currentY;
                }
            }
        }
        
        // Move in the current direction
        let nextX = this.x;
        let nextY = this.y;
        const currentSpeed = this.isChasing ? this.speed * 1.2 : this.speed * 0.8;
        
        switch (this.direction) {
            case 'left': nextX -= currentSpeed; break;
            case 'right': nextX += currentSpeed; break;
            case 'up': nextY -= currentSpeed; break;
            case 'down': nextY += currentSpeed; break;
        }
        
        // Check if next position is valid
        if (!map.isWall(Math.floor(nextX), Math.floor(nextY)) &&
            !map.isWall(Math.ceil(nextX), Math.floor(nextY)) &&
            !map.isWall(Math.floor(nextX), Math.ceil(nextY)) &&
            !map.isWall(Math.ceil(nextX), Math.ceil(nextY))) {
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
            // Add a glowing effect to chasing ghosts
            if (this.isChasing) {
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
            }
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
        Ghost.activeChaseGhosts.delete(this);
    }
    
    kill() {
        this.isDead = true;
        this.deadTimer = 0;
        Ghost.activeChaseGhosts.delete(this);
    }
    
    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = 'right';
        this.isVulnerable = false;
        this.isDead = false;
        Ghost.activeChaseGhosts.delete(this);
    }
} 