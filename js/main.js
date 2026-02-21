// Main JavaScript for Free Quilt Website

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality with basic error handling
    try {
        if (typeof Auth !== 'undefined') {
            initAuthState();
        }
        initMobileMenu();
        initPatternModals();
        initSmoothScrolling();
        initLazyLoading();
        initSearchFunctionality();
        initFilterFunctionality();
        initDownloadTracking();
    } catch (error) {
        console.warn('Non-critical initialization error:', error);
    }

    try {
        initThemeToggle();
        initLogout();
    } catch (error) {
        console.error('Critical initialization error (Theme Toggle/Logout):', error);
    }
});

// Initialize Authentication State
function initAuthState() {
    updateAuthUI();
    setupAuthEventListeners();
}

// Update Authentication UI
function updateAuthUI() {
    const currentUser = Auth.getCurrentUser();
    const authLinks = document.getElementById('auth-links');
    const userMenu = document.getElementById('user-menu');
    const logoutBtns = document.querySelectorAll('#logout-btn, .logout-btn');
    const isDashboardPage = window.location.pathname.toLowerCase().includes('dashboard.html');

    // Handle Logo and Dashboard links
    document.querySelectorAll('.logo, .dashboard-btn').forEach(link => {
        link.href = 'dashboard.html';
    });

    if (currentUser) {
        // User is logged in
        if (authLinks) authLinks.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (headerUserName) headerUserName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        logoutBtns.forEach(btn => btn.style.display = 'flex');
    } else {
        // User is logged out
        if (authLinks) authLinks.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
        logoutBtns.forEach(btn => btn.style.display = isDashboardPage ? 'flex' : 'none');
    }
}

// Global logout hook for main pages
function initLogout() {
    const logoutBtns = document.querySelectorAll('#logout-btn, .logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof Auth !== 'undefined' && Auth.logout) {
                Auth.logout();
            } else {
                // Fallback logout
                localStorage.removeItem('currentUser');
                localStorage.removeItem('rememberMe');
                window.location.href = 'index.html';
            }
        });
    });
}

// Setup Auth Event Listeners
function setupAuthEventListeners() {
    // User dropdown toggle
    const dropdownToggle = document.getElementById('header-dropdown-toggle');
    const dropdownMenu = document.getElementById('header-dropdown-menu');

    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', () => {
            dropdownMenu.classList.remove('active');
        });

        dropdownMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('header-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    }

    // Listen for auth state changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'currentUser') {
            updateAuthUI();
        }
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mainMenu = document.getElementById('main-menu');

    if (mobileToggle && mainMenu) {
        mobileToggle.addEventListener('click', function () {
            mainMenu.classList.toggle('active');

            // Animate hamburger menu
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = mainMenu.classList.contains('active')
                    ? getHamburgerTransform(index)
                    : '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!mobileToggle.contains(e.target) && !mainMenu.contains(e.target)) {
                mainMenu.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans.forEach(span => span.style.transform = '');
            }
        });
    }
}

function getHamburgerTransform(index) {
    const transforms = [
        'rotate(45deg) translate(5px, 5px)',
        'opacity: 0',
        'rotate(-45deg) translate(7px, -6px)'
    ];
    return transforms[index];
}

// Pattern Modal Functionality
function initPatternModals() {
    const modal = createModal();
    document.body.appendChild(modal);

    // Add click handlers to all pattern download buttons
    const downloadBtns = document.querySelectorAll('.pattern-download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const patternName = this.dataset.pattern;
            showPatternModal(patternName, this);
        });
    });
}

