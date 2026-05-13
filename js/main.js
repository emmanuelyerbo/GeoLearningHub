// main.js

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

    // 2. Simple Counter Animation for Stats
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target + (target === 50 || target === 10 || target === 30 ? '+' : '');
                }
            };
            
            // Only animate if in viewport (simple check)
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
});
