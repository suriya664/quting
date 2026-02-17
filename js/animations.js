/* QUILTING GUILD - ANIMATIONS & INTERACTIVITY */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRTL();
    initFloatingFabrics();
    initScrollReveal();
    initMobileMenu();
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
    const icons = document.querySelectorAll('.theme-toggle i');
    icons.forEach(icon => {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    });
}

/* RTL Support */
function initRTL() {
    const rtlToggles = document.querySelectorAll('.rtl-toggle');
    if (rtlToggles.length === 0) return;

    const isRTL = localStorage.getItem('rtl') === 'true';
    if (isRTL) {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
    updateRTLIcon(isRTL);

    rtlToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentDir = document.documentElement.getAttribute('dir');
            const nextRTL = currentDir === 'ltr';

            document.documentElement.setAttribute('dir', nextRTL ? 'rtl' : 'ltr');
            localStorage.setItem('rtl', nextRTL);
            updateRTLIcon(nextRTL);
        });
    });
}

function updateRTLIcon(isRTL) {
    const icons = document.querySelectorAll('.rtl-toggle i');
    icons.forEach(icon => {
        icon.className = isRTL ? 'fas fa-align-right' : 'fas fa-align-left';
    });
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

/* Utility: Mobile Menu */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const nav = document.querySelector('#main-nav');
    const overlay = document.getElementById('nav-overlay');
    
    if (!hamburger || !nav || !overlay) return;
    
    // Add mobile theme controls to navigation
    addMobileThemeControls(nav);
    
    hamburger.addEventListener('click', () => {
        const isOpen = nav.classList.contains('active');
        
        if (isOpen) {
            // Close menu
            nav.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            // Open menu
            nav.classList.add('active');
            overlay.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close menu when clicking on links
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

function addMobileThemeControls(nav) {
    // Check if mobile controls already exist
    if (nav.querySelector('.mobile-theme-controls')) return;
    
    // Create mobile theme controls container
    const mobileControls = document.createElement('div');
    mobileControls.className = 'mobile-theme-controls';
    
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Theme';
    
    // Create RTL toggle button
    const rtlToggle = document.createElement('button');
    rtlToggle.className = 'rtl-toggle';
    rtlToggle.setAttribute('aria-label', 'Toggle RTL');
    rtlToggle.innerHTML = '<i class="fas fa-align-left"></i> RTL';
    
    // Add event listeners
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTheme();
    });
    
    rtlToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleRTL();
    });
    
    // Append buttons to container
    mobileControls.appendChild(themeToggle);
    mobileControls.appendChild(rtlToggle);
    
    // Append container to navigation
    nav.appendChild(mobileControls);
    
    // Update initial states
    updateMobileThemeControls();
}

function updateMobileThemeControls() {
    const mobileThemeToggle = document.querySelector('.mobile-theme-controls .theme-toggle i');
    const mobileRtlToggle = document.querySelector('.mobile-theme-controls .rtl-toggle i');
    
    if (mobileThemeToggle) {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        mobileThemeToggle.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    if (mobileRtlToggle) {
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
        mobileRtlToggle.className = isRTL ? 'fas fa-align-right' : 'fas fa-align-left';
    }
}

function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    updateMobileThemeControls();
}

function toggleRTL() {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    const newDir = isRTL ? 'ltr' : 'rtl';
    
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem('rtl', newDir === 'rtl');
    updateRTLIcon(newDir === 'rtl');
    updateMobileThemeControls();
}

function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    if (nav) nav.classList.toggle('mobile-active');
}
