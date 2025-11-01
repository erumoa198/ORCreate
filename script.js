// OR Create - Modern HP JavaScript 2025

// ========== Header Scroll Effect ==========
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ========== Smooth Scroll ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== Intersection Observer for Animations ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.querySelectorAll('.section, .card, .work-item, .stat, .team-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    observer.observe(el);
});

// ========== Mobile Menu Toggle ==========
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// ========== Form Submission ==========
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Here you would typically send the data to your backend
        console.log('Form submitted:', data);

        // Show success message
        alert('お問い合わせありがとうございます。\n後ほど担当者よりご連絡させていただきます。');

        // Reset form
        contactForm.reset();
    });
}

// ========== Cursor Effect (Optional - Modern Touch) ==========
if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    // Scale cursor on interactive elements
    document.querySelectorAll('a, button, .work-item, .card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// ========== Stats Counter Animation ==========
const animateCounter = (el, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target + (el.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current) + (el.textContent.includes('+') ? '+' : '');
        }
    }, 20);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const value = entry.target.textContent.replace('+', '').replace('年', '');
            const target = value.includes('万') ? 10000 : parseInt(value);
            animateCounter(entry.target, target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-value').forEach(el => {
    statsObserver.observe(el);
});

// ========== Feature Stats Counter Animation ==========
const featureStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.dataset.target);
            let current = 0;
            const increment = target / 60; // 60 frames for smooth animation
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    entry.target.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    entry.target.textContent = Math.floor(current).toLocaleString();
                }
            }, 25);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
    featureStatsObserver.observe(el);
});

// Modern stats counter
document.querySelectorAll('.stat-number-modern').forEach(el => {
    featureStatsObserver.observe(el);
});

// ========== Parallax Effect for Hero and Background ==========
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Hero image parallax
    const hero = document.querySelector('.hero-img');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }

    // Background layers parallax
    const layer1 = document.querySelector('.layer-1');
    const layer2 = document.querySelector('.layer-2');
    const layer3 = document.querySelector('.layer-3');

    if (layer1) layer1.style.transform = `translateY(${scrolled * 0.1}px)`;
    if (layer2) layer2.style.transform = `translateY(${scrolled * 0.15}px)`;
    if (layer3) layer3.style.transform = `translateY(${scrolled * 0.2}px)`;
});

// ========== Add Loading Effect ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ========== Scroll to Top Button ==========
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== Cover Flow Carousel ==========
const coverflowContainer = document.querySelector('.coverflow-track');
const prevBtn = document.querySelector('.coverflow-prev');
const nextBtn = document.querySelector('.coverflow-next');

if (coverflowContainer && prevBtn && nextBtn) {
    const items = Array.from(document.querySelectorAll('.coverflow-item'));
    const totalItems = items.length;

    // Calculate item width based on screen size
    const getItemWidth = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 480) {
            return 260 + 16; // 260px item + 1rem gap (16px)
        } else if (screenWidth <= 768) {
            return 280 + 16; // 280px item + 1rem gap (16px)
        } else {
            return 260 + 24; // 260px item + 1.5rem gap (24px)
        }
    };

    let currentIndex = 0;
    let isTransitioning = false;
    let itemWidth = getItemWidth();

    // Clone all items and append to create seamless loop
    items.forEach(item => {
        const clone = item.cloneNode(true);
        coverflowContainer.appendChild(clone);
    });

    const updatePosition = (smooth = true) => {
        if (smooth) {
            coverflowContainer.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            isTransitioning = true;
        } else {
            coverflowContainer.style.transition = 'none';
            isTransitioning = false;
        }
        coverflowContainer.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    };

    const handleTransitionEnd = () => {
        isTransitioning = false;
        // Loop back to start when reaching cloned items
        if (currentIndex >= totalItems) {
            currentIndex = 0;
            updatePosition(false);
        } else if (currentIndex < 0) {
            currentIndex = totalItems - 1;
            updatePosition(false);
        }
    };

    coverflowContainer.addEventListener('transitionend', handleTransitionEnd);

    prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = totalItems - 1;
            updatePosition(false);
            setTimeout(() => {
                currentIndex--;
                updatePosition(true);
            }, 20);
        } else {
            updatePosition(true);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        currentIndex++;
        updatePosition(true);
    });

    // Auto-scroll
    let autoScrollInterval = setInterval(() => {
        if (!isTransitioning) {
            currentIndex++;
            updatePosition(true);
        }
    }, 5000);

    // Pause auto-scroll on hover
    const wrapper = document.querySelector('.coverflow-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });

        wrapper.addEventListener('mouseleave', () => {
            autoScrollInterval = setInterval(() => {
                if (!isTransitioning) {
                    currentIndex++;
                    updatePosition(true);
                }
            }, 5000);
        });
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    coverflowContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    coverflowContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50 && !isTransitioning) {
            if (diff > 0) {
                // Swipe left - next
                currentIndex++;
                updatePosition(true);
            } else {
                // Swipe right - prev
                currentIndex--;
                if (currentIndex < 0) {
                    currentIndex = totalItems - 1;
                    updatePosition(false);
                    setTimeout(() => {
                        currentIndex--;
                        updatePosition(true);
                    }, 20);
                } else {
                    updatePosition(true);
                }
            }
        }
    });

    // Set initial position
    updatePosition(false);

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            itemWidth = getItemWidth();
            updatePosition(false);
        }, 250);
    });
}

// ========== Particles Effect ==========
const particlesContainer = document.getElementById('particles');

if (particlesContainer) {
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random position
        const startX = Math.random() * window.innerWidth;
        particle.style.left = startX + 'px';
        particle.style.bottom = '0';

        // Random size
        const size = Math.random() * 3 + 2; // 2-5px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Random color (mix of primary colors)
        const colors = [
            'rgba(166, 255, 0, 0.4)',    // primary green
            'rgba(102, 126, 234, 0.3)',  // purple
            'rgba(240, 147, 251, 0.3)',  // pink
            'rgba(79, 172, 254, 0.3)'    // blue
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        // Random animation duration
        const duration = Math.random() * 15 + 15; // 15-30 seconds
        particle.style.animationDuration = duration + 's';

        // Random delay
        const delay = Math.random() * 5;
        particle.style.animationDelay = delay + 's';

        particlesContainer.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, (duration + delay) * 1000);
    };

    // Create initial particles
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createParticle();
        }, i * 200);
    }

    // Continuously create new particles
    setInterval(createParticle, 1000);
}

console.log('OR Create - Modern HP 2025 Loaded ✨');
