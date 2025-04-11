// animations.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize and animate skill progress bars
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
    
    // Add animations to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200 + 500);
    });
    
    // Setup initial styles for animation elements
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
    });
    
    // Animate tech icons
    const techIcons = document.querySelectorAll('.tech-icon');
    techIcons.forEach((icon, index) => {
        icon.style.opacity = '0';
        icon.style.transform = 'scale(0.5)';
        icon.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            icon.style.opacity = '1';
            icon.style.transform = 'scale(1)';
        }, index * 150 + 800);
    });
    
    // Interactive mouse effect on hero section
    const heroSection = document.querySelector('.hero-section');
    const cyberFrame = document.querySelector('.cyber-frame');
    const cyberCircle = document.querySelector('.cyber-circle');
    const cyberHex = document.querySelector('.cyber-hex');
    
    if (heroSection && cyberFrame && cyberCircle && cyberHex) {
        heroSection.addEventListener('mousemove', (e) => {
            const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
            const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
            
            cyberFrame.style.transform = `translate(calc(-50% + ${xPos * 0.5}px), calc(-50% + ${yPos * 0.5}px))`;
            cyberCircle.style.transform = `translate(calc(-50% + ${xPos * -0.3}px), calc(-50% + ${yPos * -0.3}px))`;
            cyberHex.style.transform = `translate(-50%, -50%) rotate(${xPos}deg)`;
            
            // Also affect hero content
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateX(${xPos * 0.2}px) translateY(${yPos * 0.2}px)`;
            }
        });
    }
});