function createModal() {
    const modal = document.createElement('div');
    modal.className = 'pattern-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-body">
                <img src="" alt="" class="modal-image">
                <h2></h2>
                <p></p>
                <div class="pattern-instructions">
                    <h3>Instructions</h3>
                    <ol>
                        <li>Gather all materials listed in the pattern</li>
                        <li>Cut fabric pieces according to cutting guide</li>
                        <li>Follow step-by-step assembly instructions</li>
                        <li>Press seams carefully at each step</li>
                        <li>Complete final quilting and binding</li>
                    </ol>
                </div>
                <div class="materials-list">
                    <h3>Materials Needed</h3>
                    <ul>
                        <li>Fabric pieces as specified in pattern</li>
                        <li>Coordinating thread</li>
                        <li>Cutting mat and rotary cutter</li>
                        <li>Sewing machine</li>
                        <li>Iron and pressing surface</li>
                    </ul>
                </div>
                <button class="pattern-download-btn download-animation">Download Full PDF Pattern</button>
            </div>
        </div>
    `;

    // Close modal events
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal(modal);
    });

    return modal;
}

function showPatternModal(patternName, triggerBtn) {
    const modal = document.querySelector('.pattern-modal');
    const patternData = getPatternData(patternName);

    if (patternData) {
        modal.querySelector('.modal-image').src = patternData.image;
        modal.querySelector('.modal-image').alt = patternData.title;
        modal.querySelector('.modal-body h2').textContent = patternData.title;
        modal.querySelector('.modal-body p').textContent = patternData.description;

        const downloadBtn = modal.querySelector('.pattern-download-btn');
        downloadBtn.onclick = function () {
            downloadPattern(patternName, patternData.title);
        };

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function getPatternData(patternName) {
    const patterns = {
        'dresden-delight': {
            title: 'Dresden Delight Quilt',
            description: 'Beautiful Dresden plate design perfect for intermediate quilters. This classic pattern features elegant wedge-shaped pieces that form a stunning flower-like design.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150216/Dresden-Delight-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'mini-charmer': {
            title: 'Mini Charmer Table Runner',
            description: 'Charming table runner perfect for dining room decoration. This quick and easy project is great for beginners and adds a touch of handmade elegance to any table.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150434/Mini-Charmer-Table-Runner-NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'tetris-tumble': {
            title: 'Tetris Tumble Quilt',
            description: 'Fun geometric design inspired by the classic game Tetris. Perfect for using scraps and creating a playful, modern look.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150531/Tetris-Tumble-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'country-star': {
            title: 'Country Star Quilt',
            description: 'Traditional star pattern with a country-inspired twist. This timeless design features a central star surrounded by complementary blocks.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150152/Country-Star-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'overlapping-lines': {
            title: 'Overlapping Lines Quilt',
            description: 'Modern geometric design with clean overlapping lines. This contemporary pattern creates visual interest through intersecting linear elements.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150454/Overlapping-Lines-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'split-chevron': {
            title: 'Split Chevron Quilt',
            description: 'Contemporary chevron pattern with split design elements. This modern take on a classic pattern adds visual complexity and interest.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150517/Split-Chevron-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'modern-angle': {
            title: 'Modern Angle Quilt',
            description: 'Sleek modern design with angular geometric patterns. This contemporary quilt features bold lines and dynamic angles.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150439/Modern-Angle-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'flying-geese': {
            title: 'Flying Geese Frenzy Quilt',
            description: 'Classic flying geese pattern with a modern twist. This traditional design is updated with fresh color combinations and layout.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150229/Flying-Geese-Frenzy-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'jelly-roll': {
            title: 'Jelly Roll Jumble Quilt',
            description: 'Perfect for using jelly roll precuts in a colorful design. This pattern makes the most of precut strips for quick assembly.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150358/Jelly-Roll-Jumble-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'sunshine-runner': {
            title: 'Let the Sunshine In Table Runner',
            description: 'Bright and cheerful table runner to bring sunshine to your dining room. Features warm colors and an uplifting design.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/10/06142546/Let-the-sunshine-in_NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'garden-glory': {
            title: 'Garden Glory',
            description: 'Beautiful garden-inspired quilt pattern with floral elements. Perfect for bringing the beauty of nature into your home.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150935/Carden-Glory_NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'sewing-undercover': {
            title: 'Sewing Undercover',
            description: 'Practical sewing machine cover with decorative quilting. Protect your machine while adding beauty to your sewing space.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22151237/Sewing-Undercover_NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'monogram-hanger': {
            title: 'His & Hers Monogram Hanger',
            description: 'Personalized monogrammed hangers for closet organization. Add a touch of elegance to your wardrobe with custom monograms.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22151232/Monogram-hanger_NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'star-trivet': {
            title: 'Layered Star Trivet',
            description: 'Decorative and functional star-shaped hot pad for your table. Protect your surfaces while adding beautiful decor.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22151407/Layered-Star-Trivet_16x9_titlecard_notext-1.jpg'
        },
        'touring-tote': {
            title: 'Touring Tote Bag',
            description: 'Spacious and stylish tote bag perfect for travel or shopping. Features multiple pockets and sturdy construction.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150544/Touring-Tote-Bag_16x9_titlecard_notext.jpg'
        },
        'cabin-scraps': {
            title: 'Cabin Scraps Mini Quilt',
            description: 'Rustic mini quilt perfect for using fabric scraps. Cozy design that brings warmth to any space.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150121/Cabin-Scraps-Mini-Quilt_16x9_titlecard_notext.jpg'
        },
        'tulip-tango': {
            title: 'Tulip Tango Tablerunner',
            description: 'Elegant table runner featuring tulip-inspired designs. Perfect for spring dining and special occasions.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22151736/Tulip-Tango-Tablerunner_16x9_titlecard_notext.jpg'
        },
        'casserole-cover': {
            title: 'Too Hot to Handle Casserole Cover',
            description: 'Insulated casserole carrier for potlucks and gatherings. Keep your dishes warm while adding handmade charm.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22151902/Too-hot-to-handle_NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'half-hexagon': {
            title: 'Happy Half Hexagon Quilt',
            description: 'Modern hexagon quilt with fresh, cheerful colors. Contemporary take on traditional hexagon designs.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150328/Happy-Half-Hexagon-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'hexagon-coaster': {
            title: 'Crazy Hexagon Coaster',
            description: 'Fun and colorful hexagon coasters for your home. Perfect for using small scraps and brightening up your decor.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150157/Crazy-Hexagon-Coaster_NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'sapphire-topper': {
            title: 'Sapphire Shimmer Table Topper',
            description: 'Elegant table topper with rich blue tones and shimmering design. Adds sophistication to any dining setting.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150508/Sapphire-Shimmer-Table-Topper-NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'shamrock-placemat': {
            title: 'Shamrock Star Placemat',
            description: 'Festive placemat perfect for St. Patrick\'s Day celebrations. Combines traditional symbols with star design elements.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150513/Shamrock-Star-Placemat-NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'diamond-drop': {
            title: 'Diamond Drop Quilt',
            description: 'Elegant diamond pattern with cascading design elements. Sophisticated layout that creates movement and flow.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150202/Diamond-Drop-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg'
        },
        'treat-wall-hanging': {
            title: 'It\'s a Treat Quilted Wall Hanging',
            description: 'Decorative wall hanging perfect for seasonal decoration. Versatile design that can be customized for any occasion.',
            image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150353/Its-a-Treat-Quilted-Wall-Hanging-NQC_TitleCards_16x9_titlecard_notext.jpg'
        }
    };

    return patterns[patternName] || null;
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active nav state
                updateActiveNav(targetId);
            }
        });
    });
}

function updateActiveNav(targetId) {
    // Remove active class from all links
    document.querySelectorAll('.nav-link, .secondary-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current link
    const activeLink = document.querySelector(`a[href="#${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '1';
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.style.opacity = '1';
        });
    }
}

