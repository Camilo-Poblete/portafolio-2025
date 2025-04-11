class MoleculeSystem {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.molecules = [];
    }

    generateMolecules(newColor) {
        const moleculeCount = 10; // Número de moléculas a generar
        const color = newColor || this.particleSystem.colorScheme.particleColor; // Si se pasa un nuevo color, usarlo, si no, usar el predeterminado

        // Crear nuevas moléculas con el color seleccionado
        for (let i = 0; i < moleculeCount; i++) {
            const centerX = Math.random() * this.particleSystem.canvas.width;
            const centerY = Math.random() * this.particleSystem.canvas.height;
            const radius = 40 + Math.random() * 60;
            const particles = [];
            const moleculeColor = color;

            for (let j = 0; j < 20; j++) {
                const angle = (j / 20) * Math.PI * 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;

                particles.push({
                    x, y,
                    size: 1.5 + Math.random() * 1.5,
                    speedX: Math.cos(angle + Math.PI / 2) * 0.3,
                    speedY: Math.sin(angle + Math.PI / 2) * 0.3,
                    opacity: 1, // No permitir que las moléculas se desvanezcan
                    isMolecule: true,
                    color: moleculeColor
                });
            }

            this.molecules.push(...particles);
        }
    }

    drawMolecules() {
        this.molecules.forEach(m => {
            this.particleSystem.ctx.beginPath();
            this.particleSystem.ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
            this.particleSystem.ctx.fillStyle = m.color;
            this.particleSystem.ctx.fill();
        });
    }
}

// Exportar el sistema de moléculas para usarlo en el archivo principal
export { MoleculeSystem };
