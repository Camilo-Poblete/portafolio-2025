// Filter projects by technology using JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const techFilters = document.querySelectorAll('.tech-filter');
    const projectCards = document.querySelectorAll('.project-card');
    
    techFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            const tech = this.getAttribute('data-tech');
            
            // Make AJAX request to get filtered projects
            fetch(`/api/projects/?technology=${tech}`)
                .then(response => response.json())
                .then(projects => {
                    // Get all project IDs
                    const filteredIds = projects.map(p => p.id);
                    
                    // Show/hide projects based on filter
                    projectCards.forEach(card => {
                        const projectId = parseInt(card.getAttribute('data-id'));
                        if (filteredIds.includes(projectId)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                })
                .catch(error => console.error('Error fetching projects:', error));
        });
    });
});
