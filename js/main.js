// main.js — GeoResilience Hub

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle (Dark/Light Mode)
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        if (savedTheme === 'light') {
            body.classList.remove('dark-mode');
        } else {
            body.classList.add('dark-mode');
        }
    } else {
        // Default is dark mode in our HTML
        localStorage.setItem('theme', 'dark');
    }

    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            // Save preference
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // 2. Simple Counter Animation for Stats (uses data-suffix)
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const suffix = counter.getAttribute('data-suffix') || '';
                const count = +counter.innerText.replace(/[^0-9]/g, '');
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            
            // Only animate if in viewport and hasn't been animated yet
            const rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight && counter.innerText === '0') {
                updateCount();
            }
        });
    };

    // Run on scroll
    window.addEventListener('scroll', animateCounters);
    // Run once on load
    animateCounters();
    
    // 3. Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if(navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = 'var(--shadow-sm)';
                navbar.style.padding = '0.5rem 0';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.padding = '1rem 0';
            }
        });
    }

    // 4. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                // Toggle clicked FAQ
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // 5. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    function openMobileMenu() {
        if (mobileNav) mobileNav.classList.add('open');
        if (mobileOverlay) mobileOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (mobileNav) mobileNav.classList.remove('open');
        if (mobileOverlay) mobileOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

    // Mobile Dropdown Menu Toggle
    const mobileNavToggles = document.querySelectorAll('.mobile-nav-toggle');
    mobileNavToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggle.classList.toggle('active');
            const menuId = toggle.getAttribute('data-menu');
            const submenu = document.getElementById(menuId + '-menu');
            if (submenu) {
                submenu.classList.toggle('active');
            }
        });
    });

    // Lazy Load Images (Mobile Data Optimization)
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }

    // 6. Scroll Reveal (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 7. FORM VALIDATION & EMAIL INTEGRATION
    const contactForm = document.querySelector('form');
    if (contactForm) {
        const formContainer = contactForm.closest('.contact-form-container');
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Validate form fields
            if (!validateContactForm()) {
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = '📤 Sending...';
            
            try {
                // Submit to Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    showFormMessage('✅ Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
                    contactForm.reset();
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                showFormMessage('❌ Error sending message. Please try again or email us directly.', 'error');
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
        
        // Real-time validation on input
        const inputs = contactForm.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('focus', () => clearFieldError(input));
        });
    }

    // Form validation helper functions
    function validateContactForm() {
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const message = document.getElementById('message')?.value.trim();
        const service = document.getElementById('service')?.value;
        
        let isValid = true;
        
        // Name validation
        if (!name || name.length < 2) {
            setFieldError('name', 'Please enter a valid name');
            isValid = false;
        }
        
        // Email validation
        if (!isValidEmail(email)) {
            setFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Service selection
        if (!service) {
            setFieldError('service', 'Please select a service');
            isValid = false;
        }
        
        // Message validation
        if (!message || message.length < 10) {
            setFieldError('message', 'Message must be at least 10 characters long');
            isValid = false;
        }
        
        return isValid;
    }

    function validateField(field) {
        if (!field) return;
        
        const name = field.getAttribute('name');
        const value = field.value.trim();
        
        let error = '';
        
        switch(name) {
            case 'name':
                if (!value || value.length < 2) error = 'Please enter a valid name';
                break;
            case 'email':
                if (!isValidEmail(value)) error = 'Invalid email address';
                break;
            case 'message':
                if (!value || value.length < 10) error = 'Message must be at least 10 characters';
                break;
            case 'service':
                if (!value) error = 'Please select a service';
                break;
        }
        
        if (error) {
            setFieldError(name, error);
        } else {
            clearFieldError(field);
        }
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function setFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('error');
            const errorDiv = field.nextElementSibling;
            if (errorDiv?.classList.contains('error-message')) {
                errorDiv.textContent = message;
            } else {
                const newError = document.createElement('div');
                newError.className = 'error-message';
                newError.textContent = message;
                field.parentNode.insertBefore(newError, field.nextSibling);
            }
        }
    }

    function clearFieldError(field) {
        if (field) {
            field.classList.remove('error');
            const errorDiv = field.parentNode?.querySelector('.error-message');
            if (errorDiv) errorDiv.remove();
        }
    }

    function showFormMessage(message, type) {
        const form = document.querySelector('form');
        if (!form) return;
        
        // Remove old message
        const oldMsg = form.parentNode?.querySelector('.form-message');
        if (oldMsg) oldMsg.remove();
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `form-message form-message-${type}`;
        msgDiv.textContent = message;
        form.parentNode.insertBefore(msgDiv, form);
        
        // Auto-remove success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => msgDiv.remove(), 5000);
        }
    }
});
