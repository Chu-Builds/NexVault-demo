document.addEventListener('DOMContentLoaded', () => {
    // Cursor glow follow
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    }

    // 1. Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile hamburger
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Stats counter animation
    const stats = document.querySelectorAll('.stat-value');
    let hasAnimated = false;

    const animateStats = () => {
        stats.forEach(stat => {
            const targetStr = stat.getAttribute('data-target');
            if (!targetStr) return;
            
            const target = parseFloat(targetStr);
            const prefix = stat.getAttribute('data-prefix') || '';
            const suffix = stat.getAttribute('data-suffix') || '';
            const isFloat = targetStr.includes('.');
            const decimals = isFloat ? targetStr.split('.')[1].length : 0;
            const useSeparator = stat.hasAttribute('data-separator');
            
            const duration = 2000;
            const steps = 60;
            const stepValue = target / steps;
            let current = 0;
            
            const updateCounter = setInterval(() => {
                current += stepValue;
                if (current >= target) {
                    current = target;
                    clearInterval(updateCounter);
                    
                    // Live APY logic
                    if (stat.classList.contains('apy-value')) {
                        const pulseDot = stat.parentElement.querySelector('.pulse-dot');
                        if (pulseDot) pulseDot.classList.add('live');
                        
                        setInterval(() => {
                            const randomAPY = (Math.random() * (23.9 - 23.1) + 23.1).toFixed(1);
                            stat.style.opacity = '0.5';
                            
                            setTimeout(() => {
                                stat.textContent = prefix + randomAPY + suffix;
                                stat.style.opacity = '1';
                            }, 300);
                        }, Math.random() * 2000 + 3000); // 3-5 seconds
                    }
                }
                
                let displayValue = current.toFixed(decimals);
                if (useSeparator) {
                    displayValue = Math.floor(current).toLocaleString();
                }
                
                stat.textContent = prefix + displayValue + suffix;
            }, duration / steps);
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStats();
            }
        });
    }, { threshold: 0.1 });
    
    const statsContainer = document.getElementById('stats');
    if (statsContainer) statsObserver.observe(statsContainer);

    // 4. FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                });
                
                // Open clicked if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // Tokenomics Chart
    const ctx = document.getElementById('tokenomicsChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Community Rewards', 'Treasury', 'Team & Advisors', 'Liquidity', 'Ecosystem Grants'],
                datasets: [{
                    data: [40, 20, 15, 15, 10],
                    backgroundColor: [
                        '#10B981', // Emerald
                        '#F59E0B', // Amber
                        '#34D399',
                        '#6EE7B7',
                        '#065F46'
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.parsed}%`;
                            }
                        },
                        backgroundColor: 'rgba(3, 13, 7, 0.9)',
                        titleColor: '#F1F5F0',
                        bodyColor: '#10B981',
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                        borderWidth: 1
                    }
                }
            }
        });
    }
});
