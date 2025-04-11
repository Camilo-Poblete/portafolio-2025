// Main JS
document.addEventListener('DOMContentLoaded', function() {
    // Remove preloader
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 500);
    
    // Initialize tooltip & popover
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Scroll to top button
    const scrollTopButton = document.querySelector('.scroll-top');
    if (scrollTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopButton.classList.add('active');
            } else {
                scrollTopButton.classList.remove('active');
            }
        });
        
        scrollTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Navbar on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Initialize smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Neon flicker effect
    const neonElements = document.querySelectorAll('.neon-text');
    neonElements.forEach(el => {
        setInterval(() => {
            el.style.opacity = (Math.random() > 0.95) ? '0.7' : '1';
        }, 100);
    });
    
    // Initialize scanner effect
    const scannerElements = document.querySelectorAll('.scanner');
    scannerElements.forEach((el, index) => {
        el.style.animationDelay = (index * 0.5) + 's';
    });
    
    // Add glitch effect to elements with data-text attribute
    const glitchElements = document.querySelectorAll('.glitch');
    glitchElements.forEach(el => {
        const text = el.getAttribute('data-text') || el.textContent;
        el.setAttribute('data-text', text);
    });
    
    // Function to filter projects
    window.filterProjects = function(filter, type = 'category') {
        // Get all filter buttons and remove active class
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-type') === type) {
                btn.classList.remove('active');
                if (btn.getAttribute('data-filter') === filter) {
                    btn.classList.add('active');
                }
            }
        });
        
        // Show/hide projects based on filter
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = '';
                return;
            }
            
            const categories = card.getAttribute('data-categories')?.split(',') || [];
            const technologies = card.getAttribute('data-technologies')?.split(',') || [];
            
            if (type === 'category' && categories.includes(filter)) {
                card.style.display = '';
            } else if (type === 'technology' && technologies.includes(filter)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    };
    
    // Function to open project modal
    window.openProjectModal = function(projectId) {
        const modal = document.getElementById('project-modal-' + projectId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    
    // Function to close all project modals
    window.closeProjectModals = function() {
        document.querySelectorAll('.project-modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    };
    
    // Close modal when clicking outside the content
    document.querySelectorAll('.project-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeProjectModals();
            }
        });
    });
    
    // Close modal when escape key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProjectModals();
        }
    });
    
    // Function to switch filter type
    window.switchFilterType = function(type) {
        document.querySelectorAll('.filter-type-switch span').forEach(span => {
            span.classList.toggle('active', span.getAttribute('data-type') === type);
        });
        
        if (type === 'category') {
            document.querySelector('.project-filters').style.display = 'flex';
            document.querySelector('.technology-filters').style.display = 'none';
            filterProjects('all', 'category');
        } else {
            document.querySelector('.project-filters').style.display = 'none';
            document.querySelector('.technology-filters').style.display = 'flex';
            filterProjects('all', 'technology');
        }
    };
    
    console.log("Portfolio site initialized successfully");
});
