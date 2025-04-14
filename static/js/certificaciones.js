function filterCertifications(filter, type = 'tech_category') {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-filter') === filter && btn.getAttribute('data-type') === type;
        btn.classList.toggle('active', isActive);
    });
    
    // Filter certifications
    const certifications = document.querySelectorAll('.certification-card');
    certifications.forEach(certification => {
        const dataAttribute = type === 'tech_category' ? 'data-tech-categories' : 'data-technologies';
        const values = certification.getAttribute(dataAttribute)?.split(',') || [];

        // Show or hide certification based on filter
        certification.style.display = (filter === 'all' || values.includes(filter)) ? '' : 'none';
    });
}

function switchFilterType(type) {
    // Switch active filter type
    const filterSwitch = document.querySelectorAll('.filter-type-switch span');
    filterSwitch.forEach(span => {
        span.classList.toggle('active', span.getAttribute('data-type') === type);
    });

    // Show/hide appropriate filters
    const categoryFilters = document.querySelector('.tech-categories-filter');
    const technologyFilters = document.querySelector('.technologies-filter');

    categoryFilters.style.display = (type === 'tech_category') ? 'flex' : 'none';
    technologyFilters.style.display = (type === 'technology') ? 'flex' : 'none';

    // Apply filter to show all certifications initially for the selected filter type
    filterCertifications('all', type);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize certification cards with animation
    const cards = document.querySelectorAll('.certification-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Scroll to the filtered section if necessary
    if (window.location.search.includes('tech_category') || window.location.search.includes('technology')) {
        document.getElementById('certifications-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});