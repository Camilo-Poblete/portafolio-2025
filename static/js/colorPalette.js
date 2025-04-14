const btnChangeBg = document.getElementById('btn-change-bg');
const colorPalette = document.getElementById('colorPalette');
const paletteIcon = document.getElementById('palette-icon');
const scrollTopBtn = document.querySelector('.scroll-top');

// Colores por defecto
const defaultBgColor = '#00bfff'; // Color base del fondo (celeste)
const defaultTextColor = '#ffffff'; // Color base de texto en blanco para neon-text

// Función para establecer el tema base con colores de neón (blanco para neon-text)
const setDefaultTheme = () => {
    document.body.style.backgroundColor = defaultBgColor;
    document.body.style.color = defaultTextColor;

    // Aplicar color de fondo y texto a los botones (usando un color claro para texto)
    document.querySelectorAll('.btn, .btn-cyberpunk').forEach(btn => {
        btn.style.backgroundColor = defaultBgColor;
        btn.style.borderColor = defaultBgColor;
        btn.style.color = defaultTextColor;
    });

    // Aplicar color a iconos y bordes
    document.querySelectorAll('.project-icon').forEach(icon => {
        // Si es un SVG, usamos el atributo 'fill' para cambiar el color
        if (icon.tagName.toLowerCase() === 'svg') {
            icon.style.fill = defaultTextColor;
        } else {
            // Para iconos tipo FontAwesome (font-family: "Font Awesome 6 Free"), usamos 'color'
            icon.style.color = defaultTextColor;
        }
    });

    document.querySelectorAll('.project-shape').forEach(shape => {
        shape.style.borderColor = defaultTextColor;
    });

    // Establecer el color base para neon-text: Blanco (sin cambio) y color de sombra en función del color de fondo
    document.querySelectorAll('.neon-text').forEach(el => {
        el.style.color = defaultTextColor; // Blanco
        el.style.textShadow = `0 0 5px ${defaultTextColor}, 0 0 10px ${defaultTextColor}, 0 0 20px ${defaultTextColor}, 0 0 40px ${defaultTextColor}`; // Efecto de neón
    });

    // Establecer estilo para el botón de scroll-top
    if (scrollTopBtn) {
        scrollTopBtn.style.backgroundColor = '#005b92'; // Color original
        scrollTopBtn.style.color = '#ffffff';           // Ícono blanco
        scrollTopBtn.style.boxShadow = `0 0 15px rgba(0, 255, 170, 0.5)`; // Efecto glow verde
    }

    // Estilo del icono de paleta
    paletteIcon.style.color = '#000000';
};

// Función para aplicar el color seleccionado (fondo y texto)
const setThemeColor = (bgColor, textColor = '#ffffff') => {
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;

    // Aplicar color de fondo y texto a los botones (esto no cambiará el color de texto de los botones)
    document.querySelectorAll('.btn, .btn-cyberpunk').forEach(btn => {
        btn.style.backgroundColor = bgColor;
        btn.style.borderColor = bgColor;
        btn.style.color = defaultTextColor; // Mantener el color base celeste de texto en los botones
    });

    // Aplicar color a iconos y bordes
    document.querySelectorAll('.project-icon').forEach(icon => {
        // Si es un SVG, usamos el atributo 'fill' para cambiar el color
        if (icon.tagName.toLowerCase() === 'svg') {
            icon.style.fill = textColor; // Cambiar color de los SVGs
        } else {
            // Para iconos tipo FontAwesome (font-family: "Font Awesome 6 Free"), usamos 'color'
            icon.style.color = textColor; // Cambiar color de los iconos Font Awesome
        }
    });

    document.querySelectorAll('.project-shape').forEach(shape => {
        shape.style.borderColor = textColor;
    });

    // Aplicar el efecto de neón a neon-text
    document.querySelectorAll('.neon-text').forEach(el => {
        el.style.color = defaultTextColor; // Color de texto blanco para neon-text
        el.style.textShadow = `0 0 5px ${bgColor}, 0 0 10px ${bgColor}, 0 0 20px ${bgColor}, 0 0 40px ${bgColor}`; // Efecto de neón con el color seleccionado
    });

    // Cambiar estilo del botón de scroll-top
    if (scrollTopBtn) {
        scrollTopBtn.style.backgroundColor = bgColor;
        scrollTopBtn.style.color = textColor;
        scrollTopBtn.style.boxShadow = `0 0 15px ${bgColor}`;
    }

    paletteIcon.style.color = '';
};

// Abrir/ cerrar la paleta de colores
btnChangeBg.addEventListener('click', () => {
    colorPalette.classList.toggle('d-none');
});

// Cuando se selecciona un color de la paleta
colorPalette.addEventListener('click', (e) => {
    if (e.target.classList.contains('color-box')) {
        const bgColor = e.target.getAttribute('data-color');
        const textColor = defaultTextColor; // El color de texto siempre será blanco para neon-text
        localStorage.setItem('bgColor', bgColor);
        localStorage.setItem('textColor', textColor); // Guardar el color de texto también
        setThemeColor(bgColor, textColor); // Aplicar color de fondo y color de texto
    }
});

// Cargar los colores guardados en localStorage
window.addEventListener('DOMContentLoaded', () => {
    const savedBgColor = localStorage.getItem('bgColor') || defaultBgColor;
    const savedTextColor = localStorage.getItem('textColor') || defaultTextColor;
    setThemeColor(savedBgColor, savedTextColor); // Usar el color guardado o el predeterminado
});

// Mostrar u ocultar el botón de scroll-top dependiendo del desplazamiento
window.addEventListener('scroll', () => {
    if (scrollTopBtn) {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('scroll-top-active');
        } else {
            scrollTopBtn.classList.remove('scroll-top-active');
        }
    }
});
