class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.waves = [];
        this.explosions = [];
        this.ripples = [];
        this.mouse = { x: null, y: null, radius: 100 };
        this.particleCount = window.innerWidth < 768 ? 30 :30;
        
        // Fixed neon green color
        this.fixedColor = {
            particleColor: '#00ffaa',
            glowColor: 'rgba(224, 172, 50, 0.5)',
            waveColor: 'rgba(0, 255, 170, 0.2)',
             waveColor: 'rgba(231, 126, 21, 0.2)'
        };
        
        this.colorPalettes = {
            dark: [
                { particleColor: '#0066ff', connectionColor: 'rgba(0, 150, 255, 0.15)', glowColor: 'rgba(255, 106, 0, 0.5)', waveColor: 'rgba(0, 102, 255, 0.4)', name: 'Azul Eléctrico' },
                { particleColor: '#ff00aa', connectionColor: 'rgba(255, 0, 170, 0.15)', glowColor: 'rgba(255, 0, 170, 0.5)', waveColor: 'rgba(255, 0, 170, 0.4)', name: 'Rosa Vibrante' },
                { particleColor: '#aa00ff', connectionColor: 'rgba(170, 0, 255, 0.15)', glowColor: 'rgba(170, 0, 255, 0.5)', waveColor: 'rgba(170, 0, 255, 0.4)', name: 'Púrpura' },
                { particleColor: '#00ffff', connectionColor: 'rgba(0, 255, 255, 0.15)', glowColor: 'rgba(0, 255, 255, 0.5)', waveColor: 'rgba(0, 255, 255, 0.4)', name: 'Cian' },
                { particleColor: '#ff6600', connectionColor: 'rgba(255, 102, 0, 0.15)', glowColor: 'rgba(255, 102, 0, 0.5)', waveColor: 'rgba(255, 102, 0, 0.4)', name: 'Naranja Solar' }
            ],
            light: [
                { particleColor: '#0066ff', connectionColor: 'rgba(0, 150, 200, 0.15)', glowColor: 'rgba(0, 102, 255, 0.5)', waveColor: 'rgba(0, 102, 255, 0.4)', name: 'Azul Profesional' },
                { particleColor: '#00aa77', connectionColor: 'rgba(0, 170, 119, 0.15)', glowColor: 'rgba(0, 170, 119, 0.5)', waveColor: 'rgba(0, 170, 119, 0.4)', name: 'Verde Fresco' },
                { particleColor: '#ff6b6b', connectionColor: 'rgba(255, 107, 107, 0.15)', glowColor: 'rgba(255, 107, 107, 0.5)', waveColor: 'rgba(255, 107, 107, 0.4)', name: 'Coral' },
                { particleColor: '#ffcc00', connectionColor: 'rgba(255, 204, 0, 0.15)', glowColor: 'rgba(255, 204, 0, 0.5)', waveColor: 'rgba(255, 204, 0, 0.4)', name: 'Oro' },
                { particleColor: '#9933ff', connectionColor: 'rgba(153, 51, 255, 0.15)', glowColor: 'rgba(153, 51, 255, 0.5)', waveColor: 'rgba(153, 51, 255, 0.4)', name: 'Violeta' }
            ]
        };
        // Current state
        this.currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'dark';
        this.currentPaletteIndex = 0;
        this.selectedColorScheme = this.colorPalettes[this.currentTheme][this.currentPaletteIndex];
        
        // Control for automatic explosions
        this.lastExplosionTime = 0;
        this.explosionInterval = 2000;
        
        this.init();
        this.setupThemeListener();
        this.setupColorMenu();
        this.setupBaseWaves();
        this.startAutoExplosions();
    }

    // Initialize the system
    init() {
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: '0', left: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: '-1'
        });

        this.resize();
        this.generateParticles();
        this.animate();

        window.addEventListener('resize', () => {
            this.resize();
            this.waves = [];
            this.setupBaseWaves();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            if (Math.random() > 0.97) {
                this.createWave(
                    e.clientX, 
                    e.clientY, 
                    50 + Math.random() * 30,
                    0.2
                );
            }
        });

        let lastClickTime = 0;
        const clickCooldown = 500;

        window.addEventListener('click', (e) => {
            const now = Date.now();
            if (now - lastClickTime < clickCooldown) return;
            lastClickTime = now;

            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.createExplosion(e.clientX, e.clientY);
            this.createRipple(e.clientX, e.clientY);
        });
    }

    // Resize canvas
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particleCount = window.innerWidth < 768 ? 30 : 100;
        
        if (this.particles.length > this.particleCount) {
            this.particles = this.particles.slice(0, this.particleCount);
        } else if (this.particles.length < this.particleCount) {
            this.generateParticles(this.particleCount - this.particles.length);
        }
    }

    // Generate particles
    generateParticles(count = this.particleCount) {
        for (let i = 0; i < count; i++) {
            this.addParticle();
        }
    }

    // Add a new particle (50% chance to be neon green, 50% chance to be selected color)
    addParticle(x = null, y = null) {
        // Elegir un color aleatorio de la paleta actual
        const colorIndex = Math.floor(Math.random() * this.colorPalettes[this.currentTheme].length);
        const colorScheme = this.colorPalettes[this.currentTheme][colorIndex];
        
        const particle = {
            x: x !== null ? x : Math.random() * this.canvas.width,
            y: y !== null ? y : Math.random() * this.canvas.height,
            size: 1 + Math.random() * 2,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            particleColor: colorScheme.particleColor,
            glowColor: colorScheme.glowColor,
            opacity: 0.5 + Math.random() * 0.3
        };
        
        this.particles.push(particle);
        
        // Si hay demasiadas partículas, eliminar la más antigua
        if (this.particles.length > this.particleCount * 1.5) {
            this.particles.shift();
        }
    }



    // Theme and color palette management
    setupThemeListener() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-bs-theme') {
                    this.currentTheme = document.documentElement.getAttribute('data-bs-theme');
                    this.currentPaletteIndex = 0;
                    this.selectedColorScheme = this.colorPalettes[this.currentTheme][this.currentPaletteIndex];
                    this.updateColorMenu();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-bs-theme']
        });
    }

    nextColorScheme() {
        const palettes = this.colorPalettes[this.currentTheme];
        this.currentPaletteIndex = (this.currentPaletteIndex + 1) % palettes.length;
        this.selectedColorScheme = palettes[this.currentPaletteIndex];
        this.updateColorMenu();
        this.savePreferences();
    }

    setColorScheme(index) {
        const palettes = this.colorPalettes[this.currentTheme];
        if (index >= 0 && index < palettes.length) {
            this.currentPaletteIndex = index;
            this.selectedColorScheme = palettes[index];
            this.updateColorMenu();
            this.savePreferences();
        }
    }

    savePreferences() {
        localStorage.setItem('particlePrefs', JSON.stringify({
            theme: this.currentTheme,
            paletteIndex: this.currentPaletteIndex
        }));
    }

    loadPreferences() {
        const saved = localStorage.getItem('particlePrefs');
        if (saved) {
            const prefs = JSON.parse(saved);
            this.currentTheme = prefs.theme || this.currentTheme;
            this.currentPaletteIndex = prefs.paletteIndex || 0;
            this.selectedColorScheme = this.colorPalettes[this.currentTheme][this.currentPaletteIndex];
        }
    }

    setupColorMenu() {
        this.loadPreferences();
        this.updateColorMenu();
    }

    updateColorMenu() {
        const paletteOptions = document.getElementById('paletteOptions');
        if (!paletteOptions) return;
        
        paletteOptions.innerHTML = '';
        const palettes = this.colorPalettes[this.currentTheme];
        
        palettes.forEach((palette, index) => {
            const paletteContainer = document.createElement('div');
            paletteContainer.className = 'palette-container mb-2';
            
            const paletteTitle = document.createElement('h6');
            paletteTitle.className = 'text-white mb-2';
            paletteTitle.textContent = palette.name;
            paletteContainer.appendChild(paletteTitle);
            
            const colorsContainer = document.createElement('div');
            colorsContainer.className = 'd-flex flex-wrap';
            
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option ' + (index === this.currentPaletteIndex ? 'selected' : '');
            colorOption.innerHTML = `
                <div class="d-flex">
                    <div class="color-preview me-1" style="background-color: ${this.fixedColor.particleColor};"></div>
                    <div class="color-preview" style="background-color: ${palette.particleColor};"></div>
                </div>
                <span class="color-label">${palette.name}</span>
            `;
            
            colorOption.addEventListener('click', () => {
                this.setColorScheme(index);
                document.querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                colorOption.classList.add('selected');
            });
            
            colorsContainer.appendChild(colorOption);
            paletteContainer.appendChild(colorsContainer);
            paletteOptions.appendChild(paletteContainer);
        });
    }

    // Wave effects
    setupBaseWaves() {
        const waveCount = 3;
        for (let i = 0; i < waveCount; i++) {
            this.createWave(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                200 + Math.random() * 100,
                0.15,
                false,
                true
            );
        }
    }

    createWave(x, y, maxRadius, alpha, isClick = false, isBaseWave = false) {
        // Randomly choose between fixed color and selected color
        const useFixedColor = Math.random() > 0.5;
        const waveColor = useFixedColor ? this.fixedColor.waveColor : this.selectedColorScheme.waveColor;
        
        this.waves.push({
            x, y,
            radius: isClick ? 10 : (isBaseWave ? 0 : 5),
            maxRadius,
            speed: isBaseWave ? 0.3 : (isClick ? 2 : 1),
            alpha,
            color: waveColor,
            direction: isBaseWave ? (Math.random() > 0.5 ? 1 : -1) : 0,
            isBaseWave
        });
    }

    // Explosion effects
    startAutoExplosions() {
        setInterval(() => {
            this.createExplosion(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                true
            );
        }, this.explosionInterval);
    }

    createExplosion(x, y, isAuto = false) {
        // Randomly choose between fixed color and selected color
        const useFixedColor = Math.random() > 0.5;
        const colorScheme = useFixedColor ? this.fixedColor : this.selectedColorScheme;
        
        this.explosions.push({
            x, y,
            radius: 10,
            maxRadius: isAuto ? 100 + Math.random() * 50 : 150 + Math.random() * 100,
            speed: isAuto ? 1.5 : 2.5,
            alpha: isAuto ? 0.6 : 0.8,
            color: colorScheme.waveColor,
            particleColor: colorScheme.particleColor,
            glowColor: colorScheme.glowColor,
            growthStage: 'growing',
            explosionParticles: [],
            explosionRadius: 0,
            maxExplosionRadius: isAuto ? 40 : 70
        });
    }

    createExplosionParticles(explosion) {
        const particleCount = Math.floor(Math.random() * 10) + 15;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 2;
            const size = 1 + Math.random() * 3;
            
            explosion.explosionParticles.push({
                x: explosion.x,
                y: explosion.y,
                size: size,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                color: explosion.particleColor,
                glowColor: explosion.glowColor,
                alpha: 0.8 + Math.random() * 0.2,
                decay: 0.01 + Math.random() * 0.02
            });
        }
    }

    // Ripple effects
    createRipple(x, y) {
        // Randomly choose between fixed color and selected color
        const useFixedColor = Math.random() > 0.5;
        const rippleColor = useFixedColor ? this.fixedColor.particleColor : this.selectedColorScheme.particleColor;
        
        this.ripples.push({
            x, y,
            radius: 0,
            maxRadius: 200,
            alpha: 0.5,
            color: rippleColor
        });
    }

    // Update methods
    updateExplosions() {
        for (let i = 0; i < this.explosions.length; i++) {
            const explosion = this.explosions[i];
            
            if (explosion.growthStage === 'growing') {
                explosion.radius += explosion.speed;
                
                if (explosion.radius >= explosion.maxRadius) {
                    explosion.growthStage = 'exploding';
                    this.createExplosionParticles(explosion);
                }
                
                this.ctx.beginPath();
                this.ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = explosion.color;
                this.ctx.globalAlpha = explosion.alpha;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
                
            } else if (explosion.growthStage === 'exploding') {
                explosion.explosionRadius += 3;
                
                for (let j = 0; j < explosion.explosionParticles.length; j++) {
                    const p = explosion.explosionParticles[j];
                    
                    p.x += p.speedX;
                    p.y += p.speedY;
                    p.alpha -= p.decay;
                    
                    if (p.alpha > 0) {
                        this.ctx.beginPath();
                        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        this.ctx.fillStyle = p.color;
                        this.ctx.globalAlpha = p.alpha;
                        this.ctx.fill();
                        
                        const gradient = this.ctx.createRadialGradient(
                            p.x, p.y, 0,
                            p.x, p.y, p.size * 3
                        );
                        gradient.addColorStop(0, p.glowColor);
                        gradient.addColorStop(1, 'rgba(0,0,0,0)');
                        
                        this.ctx.beginPath();
                        this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                        this.ctx.fillStyle = gradient;
                        this.ctx.globalAlpha = p.alpha * 0.5;
                        this.ctx.fill();
                    }
                }
                
                this.ctx.beginPath();
                this.ctx.arc(explosion.x, explosion.y, explosion.explosionRadius, 0, Math.PI * 2);
                this.ctx.strokeStyle = explosion.color;
                const alphaFade = Math.max(0, 1 - explosion.explosionRadius / explosion.maxExplosionRadius);
                this.ctx.globalAlpha = alphaFade * explosion.alpha;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
                
                if (explosion.explosionRadius >= explosion.maxExplosionRadius) {
                    if (Math.random() > 0.4) {
                        this.createExplosion(
                            explosion.x + (Math.random() - 0.5) * 200,
                            explosion.y + (Math.random() - 0.5) * 200,
                            true
                        );
                    }
                    
                    this.explosions.splice(i, 1);
                    i--;
                }
            }
        }
    }

    updateWaves() {
        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];
            
            wave.radius += wave.speed;
            
            if (!wave.isBaseWave) {
                wave.alpha -= 0.005;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = wave.color;
            this.ctx.globalAlpha = wave.alpha;
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();
            
            if (wave.isBaseWave) {
                wave.x += 0.5 * wave.direction;
                wave.y += 0.2 * wave.direction;
                
                if (wave.x < 0 || wave.x > this.canvas.width) wave.direction *= -1;
                if (wave.y < 0 || wave.y > this.canvas.height) wave.direction *= -1;
                
                if (wave.radius > wave.maxRadius) {
                    wave.radius = 0;
                    if (Math.random() > 0.98) {
                        wave.x = Math.random() * this.canvas.width;
                        wave.y = Math.random() * this.canvas.height;
                    }
                }
            }
            
            if (!wave.isBaseWave && (wave.radius > wave.maxRadius || wave.alpha <= 0)) {
                this.waves.splice(i, 1);
                i--;
            }
        }
    }

    updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
            
            for (const wave of this.waves) {
                const dx = p.x - wave.x;
                const dy = p.y - wave.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (Math.abs(distance - wave.radius) < 30) {
                    const angle = Math.atan2(dy, dx);
                    const force = (1 - Math.abs(distance - wave.radius) / 30) * 0.3;
                    
                    p.x += Math.cos(angle) * force * 2;
                    p.y += Math.sin(angle) * force * 2;
                }
            }
            
            for (const explosion of this.explosions) {
                const dx = p.x - explosion.x;
                const dy = p.y - explosion.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (explosion.growthStage === 'growing') {
                    if (Math.abs(distance - explosion.radius) < 40) {
                        const angle = Math.atan2(dy, dx);
                        const force = (1 - Math.abs(distance - explosion.radius) / 40) * 0.5;
                        
                        p.x += Math.cos(angle) * force * 3;
                        p.y += Math.sin(angle) * force * 3;
                    }
                } else if (explosion.growthStage === 'exploding') {
                    if (distance < explosion.explosionRadius + 30 && distance > explosion.explosionRadius - 30) {
                        const angle = Math.atan2(dy, dx);
                        const force = 0.5;
                        
                        p.speedX += Math.cos(angle) * force;
                        p.speedY += Math.sin(angle) * force;
                    }
                }
            }
            
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    
                    p.x -= Math.cos(angle) * force * 5;
                    p.y -= Math.sin(angle) * force * 5;
                }
            }
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.particleColor;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fill();
            
            const gradient = this.ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.size * 3
            );
            gradient.addColorStop(0, p.glowColor);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = p.opacity * 0.5;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    gradient.addColorStop(0, p1.particleColor);
                    gradient.addColorStop(1, p2.particleColor);
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = gradient;
                    this.ctx.globalAlpha = 1 - distance / 150;
                    this.ctx.lineWidth = 0.5 + (1 - distance / 150) * 1.5;
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }
        }
    }

    drawRipples() {
        this.ripples = this.ripples.filter(r => r.radius < r.maxRadius);
        this.ripples.forEach(r => {
            r.radius += 2;
            r.alpha -= 0.01;
            this.ctx.beginPath();
            this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = r.color;
            this.ctx.globalAlpha = r.alpha;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        });
    }

    // Main animation loop
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = this.currentTheme === 'dark' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.02)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateWaves();
        this.updateExplosions();
        this.updateParticles();
        this.drawConnections();
        this.drawRipples();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the particle system
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem();
    window.nextColorScheme = () => particleSystem.nextColorScheme();
    
    // Theme toggle setup
    const toggleModeBtn = document.getElementById('toggle-mode');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    htmlElement.setAttribute('data-bs-theme', currentTheme);
    updateToggleButton(currentTheme);
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        htmlElement.setAttribute('data-bs-theme', newTheme);
        updateToggleButton(newTheme);
        
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));
    });

    toggleModeBtn.addEventListener('click', () => {
        const newTheme = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-bs-theme', newTheme);
        updateToggleButton(newTheme);
        
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));
        
        localStorage.setItem('theme', newTheme);
    });

    function updateToggleButton(theme) {
        const toggleModeBtn = document.getElementById('toggle-mode');
        if (theme === 'dark') {
            toggleModeBtn.classList.remove('btn-light');
            toggleModeBtn.classList.add('btn-dark');
        } else {
            toggleModeBtn.classList.remove('btn-dark');
            toggleModeBtn.classList.add('btn-light');
        }
    }
});