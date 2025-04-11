/**
 * Particle System with Mouse Interaction
 * Creates floating particles with neon glow effect that respond to mouse movement
 */
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.ripples = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseRadius = 100;
        this.mouseStrength = 50;
        this.clickStrength = 100;
        this.connectDistance = 150;
        this.particleCount = window.innerWidth < 768 ? 50 : 100;
        this.colorMode = 'cyber';
        this.colorSchemes = {
            cyber: {
                particleColor: '#00ffaa',
                connectionColor: 'rgba(0, 255, 170, 0.15)',
                rippleColor: 'rgba(0, 255, 170, 0.5)',
                glowColor: 'rgba(0, 255, 170, 0.5)'
            },
            purple: {
                particleColor: '#ff00de',
                connectionColor: 'rgba(255, 0, 222, 0.15)',
                rippleColor: 'rgba(255, 0, 222, 0.5)',
                glowColor: 'rgba(255, 0, 222, 0.5)'
            },
            gold: {
                particleColor: '#ffc107',
                connectionColor: 'rgba(255, 193, 7, 0.15)',
                rippleColor: 'rgba(255, 193, 7, 0.5)',
                glowColor: 'rgba(255, 193, 7, 0.5)'
            },
            blue: {
                particleColor: '#00aaff',
                connectionColor: 'rgba(0, 170, 255, 0.15)',
                rippleColor: 'rgba(0, 170, 255, 0.5)',
                glowColor: 'rgba(0, 170, 255, 0.5)'
            },
            multi: {
                particleColor: 'random',
                connectionColor: 'rgba(255, 255, 255, 0.15)',
                rippleColor: 'rgba(255, 255, 255, 0.5)',
                glowColor: 'rgba(255, 255, 255, 0.5)'
            }
        };
        
        // Extra options for customizing
        this.options = {
            particleSize: { min: 1, max: 3 },
            particleSpeed: { min: 0.2, max: 0.8 },
            connectionWidth: 1,
            rippleDuration: 1000
        };
        
        // Initialize the system
        this.init();
    }
    
    /**
     * Initialize the particle system
     */
    init() {
        document.body.appendChild(this.canvas);
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        
        this.resizeCanvas();
        this.createParticles();
        this.setupMouseTracking();
        
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Start animation loop
        this.animate();
    }
    
    /**
     * Resize canvas to match container
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Readjust particle count on resize
        this.particleCount = window.innerWidth < 768 ? 50 : 100;
        
        // Recreate particles with new dimensions
        if (this.particles.length === 0) {
            this.createParticles();
        } else {
            // Make sure particles stay within bounds after resize
            this.particles.forEach(p => {
                if (p.x > window.innerWidth) p.x = window.innerWidth * Math.random();
                if (p.y > window.innerHeight) p.y = window.innerHeight * Math.random();
            });
            
            // Adjust particle count if needed
            const currentCount = this.particles.length;
            if (currentCount < this.particleCount) {
                // Add more particles
                for (let i = 0; i < this.particleCount - currentCount; i++) {
                    this.addParticle(
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight
                    );
                }
            } else if (currentCount > this.particleCount) {
                // Remove excess particles
                this.particles = this.particles.slice(0, this.particleCount);
            }
        }
    }
    
    /**
     * Create initial particles
     */
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.addParticle(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            );
        }
    }
    
    /**
     * Add a single particle
     */
    addParticle(x, y, isClickBurst = false) {
        let colorScheme = this.colorSchemes[this.colorMode];
        let color = colorScheme.particleColor;
        
        // For random color mode or click bursts in multi mode
        if (color === 'random' || (this.colorMode === 'multi' && isClickBurst)) {
            const colors = ['#00ffaa', '#ff00de', '#ffc107', '#00aaff'];
            color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        const particle = {
            x: x,
            y: y,
            size: this.options.particleSize.min + Math.random() * (this.options.particleSize.max - this.options.particleSize.min),
            speedX: -0.5 + Math.random() * 1,
            speedY: -0.5 + Math.random() * 1,
            color: color,
            opacity: 0.6 + Math.random() * 0.4,
            influenced: false
        };
        
        // Normalize speed
        const speed = this.options.particleSpeed.min + Math.random() * (this.options.particleSpeed.max - this.options.particleSpeed.min);
        const magnitude = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
        particle.speedX = (particle.speedX / magnitude) * speed;
        particle.speedY = (particle.speedY / magnitude) * speed;
        
        // For click bursts, add additional speed
        if (isClickBurst) {
            particle.speedX *= 3;
            particle.speedY *= 3;
            particle.size *= 1.5;
        }
        
        this.particles.push(particle);
        return particle;
    }
    
    /**
     * Setup mouse movement and click tracking
     */
    setupMouseTracking() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        window.addEventListener('click', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Add ripple effect on click
            this.addRipple(e.clientX, e.clientY);
            
            // Create burst of particles on click
            for (let i = 0; i < 10; i++) {
                this.addParticle(e.clientX, e.clientY, true);
            }
        });
        
        // For touch devices
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX;
                this.mouseY = e.touches[0].clientY;
            }
        });
        
        window.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.mouseX = touch.clientX;
                this.mouseY = touch.clientY;
                
                // Add ripple effect on touch
                this.addRipple(touch.clientX, touch.clientY);
                
                // Create burst of particles on touch
                for (let i = 0; i < 5; i++) {
                    this.addParticle(touch.clientX, touch.clientY, true);
                }
            }
        });
    }
    
    /**
     * Add ripple effect at specified position
     */
    addRipple(x, y) {
        const ripple = {
            x: x,
            y: y,
            size: 0,
            maxSize: this.mouseRadius * 2,
            birthTime: Date.now(),
            color: this.colorSchemes[this.colorMode].rippleColor
        };
        
        this.ripples.push(ripple);
    }
    
    /**
     * Calculate interaction between mouse and particle
     */
    calculateMouseInfluence(particle) {
        const dx = particle.x - this.mouseX;
        const dy = particle.y - this.mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Reset influence flag
        particle.influenced = false;
        
        if (distance < this.mouseRadius) {
            // Calculate strength based on distance (closer = stronger)
            const strength = (1 - distance / this.mouseRadius) * this.mouseStrength;
            
            // Apply force away from mouse
            const forceX = (dx / distance) * strength;
            const forceY = (dy / distance) * strength;
            
            particle.speedX += forceX * 0.05;
            particle.speedY += forceY * 0.05;
            
            // Mark as influenced for visual effects
            particle.influenced = true;
        }
    }
    
    /**
     * Draw connections between particles
     */
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];
                
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectDistance) {
                    // Calculate line opacity based on distance
                    const opacity = 1 - (distance / this.connectDistance);
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.colorSchemes[this.colorMode].connectionColor;
                    this.ctx.globalAlpha = opacity;
                    this.ctx.lineWidth = this.options.connectionWidth;
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }
        }
    }
    
    /**
     * Update and draw each particle
     */
    updateParticles() {
        this.particles.forEach(particle => {
            // Calculate mouse influence
            this.calculateMouseInfluence(particle);
            
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Check boundaries and bounce
            if (particle.x <= 0 || particle.x >= window.innerWidth) {
                particle.speedX *= -1;
                particle.x = Math.max(0, Math.min(particle.x, window.innerWidth));
            }
            
            if (particle.y <= 0 || particle.y >= window.innerHeight) {
                particle.speedY *= -1;
                particle.y = Math.max(0, Math.min(particle.y, window.innerHeight));
            }
            
            // Apply small friction to slow particles gradually
            particle.speedX *= 0.99;
            particle.speedY *= 0.99;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            // Special visual effect for particles influenced by mouse
            if (particle.influenced) {
                // Create glow effect
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 4
                );
                
                gradient.addColorStop(0, particle.color);
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = gradient;
                this.ctx.globalAlpha = 0.8;
                this.ctx.fill();
                
                // Draw the particle with full opacity
                this.ctx.fillStyle = particle.color;
                this.ctx.globalAlpha = 1;
                this.ctx.fill();
            } else {
                // Normal particle
                this.ctx.fillStyle = particle.color;
                this.ctx.globalAlpha = particle.opacity;
                this.ctx.fill();
            }
            
            this.ctx.globalAlpha = 1;
        });
    }
    
    /**
     * Update and draw ripple effects
     */
    updateRipples() {
        const now = Date.now();
        let i = 0;
        
        while (i < this.ripples.length) {
            const ripple = this.ripples[i];
            const age = now - ripple.birthTime;
            
            if (age > this.options.rippleDuration) {
                // Remove old ripples
                this.ripples.splice(i, 1);
            } else {
                // Calculate size based on age
                const progress = age / this.options.rippleDuration;
                ripple.size = ripple.maxSize * progress;
                
                // Calculate opacity (fade out)
                const opacity = 1 - progress;
                
                // Draw ripple
                this.ctx.beginPath();
                this.ctx.arc(ripple.x, ripple.y, ripple.size, 0, Math.PI * 2);
                this.ctx.strokeStyle = ripple.color;
                this.ctx.globalAlpha = opacity;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
                
                i++;
            }
        }
    }
    
    /**
     * Main animation loop
     */
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Draw connections between particles
        this.drawConnections();
        
        // Update and draw particles
        this.updateParticles();
        
        // Update and draw ripples
        this.updateRipples();
        
        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
    
    /**
     * Set color scheme
     */
    setColorMode(mode) {
        if (this.colorSchemes[mode]) {
            this.colorMode = mode;
        }
    }
    
    /**
     * Change density of particles
     */
    setParticleCount(count) {
        this.particleCount = count;
        this.resizeCanvas(); // This will adjust particle count
    }
    
    /**
     * Change mouse influence radius
     */
    setMouseRadius(radius) {
        this.mouseRadius = radius;
    }
    
    /**
     * Change particle connection distance
     */
    setConnectDistance(distance) {
        this.connectDistance = distance;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Create and start the particle system
    window.particleSystem = new ParticleSystem();
});