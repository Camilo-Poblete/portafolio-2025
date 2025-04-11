// Recuperar el estado guardado del modo en localStorage
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const mode = localStorage.getItem('theme') || 'light'; // Predeterminado: light
    if (mode === 'dark') {
        body.classList.add('dark-mode');
    }

    // Cambiar el modo al hacer clic en el botón
    const switchButton = document.getElementById('modeSwitchButton');
    if (switchButton) {
        switchButton.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            // Guardar la preferencia en localStorage
            const newMode = body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', newMode);
        });
    }
});
