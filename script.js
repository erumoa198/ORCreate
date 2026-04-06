// OR Create - Modern HP JavaScript 2025
// Dark Mode + 3D Creative Style

document.addEventListener('DOMContentLoaded', () => {
    // ========== Header Scroll Effect ==========
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ========== Mobile Menu Toggle ==========
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when clicking on a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    }

    // ========== Smooth Scroll ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== Intersection Observer for Fade-in Animations ==========
    const fadeElements = document.querySelectorAll(
        '.service-card-modern, .team-preview-card, .stat-card-modern, ' +
        '.coverflow-item, .philosophy-card, .workflow-step, .album-card, ' +
        '.genre-section, .member-detail-card, .story-visual-card'
    );

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    // ========== Section Headers Animation ==========
    const sectionHeaders = document.querySelectorAll('.section-header-modern, .genre-header');

    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                headerObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    sectionHeaders.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        headerObserver.observe(el);
    });

    // ========== Stats Counter Animation ==========
    const statElements = document.querySelectorAll('.stat-number-modern[data-target]');

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current >= target) {
                el.textContent = target.toLocaleString();
            } else {
                el.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statElements.forEach(el => statsObserver.observe(el));

    // ========== 3D Card Tilt Effect ==========
    const tiltCards = document.querySelectorAll('.service-card-modern, .visual-item-ultra');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ========== Hero Visual 3D Effect ==========
    const heroVisual = document.querySelector('.visual-grid-ultra');

    if (heroVisual) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 50;
            const y = (window.innerHeight / 2 - e.clientY) / 50;

            heroVisual.style.transform = `rotateY(${x * -1}deg) rotateX(${y}deg)`;
        });
    }

    // ========== Scroll to Top Button ==========
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

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

        const getItemWidth = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 480) return 256;
            if (screenWidth <= 768) return 256;
            return 296; // 280px + 16px gap
        };

        let currentIndex = 0;
        let isTransitioning = false;
        let itemWidth = getItemWidth();

        // Clone items for infinite loop
        items.forEach(item => {
            const clone = item.cloneNode(true);
            coverflowContainer.appendChild(clone);
        });

        const updatePosition = (smooth = true) => {
            coverflowContainer.style.transition = smooth
                ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                : 'none';
            isTransitioning = smooth;
            coverflowContainer.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        };

        coverflowContainer.addEventListener('transitionend', () => {
            isTransitioning = false;
            if (currentIndex >= totalItems) {
                currentIndex = 0;
                updatePosition(false);
            } else if (currentIndex < 0) {
                currentIndex = totalItems - 1;
                updatePosition(false);
            }
        });

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

        // Pause on hover
        const wrapper = document.querySelector('.coverflow-wrapper');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
            wrapper.addEventListener('mouseleave', () => {
                autoScrollInterval = setInterval(() => {
                    if (!isTransitioning) {
                        currentIndex++;
                        updatePosition(true);
                    }
                }, 5000);
            });
        }

        // Touch support
        let touchStartX = 0;
        coverflowContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        coverflowContainer.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50 && !isTransitioning) {
                if (diff > 0) {
                    currentIndex++;
                    updatePosition(true);
                } else {
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

        updatePosition(false);

        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                itemWidth = getItemWidth();
                updatePosition(false);
            }, 250);
        });
    }

    // ========== Magnetic Buttons ==========
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-primary-modern, .btn-primary-ultra, .nav-cta');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ========== Glow Effect on Mouse Move ==========
    const glowElements = document.querySelectorAll('.service-card-modern, .team-preview-card, .stat-card-modern');

    glowElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            el.style.setProperty('--mouse-x', `${x}px`);
            el.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ========== Form Enhancement ==========
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');

    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    // ========== Smooth Page Transitions ==========
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

    // Set initial opacity
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // ========== Console Log ==========
    console.log('%c OR Create ', 'background: linear-gradient(135deg, #22c55e, #10b981); color: white; font-size: 20px; padding: 10px 20px; border-radius: 10px; font-weight: bold;');
    console.log('%c Modern HP 2025 - Dark Mode + 3D Creative ', 'color: #22c55e; font-size: 12px;');

    // ========== Particle Canvas Animation ==========
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.hue = Math.random() > 0.5 ? 145 : 160; // Green or Emerald
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around screen
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;

                // Subtle opacity pulse
                this.opacity += (Math.random() - 0.5) * 0.02;
                this.opacity = Math.max(0.05, Math.min(0.6, this.opacity));
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        const particleCount = Math.min(100, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Draw connections between nearby particles
        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        const opacity = (1 - distance / 150) * 0.15;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            drawConnections();

            animationId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            cancelAnimationFrame(animationId);
        });
    }

    // ========== Sidebar Menu ==========
    const curveMenu = document.getElementById('curveMenu');
    const hamburgerCurve = document.querySelector('.hamburger-curve');

    if (curveMenu && hamburgerCurve) {
        let isMenuOpen = false;

        // ハンバーガーメニュークリック
        hamburgerCurve.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            curveMenu.classList.toggle('open', isMenuOpen);
        });

        // メニューリンククリックでメニューを閉じる
        const menuLinks = document.querySelectorAll('.menu-inner-curve a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                curveMenu.classList.remove('open');
            });
        });

        // メニュー外クリックで閉じる
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !curveMenu.contains(e.target)) {
                isMenuOpen = false;
                curveMenu.classList.remove('open');
            }
        });
    }

    // ヘッダーのスクロール効果（ミニマルヘッダー用）
    const headerMinimal = document.querySelector('.header-minimal');
    if (headerMinimal) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                headerMinimal.classList.add('scrolled');
            } else {
                headerMinimal.classList.remove('scrolled');
            }
        });
    }

    // ========== Services Center-Mode Slider ==========
    const servicesSlider = document.querySelector('.services-slider');
    const servicesTrack = document.getElementById('servicesTrack');
    const serviceSlides = document.querySelectorAll('.service-slide');
    const servicesPrev = document.getElementById('servicesPrev');
    const servicesNext = document.getElementById('servicesNext');
    const servicesDots = document.getElementById('servicesDots');

    if (servicesTrack && serviceSlides.length > 0) {
        let activeIndex = 0;
        const totalSlides = serviceSlides.length;

        // アクティブスライドを設定
        const setActiveSlide = (index) => {
            // 範囲チェック
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;

            activeIndex = index;

            // 全スライドからactiveを削除
            serviceSlides.forEach((slide, i) => {
                slide.removeAttribute('active');
                slide.setAttribute('aria-hidden', 'true');
            });

            // 新しいアクティブスライドを設定
            serviceSlides[activeIndex].setAttribute('active', '');
            serviceSlides[activeIndex].setAttribute('aria-hidden', 'false');

            // ドット更新
            updateDots();
        };

        // ドットナビゲーション作成
        const createDots = () => {
            if (!servicesDots) return;
            servicesDots.innerHTML = '';

            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = 'services-dot';
                dot.setAttribute('aria-label', `スライド ${i + 1}`);
                if (i === activeIndex) dot.classList.add('active');

                dot.addEventListener('click', () => setActiveSlide(i));
                servicesDots.appendChild(dot);
            }
        };

        // ドット更新
        const updateDots = () => {
            if (!servicesDots) return;
            const dots = servicesDots.querySelectorAll('.services-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        };

        // スライドクリックでアクティブ化
        serviceSlides.forEach((slide, index) => {
            slide.addEventListener('click', () => {
                if (index !== activeIndex) {
                    setActiveSlide(index);
                }
            });

            // ホバーでもアクティブ化（デスクトップ）
            slide.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768 && index !== activeIndex) {
                    setActiveSlide(index);
                }
            });
        });

        // Prev/Nextボタン
        if (servicesPrev) {
            servicesPrev.addEventListener('click', () => {
                setActiveSlide(activeIndex - 1);
            });
        }

        if (servicesNext) {
            servicesNext.addEventListener('click', () => {
                setActiveSlide(activeIndex + 1);
            });
        }

        // キーボードナビゲーション
        servicesTrack.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setActiveSlide(activeIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setActiveSlide(activeIndex + 1);
            }
        });

        // タッチスワイプ対応
        let touchStartX = 0;
        let touchEndX = 0;

        servicesTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        servicesTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // 左スワイプ → 次へ
                    setActiveSlide(activeIndex + 1);
                } else {
                    // 右スワイプ → 前へ
                    setActiveSlide(activeIndex - 1);
                }
            }
        }, { passive: true });

        // 自動スライド（オプション - 5秒ごと）
        let autoSlideInterval = null;
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                setActiveSlide(activeIndex + 1);
            }, 6000);
        };

        const stopAutoSlide = () => {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        };

        // ホバー時は自動スライド停止
        if (servicesSlider) {
            servicesSlider.addEventListener('mouseenter', stopAutoSlide);
            servicesSlider.addEventListener('mouseleave', startAutoSlide);
        }

        // 初期化
        createDots();
        setActiveSlide(0);
        startAutoSlide();
    }

    // ========== Works Swiper Slider ==========
    if (typeof Swiper !== 'undefined') {
        const worksSwiper = new Swiper('.works-swiper', {
            grabCursor: true,
            initialSlide: 2,
            centeredSlides: true,
            slidesPerView: 'auto',
            spaceBetween: 15,
            speed: 800,
            freeMode: false,
            mousewheel: {
                thresholdDelta: 30,
            },
            pagination: {
                el: '.works-swiper .swiper-pagination',
                clickable: true,
            },
            on: {
                click(event) {
                    const clickedSlide = this.clickedSlide;
                    if (clickedSlide) {
                        // YouTube動画の場合
                        const youtubeId = clickedSlide.dataset.youtube;
                        if (youtubeId && this.clickedIndex === this.activeIndex) {
                            // youtube-modal.jsのopenYoutubeModal関数を呼び出す
                            if (typeof openYoutubeModal === 'function') {
                                openYoutubeModal(youtubeId);
                            } else {
                                window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
                            }
                            return;
                        }
                        // 外部リンクの場合
                        const link = clickedSlide.dataset.link;
                        if (link && this.clickedIndex === this.activeIndex) {
                            window.open(link, '_blank');
                            return;
                        }
                        // それ以外はスライド移動
                        this.slideTo(this.clickedIndex);
                    }
                },
            },
        });
    }

    // ========== Scroll Reveal Animation ==========
    const revealElements = document.querySelectorAll(
        '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-stagger, .section-header-reveal, .card-reveal'
    );

    if (revealElements.length > 0) {
        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            const revealPoint = 120; // 画面下から120pxの位置で発火

            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;

                if (elementTop < windowHeight - revealPoint) {
                    element.classList.add('active');
                }
            });
        };

        // 初回チェック
        revealOnScroll();

        // スクロール時にチェック（throttle付き）
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;

            scrollTimeout = setTimeout(() => {
                revealOnScroll();
                scrollTimeout = null;
            }, 15);
        }, { passive: true });
    }
});
