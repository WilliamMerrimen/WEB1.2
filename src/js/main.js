// ===== MOBILE NAVIGATION =====
class Navigation {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav__link');
        
        this.init();
    }
    
    init() {
        // Toggle mobile menu
        this.navToggle?.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav')) {
                this.closeMenu();
            }
        });
        
        // Handle scroll events
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    toggleMenu() {
        this.navMenu?.classList.toggle('active');
        this.navToggle?.classList.toggle('active');
    }
    
    closeMenu() {
        this.navMenu?.classList.remove('active');
        this.navToggle?.classList.remove('active');
    }
    
    handleScroll() {
        const header = document.getElementById('header');
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Handle navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== ANIMATIONS =====
class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        // Create intersection observer for fade-in animations
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.observerOptions
        );
        
        // Observe elements for animation
        this.observeElements();
    }
    
    observeElements() {
        const elementsToAnimate = document.querySelectorAll(`
            .skill-card,
            .contact__item,
            .about__content
        `);
        
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ===== FORM HANDLING =====
class FormHandler {
    constructor() {
        this.init();
    }
    
    init() {
        // Handle contact form if it exists
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Simple form validation and handling
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        console.log('Form submitted:', data);
        
        // Here you would typically send data to a server
        this.showSuccess();
    }
    
    showSuccess() {
        // Show success message
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'Спасибо за сообщение! Я свяжусь с вами в ближайшее время.';
        
        // Style the message
        Object.assign(message.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#10b981',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(message);
        
        // Animate in
        setTimeout(() => {
            message.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            message.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 5000);
    }
}

// ===== UTILITY FUNCTIONS =====
class Utils {
    static debounce(func, wait) {
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
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ===== PERFORMANCE MONITORING =====
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const navigation = performance.getEntriesByType('navigation')[0];
                console.log(`Page loaded in ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
            }
        });
        
        // Monitor Core Web Vitals if supported
        if ('web-vital' in window) {
            this.measureWebVitals();
        }
    }
    
    measureWebVitals() {
        // This would integrate with web-vitals library if available
        // For now, just a placeholder for future implementation
        console.log('Web Vitals monitoring initialized');
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        // Add keyboard navigation support
        this.enhanceKeyboardNavigation();
        
        // Add focus indicators
        this.enhanceFocusIndicators();
        
        // Add screen reader improvements
        this.enhanceScreenReader();
    }
    
    enhanceKeyboardNavigation() {
        // Allow keyboard navigation for mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const nav = new Navigation();
                nav.closeMenu();
            }
        });
        
        // Add skip to content link
        this.addSkipLink();
    }
    
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Перейти к основному содержанию';
        skipLink.className = 'skip-link';
        
        // Style skip link
        Object.assign(skipLink.style, {
            position: 'absolute',
            top: '-40px',
            left: '6px',
            background: 'var(--primary-color)',
            color: 'white',
            padding: '8px',
            textDecoration: 'none',
            borderRadius: '4px',
            zIndex: '10000',
            transition: 'top 0.3s'
        });
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    enhanceFocusIndicators() {
        // Add custom focus styles for better visibility
        const style = document.createElement('style');
        style.textContent = `
            .nav__link:focus,
            .btn:focus,
            .contact__item a:focus {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
    
    enhanceScreenReader() {
        // Add aria-labels where needed
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            navToggle.setAttribute('aria-label', 'Переключить навигационное меню');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Update aria-expanded when menu toggles
        const originalToggle = Navigation.prototype.toggleMenu;
        Navigation.prototype.toggleMenu = function() {
            originalToggle.call(this);
            const expanded = this.navMenu?.classList.contains('active');
            this.navToggle?.setAttribute('aria-expanded', expanded.toString());
        };
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio initialized');
    
    // Initialize all components
    new Navigation();
    new SmoothScroll();
    new AnimationController();
    new FormHandler();
    new PerformanceMonitor();
    new AccessibilityEnhancer();
    
    // Add some interactive easter eggs
    console.log(`
    ███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
    ██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
    ███████╗█████╔╝ ██║██║     ██║     ███████╗
    ╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
    ███████║██║  ██╗██║███████╗███████╗███████║
    ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝
    
    👨‍💻 Добро пожаловать в мое портфолио!
    🐳 Этот сайт работает в Docker контейнере
    ⚡ Все компоненты загружены и готовы к работе
    `);
});