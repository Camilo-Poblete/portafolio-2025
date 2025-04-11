function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    destroyParticles(); // Elimina el canvas existente

    setThemeStyles(isDark); // Aplica variables CSS del tema
    loadParticles(isDark);  // Carga nuevo config de partículas
}
