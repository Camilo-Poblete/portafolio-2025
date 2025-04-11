function filterProjects(filter, type = 'category') {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-filter') === filter && btn.getAttribute('data-type') === type;
        btn.classList.toggle('active', isActive);
    });
    
    // Filter projects
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
        const dataAttribute = type === 'category' ? 'data-categories' : 'data-technologies';
        const values = project.getAttribute(dataAttribute).split(',');

        // Show or hide project based on filter
        project.style.display = (filter === 'all' || values.includes(filter)) ? '' : 'none';
    });
}

function switchFilterType(type) {
    // Switch active filter type
    const filterSwitch = document.querySelectorAll('.filter-type-switch span');
    filterSwitch.forEach(span => {
        span.classList.toggle('active', span.getAttribute('data-type') === type);
    });

    // Show/hide appropriate filters
    const categoryFilters = document.querySelector('.project-filters');
    const technologyFilters = document.querySelector('.technology-filters');

    categoryFilters.style.display = (type === 'category') ? 'flex' : 'none';
    technologyFilters.style.display = (type === 'technology') ? 'flex' : 'none';

    // Apply filter to show all projects initially for the selected filter type
    filterProjects('all', type);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize project cards with animation
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Scroll to the filtered section if necessary
    {% if current_filter %}
    document.getElementById('projects-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
    {% endif %}
});
