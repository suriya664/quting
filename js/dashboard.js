// Dashboard JavaScript

class Dashboard {
    static currentUser = null;

    // Initialize Dashboard
    static init() {
        this.setupUserMenu();
        this.setupMobileMenu();
        this.initSidebar(); // Added this line
        this.loadUserData();
        this.setupEventListeners();
        this.initializeCharts();
        this.startRealTimeUpdates();
    }

    // Initialize Sidebar
    static initSidebar() {
        const toggleBtn = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('dashboard-sidebar');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 992 &&
                    !sidebar.contains(e.target) &&
                    !toggleBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            });
        }
    }

    // Update User Interface
    static updateUserInterface() {
        // Update welcome message
        const welcomeName = document.getElementById('welcome-name');
        if (welcomeName) {
            welcomeName.textContent = this.currentUser.firstName;
        }

        // Update user info
        const userName = document.getElementById('user-name');
        if (userName) {
            userName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        }

        // Update user level
        const userLevel = document.querySelector('.user-level');
        if (userLevel) {
            userLevel.textContent = this.formatSkillLevel(this.currentUser.skillLevel);
        }

        // Update stats
        this.updateStats();
    }

    // Format Skill Level
    static formatSkillLevel(level) {
        const levels = {
            'beginner': 'Beginner Quilter',
            'intermediate': 'Intermediate Quilter',
            'advanced': 'Advanced Quilter',
            'expert': 'Expert Quilter'
        };
        return levels[level] || 'Quilter';
    }

    // Update Stats
    static updateStats() {
        const stats = this.currentUser.stats || {};

        // Update stat cards with animation
        this.animateStatNumber('patterns-downloaded', stats.patternsDownloaded || 0);
        this.animateStatNumber('active-projects', this.getActiveProjectsCount());
        this.animateStatNumber('favorites', this.currentUser.favorites?.length || 0);
        this.animateStatNumber('streak-days', this.calculateStreak());
    }

    // Animate Stat Number
    static animateStatNumber(statId, targetValue) {
        const statCard = document.querySelector(`[data-stat="${statId}"]`) ||
            document.querySelector('.stat-number');

        if (statCard) {
            const startValue = 0;
            const duration = 1500;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
                statCard.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }
    }

    // Get Active Projects Count
    static getActiveProjectsCount() {
        // In real app, this would come from user data
        return 3;
    }

    // Calculate Streak
    static calculateStreak() {
        // In real app, this would calculate based on activity
        return 24;
    }

    // Setup User Menu
    static setupUserMenu() {
        const dropdownToggle = document.getElementById('dropdown-toggle');
        const dropdownMenu = document.getElementById('dropdown-menu');

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
    }

    // Setup Mobile Menu
    static setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const mainMenu = document.getElementById('main-menu');

        if (mobileToggle && mainMenu) {
            mobileToggle.addEventListener('click', () => {
                mainMenu.classList.toggle('active');

                // Animate hamburger menu
                const spans = mobileToggle.querySelectorAll('span');
                spans.forEach((span, index) => {
                    span.style.transform = mainMenu.classList.contains('active')
                        ? this.getHamburgerTransform(index)
                        : '';
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !mainMenu.contains(e.target)) {
                    mainMenu.classList.remove('active');
                    const spans = mobileToggle.querySelectorAll('span');
                    spans.forEach(span => span.style.transform = '');
                }
            });
        }
    }

    // Get Hamburger Transform
    static getHamburgerTransform(index) {
        const transforms = [
            'rotate(45deg) translate(5px, 5px)',
            'opacity: 0',
            'rotate(-45deg) translate(7px, -6px)'
        ];
        return transforms[index];
    }

    // Load User Data
    static loadUserData() {
        this.loadRecentActivity();
        this.loadCurrentProjects();
        this.loadFavoritePatterns();
        this.loadUpcomingEvents();
    }

    // Load Recent Activity
    static loadRecentActivity() {
        const activities = [
            {
                icon: '📥',
                title: 'Downloaded "Dresden Delight Quilt"',
                time: '2 hours ago'
            },
            {
                icon: '⭐',
                title: 'Added "Tetris Tumble Quilt" to favorites',
                time: '1 day ago'
            },
            {
                icon: '📝',
                title: 'Updated notes for "Mini Charmer Table Runner"',
                time: '3 days ago'
            },
            {
                icon: '🎯',
                title: 'Completed "Flying Geese Frenzy Quilt"',
                time: '1 week ago'
            }
        ];

        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item fade-in">
                    <div class="activity-icon">${activity.icon}</div>
                    <div class="activity-content">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Load Current Projects
    static loadCurrentProjects() {
        const projects = [
            {
                id: 1,
                name: 'Dresden Delight Quilt',
                image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150216/Dresden-Delight-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg',
                progress: 75,
                started: 'Jan 15, 2024',
                due: 'Feb 1',
                status: 'in-progress'
            },
            {
                id: 2,
                name: 'Mini Charmer Table Runner',
                image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150434/Mini-Charmer-Table-Runner-NQC_TitleCards_16x9_titlecard_notext.jpg',
                progress: 30,
                started: 'Jan 20, 2024',
                due: 'Feb 5',
                status: 'in-progress'
            },
            {
                id: 3,
                name: 'Tetris Tumble Quilt',
                image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150531/Tetris-Tumble-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg',
                progress: 10,
                started: 'Jan 22, 2024',
                due: 'Feb 15',
                status: 'planning'
            }
        ];

        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = projects.map(project => `
                <div class="project-card fade-in">
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.name}">
                        <div class="project-progress">${project.progress}%</div>
                    </div>
                    <div class="project-content">
                        <h3>${project.name}</h3>
                        <p>Started: ${project.started}</p>
                        <div class="project-status">
                            <span class="status-badge ${project.status}">${this.formatStatus(project.status)}</span>
                            <span class="project-due">Due: ${project.due}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Format Status
    static formatStatus(status) {
        const statuses = {
            'in-progress': 'In Progress',
            'planning': 'Planning',
            'completed': 'Completed'
        };
        return statuses[status] || status;
    }

    // Load Favorite Patterns
    static loadFavoritePatterns() {
        const favorites = [
            {
                id: 'tetris-tumble',
                name: 'Tetris Tumble Quilt',
                image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150531/Tetris-Tumble-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg',
                difficulty: 'intermediate'
            },
            {
                id: 'dresden-delight',
                name: 'Dresden Delight Quilt',
                image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150216/Dresden-Delight-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg',
                difficulty: 'intermediate'
            },
            {
                id: 'modern-angle',
                name: 'Modern Angle Quilt',
                image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150439/Modern-Angle-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg',
                difficulty: 'advanced'
            },
            {
                id: 'jelly-roll',
                name: 'Jelly Roll Jumble Quilt',
                image: 'https://d2culxnxbccemt.cloudfront.net/quilt/content/uploads/2022/09/22150358/Jelly-Roll-Jumble-Quilt-NQC_TitleCards_16x9_titlecard_notext.jpg',
                difficulty: 'beginner'
            }
        ];

        const favoritesGrid = document.querySelector('.favorites-grid');
        if (favoritesGrid) {
            favoritesGrid.innerHTML = favorites.map(pattern => `
                <div class="favorite-item fade-in">
                    <img src="${pattern.image}" alt="${pattern.name}">
                    <div class="favorite-info">
                        <h4>${pattern.name}</h4>
                        <span class="difficulty ${pattern.difficulty}">${this.formatDifficulty(pattern.difficulty)}</span>
                    </div>
                    <button class="favorite-btn active" data-pattern="${pattern.id}">⭐</button>
                </div>
            `).join('');

            // Add favorite button handlers
            favoritesGrid.querySelectorAll('.favorite-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.toggleFavorite(btn);
                });
            });
        }
    }

    // Format Difficulty
    static formatDifficulty(difficulty) {
        const difficulties = {
            'beginner': 'Beginner',
            'intermediate': 'Intermediate',
            'advanced': 'Advanced',
            'expert': 'Expert'
        };
        return difficulties[difficulty] || difficulty;
    }

    // Load Upcoming Events
    static loadUpcomingEvents() {
        const events = [
            {
                date: '28',
                month: 'JAN',
                title: 'Virtual Quilt Along',
                description: 'Join our monthly quilt along session',
                time: '2:00 PM - 4:00 PM EST',
                action: 'Join'
            },
            {
                date: '05',
                month: 'FEB',
                title: 'Beginner Workshop',
                description: 'Learn basic quilting techniques',
                time: '10:00 AM - 12:00 PM EST',
                action: 'Register'
            },
            {
                date: '12',
                month: 'FEB',
                title: 'Pattern Release Day',
                description: 'New exclusive patterns for members',
                time: 'All Day',
                action: 'Remind Me'
            }
        ];

        const eventsList = document.querySelector('.events-list');
        if (eventsList) {
            eventsList.innerHTML = events.map(event => `
                <div class="event-item fade-in">
                    <div class="event-date">
                        <div class="date-day">${event.date}</div>
                        <div class="date-month">${event.month}</div>
                    </div>
                    <div class="event-content">
                        <h4>${event.title}</h4>
                        <p>${event.description}</p>
                        <div class="event-time">${event.time}</div>
                    </div>
                    <button class="event-btn" onclick="Dashboard.handleEventAction('${event.action}', '${event.title}')">${event.action}</button>
                </div>
            `).join('');
        }
    }

    // Handle Event Action
    static handleEventAction(action, eventTitle) {
        if (action === 'Join') {
            this.showNotification(`Joined "${eventTitle}" successfully!`, 'success');
        } else if (action === 'Register') {
            this.showNotification(`Registered for "${eventTitle}"!`, 'success');
        } else if (action === 'Remind Me') {
            this.showNotification(`Reminder set for "${eventTitle}"!`, 'success');
        }
    }

    // Toggle Favorite
    static toggleFavorite(btn) {
        const patternId = btn.dataset.pattern;

        if (btn.classList.contains('active')) {
            btn.classList.remove('active');
            Auth.removeFromFavorites(patternId);
            this.showNotification('Removed from favorites', 'info');
        } else {
            btn.classList.add('active');
            Auth.addToFavorites(patternId);
        }
    }

    // Setup Event Listeners
    static setupEventListeners() {
        // Quick action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const action = card.querySelector('h3').textContent;
                this.handleQuickAction(action);
            });
        });

        // Add project button
        const addProjectBtn = document.querySelector('.add-project');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAddProjectModal();
            });
        }

        // View all links
        document.querySelectorAll('.view-all').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Full view would be implemented here', 'info');
            });
        });
    }

    // Handle Quick Action
    static handleQuickAction(action) {
        const actions = {
            'Browse Patterns': () => window.location.href = 'index.html#patterns',
            'Watch Tutorials': () => window.location.href = 'index.html#tutorials',
            'Progress Report': () => this.showProgressReport(),
            'Community': () => this.showNotification('Community features coming soon!', 'info')
        };

        const handler = actions[action];
        if (handler) {
            handler();
        }
    }

    // Show Progress Report
    static showProgressReport() {
        this.showNotification('Progress report feature coming soon!', 'info');
    }

    // Show Add Project Modal
    static showAddProjectModal() {
        this.showNotification('Add project feature coming soon!', 'info');
    }

    // Initialize Charts
    static initializeCharts() {
        // This would initialize charts for progress visualization
        // For now, we'll just add a placeholder
        console.log('Charts would be initialized here');
    }

    // Start Real-time Updates
    static startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateRandomActivity();
        }, 30000); // Every 30 seconds
    }

    // Update Random Activity
    static updateRandomActivity() {
        const activities = [
            'New pattern added to your favorites',
            'Project milestone reached',
            'New tutorial available',
            'Community update posted'
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        console.log('New activity:', randomActivity);
    }

    // Show Notification
    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Export User Data
    static exportUserData() {
        const data = {
            user: this.currentUser,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quilt-patterns-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully!', 'success');
    }

    // Refresh Dashboard
    static refresh() {
        this.loadUserData();
        this.updateStats();
        this.showNotification('Dashboard refreshed!', 'success');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R to refresh dashboard
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        Dashboard.refresh();
    }

    // Ctrl/Cmd + E to export data
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        Dashboard.exportUserData();
    }
});
