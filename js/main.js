// Add scroll reveal animations, theme toggle, back-to-top button, and mobile responsiveness
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial theme based on preference or system setting
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.setAttribute('data-theme', 'dark');
        if(document.getElementById('theme-toggle')) {
            document.getElementById('theme-toggle').textContent = '☀️ Light Mode';
        }
    } else {
        document.body.setAttribute('data-theme', 'light');
        if(document.getElementById('theme-toggle')) {
            document.getElementById('theme-toggle').textContent = '🌙 Dark Mode';
        }
    }

    // Add loaded class for initial animations
    document.body.classList.add('loaded');

    // Simple scroll animation for elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Observe cards and sections
    document.querySelectorAll('.card, header, section').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Theme toggle functionality
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', function() {
            const bodyElement = document.body;
            const currentTheme = bodyElement.getAttribute('data-theme');

            if (currentTheme === 'dark') {
                bodyElement.setAttribute('data-theme', 'light');
                this.textContent = '🌙 Dark Mode';
                localStorage.setItem('theme', 'light');
            } else {
                bodyElement.setAttribute('data-theme', 'dark');
                this.textContent = '☀️ Light Mode';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Create and add back-to-top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑'; // Simple arrow icon
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);

    // Show/hide back-to-top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (event) => {
        const currentTheme = document.body.getAttribute('data-theme');
        const savedTheme = localStorage.getItem('theme');

        // Only change theme automatically if user hasn't manually selected one
        if (!savedTheme) {
            if (event.matches) {
                document.body.setAttribute('data-theme', 'dark');
                if(document.getElementById('theme-toggle')) {
                    document.getElementById('theme-toggle').textContent = '☀️ Light Mode';
                }
            } else {
                document.body.setAttribute('data-theme', 'light');
                if(document.getElementById('theme-toggle')) {
                    document.getElementById('theme-toggle').textContent = '🌙 Dark Mode';
                }
            }
        }
    });

    // Handle mobile-specific functionality
    function handleMobileLayout() {
        const viewportWidth = window.innerWidth;

        if (viewportWidth <= 500) {
            // On mobile, collapse and make cards expandable
            document.querySelectorAll('.expandable-card').forEach(card => {
                card.classList.remove('expanded');
            });
            setupExpandableCards();
        } else {
            // On desktop, show all content
            removeExpandableCards();
        }
    }

    // Setup expandable cards for mobile
    function setupExpandableCards() {
        document.querySelectorAll('.expandable-card').forEach(card => {
            // Make sure we only add the event listener once
            if (!card.dataset.listenerAdded) {
                card.addEventListener('click', function(event) {
                    // Only expand if the click wasn't on a link
                    if (event.target.tagName !== 'A') {
                        this.classList.toggle('expanded');
                    }
                });

                card.dataset.listenerAdded = 'true';
            }
        });
    }

    // Show all content on desktop without destroying the expandable-card class
    function removeExpandableCards() {
        document.querySelectorAll('.expandable-card').forEach(card => {
            card.classList.add('expanded');
        });
    }

    // Initial check
    handleMobileLayout();

    // Listen for resize events
    window.addEventListener('resize', handleMobileLayout);

    // Initialize introduction text expansion
    setupIntroTextToggle();
});

function setupIntroTextToggle() {
    const introToggleButton = document.getElementById('expand-intro');
    const introTextContainer = document.querySelector('.intro-text-container');

    if (introToggleButton && introTextContainer) {
        introToggleButton.addEventListener('click', function() {
            // Toggle the expanded class
            introTextContainer.classList.toggle('intro-expanded');

            // Update button text based on state
            if (introTextContainer.classList.contains('intro-expanded')) {
                introToggleButton.textContent = 'Show less...';
            } else {
                introToggleButton.textContent = 'Show more...';
            }
        });
    }
}