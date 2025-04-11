/**
 * Main JavaScript for Portfolio Site
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("Portfolio site initialized successfully");
    
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
    
    // Initialize skill progress bars
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
    
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
    
    // Switch between filter types (category/technology)
    window.switchFilterType = function(filterType) {
        // Get all switch buttons and update active state
        const switchButtons = document.querySelectorAll('.switch-btn');
        switchButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-type') === filterType) {
                btn.classList.add('active');
            }
        });
        
        // Show/hide appropriate filter sections
        if (filterType === 'category') {
            document.querySelector('.project-filters').style.display = '';
            document.querySelector('.tech-filters').style.display = 'none';
        } else if (filterType === 'tech') {
            document.querySelector('.project-filters').style.display = 'none';
            document.querySelector('.tech-filters').style.display = '';
        }
        
        // Reset to showing all projects
        filterProjects('all', 'category');
    };
    
    // Filter projects by category or technology
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
    
    // Add animations to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.5s ease';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 200);
                        observer.unobserve(item);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(item);
        });
    }
    
    // Animate tech icons with intersection observer
    const techIcons = document.querySelectorAll('.tech-icon');
    if (techIcons.length > 0) {
        techIcons.forEach((icon, index) => {
            icon.style.opacity = '0';
            icon.style.transform = 'scale(0.5)';
            icon.style.transition = 'all 0.5s ease';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            icon.style.opacity = '1';
                            icon.style.transform = 'scale(1)';
                        }, index * 150);
                        observer.unobserve(icon);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(icon);
        });
    }
    
    // Interactive mouse effect on hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        // Find elements that should react to mouse movement
        const cyberElements = heroSection.querySelectorAll('.cyber-frame, .cyber-circle, .cyber-hex, .hero-content');
        
        heroSection.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
            
            cyberElements.forEach(el => {
                // Add different movement effects based on element class
                if (el.classList.contains('cyber-frame')) {
                    el.style.transform = `translate(calc(-50% + ${xPos * 0.5}px), calc(-50% + ${yPos * 0.5}px))`;
                } else if (el.classList.contains('cyber-circle')) {
                    el.style.transform = `translate(calc(-50% + ${xPos * -0.3}px), calc(-50% + ${yPos * -0.3}px))`;
                } else if (el.classList.contains('cyber-hex')) {
                    el.style.transform = `translate(-50%, -50%) rotate(${xPos}deg)`;
                } else if (el.classList.contains('hero-content')) {
                    el.style.transform = `translateX(${xPos * 0.2}px) translateY(${yPos * 0.2}px)`;
                }
            });
        });
    }
});