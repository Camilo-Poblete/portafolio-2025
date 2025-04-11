class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.ripples = [];
        this.mouse = { x: null, y: null, radius: 100 };
        this.particleCount = window.innerWidth < 768 ? 50 : 100;
        
        // Color fijo verde neón
        this.fixedColor = {
            particleColor: '#00ffaa',
            glowColor: 'rgba(0, 255, 170, 0.5)'
        };
        
        // Esquemas de color (solo para el segundo color seleccionable)
        this.colorPalettes = {
            dark: [
                { particleColor: '#0066ff', connectionColor: 'rgba(0, 150, 255, 0.15)', rippleColor: 'rgba(255, 204, 0, 0.5)', glowColor: 'rgba(0, 102, 255, 0.5)', name: 'Azul Eléctrico' },
                { particleColor: '#ff00aa', connectionColor: 'rgba(255, 0, 170, 0.15)', rippleColor: 'rgba(0, 255, 200, 0.5)', glowColor: 'rgba(255, 0, 170, 0.5)', name: 'Rosa Vibrante' },
                { particleColor: '#aa00ff', connectionColor: 'rgba(170, 0, 255, 0.15)', rippleColor: 'rgba(255, 200, 0, 0.5)', glowColor: 'rgba(170, 0, 255, 0.5)', name: 'Púrpura' },
                { particleColor: '#00ffff', connectionColor: 'rgba(0, 255, 255, 0.15)', rippleColor: 'rgba(255, 100, 0, 0.5)', glowColor: 'rgba(0, 255, 255, 0.5)', name: 'Cian' },
                { particleColor: '#ff6600', connectionColor: 'rgba(255, 102, 0, 0.15)', rippleColor: 'rgba(255, 200, 0, 0.5)', glowColor: 'rgba(255, 102, 0, 0.5)', name: 'Naranja Solar' }
            ],
            light: [
                { particleColor: '#0066ff', connectionColor: 'rgba(0, 150, 200, 0.15)', rippleColor: 'rgba(255, 204, 0, 0.5)', glowColor: 'rgba(0, 102, 255, 0.5)', name: 'Azul Profesional' },
                { particleColor: '#00aa77', connectionColor: 'rgba(0, 170, 119, 0.15)', rippleColor: 'rgba(255, 150, 0, 0.5)', glowColor: 'rgba(0, 170, 119, 0.5)', name: 'Verde Fresco' },
                { particleColor: '#ff6b6b', connectionColor: 'rgba(255, 107, 107, 0.15)', rippleColor: 'rgba(0, 180, 204, 0.5)', glowColor: 'rgba(255, 107, 107, 0.5)', name: 'Coral' },
                { particleColor: '#ffcc00', connectionColor: 'rgba(255, 204, 0, 0.15)', rippleColor: 'rgba(100, 0, 255, 0.5)', glowColor: 'rgba(255, 204, 0, 0.5)', name: 'Oro' },
                { particleColor: '#9933ff', connectionColor: 'rgba(153, 51, 255, 0.15)', rippleColor: 'rgba(255, 153, 0, 0.5)', glowColor: 'rgba(153, 51, 255, 0.5)', name: 'Violeta' },
                { particleColor: '#ff6600', connectionColor: 'rgba(255, 102, 0, 0.15)', rippleColor: 'rgba(255, 120, 0, 0.5)', glowColor: 'rgba(255, 102, 0, 0.5)', name: 'Naranja Solar' }
            ]
        };
        
        // Estado actual
        this.currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'dark';
        this.currentPaletteIndex = 0;
        this.selectedColorScheme = this.colorPalettes[this.currentTheme][this.currentPaletteIndex];
        
        this.init();
        this.setupThemeListener();
        this.setupColorMenu();
    }

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
            
            // Mostrar ambos colores (verde fijo + color seleccionable)
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

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('click', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.createRipple(e.clientX, e.clientY);
            for (let i = 0; i < 10; i++) {
                this.addParticle(e.clientX, e.clientY, true);
            }
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particleCount = window.innerWidth < 768 ? 50 : 100;
        this.generateParticles();
    }

    generateParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.addParticle(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
        }
    }

    addParticle(x, y, burst = false) {
const size = burst ? 4 : Math.random() * 2 + 1;
const speed = burst ? 3 : 0.5;
const angle = Math.random() * 2 * Math.PI;

// Determinar el radio y posición circular para la partícula
const radius = Math.random() * 50 + 100; // Radio del círculo
const centerX = x;  // Centro del círculo (puede ser cualquier punto)
const centerY = y;

// Distribuir partículas en círculo
const particleX = centerX + Math.cos(angle) * radius;
const particleY = centerY + Math.sin(angle) * radius;

// Alternar entre el color fijo verde y el color seleccionado
const useFixedColor = Math.random() > 0.5;
const particleColor = useFixedColor ? this.fixedColor.particleColor : this.selectedColorScheme.particleColor;
const glowColor = useFixedColor ? this.fixedColor.glowColor : this.selectedColorScheme.glowColor;

this.particles.push({
x: particleX, y: particleY, size,
speedX: Math.cos(angle) * speed,
speedY: Math.sin(angle) * speed,
opacity: 0.6 + Math.random() * 0.4,
particleColor,
glowColor
});
}

    createRipple(x, y) {
        // Usar color aleatorio (verde o seleccionado) para el ripple
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

    updateParticles() {
        this.particles.forEach(p => {
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                p.speedX += dx / distance * force * 0.5;
                p.speedY += dy / distance * force * 0.5;
            }

            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
        });
    }

    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.fillStyle = p.particleColor;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.shadowColor = p.glowColor;
            this.ctx.shadowBlur = 10;
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;
        });
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
                    // Crear degradado entre los dos colores de las partículas
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

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        this.drawRipples();
        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar el sistema de partículas
document.addEventListener('DOMContentLoaded', function() {
    const particleSystem = new ParticleSystem();
    
    // Configuración del toggle de modo claro/oscuro
    const toggleModeBtn = document.getElementById('toggle-mode');
    const htmlElement = document.documentElement;
    
    // Verificar preferencia guardada o usar la preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    htmlElement.setAttribute('data-bs-theme', currentTheme);
    updateToggleButton(currentTheme);
    
    // Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        htmlElement.setAttribute('data-bs-theme', newTheme);
        updateToggleButton(newTheme);
    });

    toggleModeBtn.addEventListener('click', () => {
        const newTheme = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-bs-theme', newTheme);
        updateToggleButton(newTheme);
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