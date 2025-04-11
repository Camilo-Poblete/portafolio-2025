class ParticleSystem {
    // ... (mantén todo el constructor y métodos existentes)

    createColorMenu() {
        const paletteContainer = document.getElementById('paletteOptions');
        if (!paletteContainer) {
            console.error("No se encontró el contenedor paletteOptions");
            return;
        }

        paletteContainer.innerHTML = '';
        const palettes = this.colorPalettes[this.currentTheme];

        palettes.forEach((palette, index) => {
            const option = document.createElement('button');
            option.className = 'btn btn-sm w-100 text-start mb-1';
            option.style.display = 'flex';
            option.style.alignItems = 'center';
            option.style.padding = '0.5rem 1rem';
            option.style.border = 'none';
            option.style.background = 'transparent';
            option.style.color = index === this.currentPaletteIndex ? '#fff' : '#adb5bd';
            option.style.transition = 'all 0.2s';
            option.onclick = () => this.setColorScheme(index);
            option.onmouseover = () => option.style.color = '#fff';
            option.onmouseout = () => option.style.color = index === this.currentPaletteIndex ? '#fff' : '#adb5bd';

            const colorPreview = document.createElement('div');
            colorPreview.style.width = '20px';
            colorPreview.style.height = '20px';
            colorPreview.style.backgroundColor = palette.particleColor;
            colorPreview.style.marginRight = '10px';
            colorPreview.style.borderRadius = '50%';
            colorPreview.style.border = `2px solid ${index === this.currentPaletteIndex ? palette.particleColor : 'transparent'}`;
            colorPreview.style.boxShadow = `0 0 8px ${palette.particleColor}`;

            const label = document.createElement('div');
            label.textContent = palette.name;

            option.appendChild(colorPreview);
            option.appendChild(label);
            paletteContainer.appendChild(option);
        });
    }

    updateColorMenu() {
        this.createColorMenu();
    }

    // ... (resto de tus métodos)
}

// Inicialización después de que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem();
    
    // Forzar la creación del menú si el acordeón está abierto por defecto
    const colorAccordion = document.getElementById('colorCollapse');
    if (colorAccordion) {
        colorAccordion.addEventListener('shown.bs.collapse', () => {
            particleSystem.createColorMenu();
        });
    }
});