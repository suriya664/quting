/* QUILTING GUILD - ANIMATIONS & INTERACTIVITY */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initFloatingFabrics();
    initScrollReveal();
});

/* Theme Management */
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    if (!icon) return;
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

/* Floating Fabric Swatches */
function initFloatingFabrics() {
    const fabricImages = [
        'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=100&h=100&fit=crop', // Floral
        'https://images.unsplash.com/photo-1604521376281-17f697b68d76?w=100&h=100&fit=crop', // Quilt pattern
        'https://images.unsplash.com/photo-1590736910113-f661cc296996?w=100&h=100&fit=crop'  // Textures
    ];

    function createFloatingFabric() {
        if (document.hidden) return;

        const fabric = document.createElement('div');
        fabric.className = 'floating-fabric';

        const size = Math.random() * 20 + 30; // 30-50px
        fabric.style.width = `${size}px`;
        fabric.style.height = `${size}px`;
        fabric.style.left = Math.random() * 100 + '%';
        fabric.style.top = '100vh';
        fabric.style.backgroundImage = `url(${fabricImages[Math.floor(Math.random() * fabricImages.length)]})`;
        fabric.style.borderRadius = '8px';
        fabric.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';

        // Random animation duration
        const duration = Math.random() * 5 + 5; // 5-10s
        fabric.style.animationDuration = `${duration}s`;

        document.body.appendChild(fabric);

        setTimeout(() => fabric.remove(), duration * 1000);
    }

    // Start generating swatches
    setInterval(createFloatingFabric, 3000);
}

/* Scroll Reveal Animation */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('patchwork-grid')) {
                    animatePatches(entry.target);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .patchwork-grid').forEach(el => {
        observer.observe(el);
    });
}

function animatePatches(grid) {
    const patches = grid.querySelectorAll('.patch');
    patches.forEach((patch, index) => {
        patch.style.animationDelay = `${index * 0.1}s`;
    });
}

/* Utility: Mobile Menu (to be added to header template) */
function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('mobile-active');
}
