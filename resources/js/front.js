/**
 * Front-end JavaScript - Marketing pages (Alpine.js)
 * Lightweight entry point separate from React/Inertia admin
 */

import Alpine from 'alpinejs';

// Dark mode component with system detection
Alpine.data('darkMode', () => ({
    isDark: document.documentElement.classList.contains('dark'),

    init() {
        // Watch for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.isDark = e.matches;
                this.applyTheme();
            }
        });
    },

    toggle() {
        this.isDark = !this.isDark;
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
        this.applyTheme();
    },

    applyTheme() {
        document.documentElement.classList.toggle('dark', this.isDark);
    },
}));

// Navbar component with scroll effect and mobile menu
Alpine.data('navbar', () => ({
    mobileMenuOpen: false,
    scrolled: false,

    init() {
        this.checkScroll();
        window.addEventListener('scroll', () => this.checkScroll(), { passive: true });
    },

    checkScroll() {
        this.scrolled = window.scrollY > 20;
    },

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    },

    closeMobileMenu() {
        this.mobileMenuOpen = false;
        document.body.style.overflow = '';
    },
}));

// Scroll reveal animation using Intersection Observer
Alpine.data('scrollReveal', () => ({
    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            },
        );

        // Observe all elements with the 'reveal' class within this component
        this.$el.querySelectorAll('.reveal').forEach((el) => {
            observer.observe(el);
        });
    },
}));

// Accordion component for FAQ
Alpine.data('accordion', () => ({
    activeIndex: null,

    toggle(index) {
        this.activeIndex = this.activeIndex === index ? null : index;
    },

    isOpen(index) {
        return this.activeIndex === index;
    },
}));

// Animated counter component
Alpine.data('counter', (target, duration = 2000) => ({
    current: 0,
    target: target,

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    this.animateCount();
                    observer.disconnect();
                }
            },
            { threshold: 0.5 },
        );
        observer.observe(this.$el);
    },

    animateCount() {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            this.current = Math.round(easeOut * this.target);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    },
}));

// Initialize Alpine
Alpine.start();
