document.addEventListener('DOMContentLoaded', function() {
    // Inicializa la animación de las barras de habilidad
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-bar');
                skillBars.forEach(bar => {
                    const level = bar.getAttribute('data-level');
                    bar.style.width = level + '%';
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Observar cada panel de pestañas
    document.querySelectorAll('.tab-pane').forEach(pane => {
        observer.observe(pane);
    });

    // Animar las barras de habilidades blandas
    const softSkillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const softSkillItems = entry.target.querySelectorAll('.soft-skill-item');
                softSkillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 100);
                });
                softSkillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Observar la sección de habilidades blandas
    const softSkillsSection = document.querySelector('.soft-skills-list');
    if (softSkillsSection) {
        softSkillObserver.observe(softSkillsSection);
        // Inicialmente ocultar los elementos
        document.querySelectorAll('.soft-skill-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }

    // Animación del circuito de la placa base
    const circuitNodes = document.querySelectorAll('.circuit-node');
    circuitNodes.forEach((node, index) => {
        node.style.animationDelay = (index * 0.2) + 's';
    });
});