document.addEventListener('DOMContentLoaded', function() {
    // Inicializar filtrado de tecnologías
    const techFilters = document.querySelectorAll('.tech-filter');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Añadir clase scan-effect a las tarjetas
    projectCards.forEach(card => {
        card.classList.add('scan-effect');
    });
    
    // Parse technology arrays for filtering
    projectCards.forEach(card => {
        const techString = card.getAttribute('data-technologies');
        // Convertir la representación de string a array real
        let techArray = [];
        if (techString) {
            techArray = techString.replace(/[\[\]']/g, '').split(', ');
        }
        card.setAttribute('data-technologies', JSON.stringify(techArray));
    });
    
    // Manejar filtros de tecnología
    techFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const technology = this.getAttribute('data-tech');
            
            // Toggle active class
            this.classList.toggle('active');
            
            // Get all active filters
            const activeFilters = Array.from(document.querySelectorAll('.tech-filter.active'))
                .map(el => el.getAttribute('data-tech'));
            
            if (activeFilters.length === 0) {
                // Show all projects if no filters are active
                projectCards.forEach(card => {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                });
            } else {
                // Filter projects based on selected technologies
                projectCards.forEach(card => {
                    const projectTechs = JSON.parse(card.getAttribute('data-technologies'));
                    const matchesFilter = activeFilters.every(filter => projectTechs.includes(filter));
                    
                    if (matchesFilter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            }
        });
    });
});