// Search Functionality
function initSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function (e) {
            const searchTerm = e.target.value.toLowerCase();
            filterPatterns(searchTerm);
        }, 300));
    }
}

function filterPatterns(searchTerm) {
    const patternCards = document.querySelectorAll('.pattern-card');

    patternCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            animateCard(card);
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter Functionality
function initFilterFunctionality() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.dataset.filter;
            applyFilter(filterValue);
        });
    });
}

function applyFilter(filterValue) {
    const patternCards = document.querySelectorAll('.pattern-card');

    patternCards.forEach(card => {
        if (filterValue === 'all' || card.dataset.category === filterValue) {
            card.style.display = 'block';
            animateCard(card);
        } else {
            card.style.display = 'none';
        }
    });
}

function animateCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    setTimeout(() => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
}

// Download Tracking
function initDownloadTracking() {
    // Track all download clicks
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('pattern-download-btn')) {
            const patternName = e.target.dataset.pattern || e.target.closest('.pattern-card').querySelector('h3').textContent;
            trackDownload(patternName);
        }
    });
}

function downloadPattern(patternId, patternName) {
    // Create a mock download (in real implementation, this would link to actual PDF)
    const link = document.createElement('a');
    link.href = '#'; // In real implementation, this would be the actual PDF URL
    link.download = `${patternName.replace(/\s+/g, '-').toLowerCase()}-pattern.pdf`;

    // Show download notification
    showDownloadNotification(patternName);

    // Track the download
    trackDownload(patternId);

    // Simulate download
    setTimeout(() => {
        link.click();
    }, 1000);
}

function trackDownload(patternName) {
    // In a real implementation, this would send data to analytics
    console.log(`Pattern downloaded: ${patternName}`);

    // Store in localStorage for demo purposes
    const downloads = JSON.parse(localStorage.getItem('patternDownloads') || '[]');
    downloads.push({
        pattern: patternName,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('patternDownloads', JSON.stringify(downloads));
}

function showDownloadNotification(patternName) {
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>Download Started!</h4>
            <p>${patternName} pattern is being downloaded...</p>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60, #229954);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS for download notification
const notificationStyles = `
    .download-notification .notification-content h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
    }
    
    .download-notification .notification-content p {
        margin: 0;
        font-size: 0.9rem;
        opacity: 0.9;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    if (!themeToggle || !icon) return;

    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');

        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}
