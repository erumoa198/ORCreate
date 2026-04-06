/* ========================================
   Works App - JavaScript
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ========== Swiper初期化 ==========
    const worksAppSwiper = new Swiper('.works-app-swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        loop: true,
        speed: 600,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: 10,
            stretch: 100,
            depth: 200,
            modifier: 1,
            slideShadows: false,
        },
        pagination: {
            el: '.works-app-swiper .swiper-pagination',
            clickable: true,
        },
        on: {
            click(event) {
                const clickedSlide = this.clickedSlide;
                if (clickedSlide && this.clickedIndex === this.activeIndex) {
                    const youtubeId = clickedSlide.dataset.youtube;
                    if (youtubeId) {
                        if (typeof openYoutubeModal === 'function') {
                            openYoutubeModal(youtubeId);
                        } else {
                            window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
                        }
                    }
                } else if (clickedSlide) {
                    this.slideTo(this.clickedIndex);
                }
            },
        },
    });

    // ========== ナビゲーション ==========
    const navItems = document.querySelectorAll('.works-app-nav .nav-item, .works-app-nav-bottom .nav-item');
    navItems.forEach(navItem => {
        navItem.addEventListener('click', (e) => {
            // activeクラスの切り替え（ページ遷移前の視覚的フィードバック）
            navItems.forEach(item => item.classList.remove('active'));
            navItem.classList.add('active');
        });
    });

    // ========== ドラッグスクロール ==========
    const containers = document.querySelectorAll('.containers');
    containers.forEach(container => {
        let isDragging = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const step = (x - startX) * 0.8;
            container.scrollLeft = scrollLeft - step;
        });

        container.addEventListener('mouseup', () => {
            isDragging = false;
            container.style.cursor = 'grab';
        });

        container.addEventListener('mouseleave', () => {
            isDragging = false;
            container.style.cursor = 'grab';
        });
    });

    // ========== サイドバートグル ==========
    const sidebarToggle = document.getElementById('sidebarToggle');
    const worksSidebar = document.getElementById('worksSidebar');
    const worksContent = document.querySelector('.works-app-content');

    if (sidebarToggle && worksSidebar) {
        sidebarToggle.addEventListener('click', () => {
            worksSidebar.classList.toggle('closed');
            worksContent.classList.toggle('sidebar-closed');
        });
    }

    // ========== Pick Up 詳細表示 ==========
    const pickupSection = document.getElementById('pickupSection');
    const pickupDetail = document.getElementById('pickupDetail');
    const pickupDetailClose = document.getElementById('pickupDetailClose');
    const pickupDetailBg = document.getElementById('pickupDetailBg');
    const pickupDetailImage = document.querySelector('#pickupDetailImage img');
    const pickupDetailCategory = document.getElementById('pickupDetailCategory');
    const pickupDetailTitle = document.getElementById('pickupDetailTitle');
    const pickupDetailArtist = document.getElementById('pickupDetailArtist');
    const pickupDetailDesc = document.getElementById('pickupDetailDesc');
    const pickupDetailBtn = document.getElementById('pickupDetailBtn');

    // 詳細表示を開く関数
    function showPickupDetail(data) {
        if (!pickupSection || !pickupDetail) return;

        // 背景画像を設定
        if (pickupDetailBg) {
            pickupDetailBg.style.backgroundImage = `url(${data.img})`;
        }
        // メイン画像
        if (pickupDetailImage) {
            pickupDetailImage.src = data.img;
            pickupDetailImage.alt = data.title;
        }
        // カテゴリ
        if (pickupDetailCategory) {
            pickupDetailCategory.textContent = data.category || 'Works';
        }
        // タイトル
        if (pickupDetailTitle) {
            pickupDetailTitle.textContent = data.title || '';
        }
        // アーティスト
        if (pickupDetailArtist) {
            pickupDetailArtist.textContent = data.artist || '';
        }
        // 説明
        if (pickupDetailDesc) {
            pickupDetailDesc.textContent = data.desc || '';
        }
        // ボタン（リンクがある場合のみ表示）
        if (pickupDetailBtn) {
            if (data.youtube) {
                pickupDetailBtn.style.display = 'inline-flex';
                pickupDetailBtn.href = `https://www.youtube.com/watch?v=${data.youtube}`;
                pickupDetailBtn.innerHTML = '<i class="fa-solid fa-play"></i> Watch Now';
                pickupDetailBtn.onclick = (e) => {
                    e.preventDefault();
                    if (typeof openYoutubeModal === 'function') {
                        openYoutubeModal(data.youtube);
                    } else {
                        window.open(`https://www.youtube.com/watch?v=${data.youtube}`, '_blank');
                    }
                };
            } else if (data.link) {
                pickupDetailBtn.style.display = 'inline-flex';
                pickupDetailBtn.href = data.link;
                pickupDetailBtn.innerHTML = '<i class="fa-solid fa-external-link-alt"></i> View Details';
                pickupDetailBtn.onclick = null;
            } else {
                // リンクがない場合はボタンを非表示
                pickupDetailBtn.style.display = 'none';
            }
        }

        // 詳細表示をアクティブに
        pickupSection.classList.add('detail-active');

        // スクロールを上部に
        const leftContent = document.querySelector('.works-app-left');
        if (leftContent) {
            leftContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // 詳細表示を閉じる
    if (pickupDetailClose) {
        pickupDetailClose.addEventListener('click', () => {
            if (pickupSection) {
                pickupSection.classList.remove('detail-active');
            }
        });
    }

    // ========== カテゴリアイテムクリック ==========
    const categoryItems = document.querySelectorAll('.works-category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const data = {
                youtube: item.dataset.youtube,
                title: item.dataset.title,
                artist: item.dataset.artist,
                category: item.dataset.category,
                desc: item.dataset.desc,
                img: item.dataset.img,
                link: item.dataset.link
            };

            // 詳細表示を開く
            showPickupDetail(data);
        });
    });

    // ========== Now Playing セレクター機能 ==========
    const songItems = document.querySelectorAll('.works-song-item');
    const nowPlayingImg = document.getElementById('nowPlayingImg');
    const nowPlayingBg = document.getElementById('nowPlayingBg');
    const nowPlayingTitle = document.getElementById('nowPlayingTitle');
    const nowPlayingArtist = document.getElementById('nowPlayingArtist');
    const nowPlayingBtn = document.getElementById('nowPlayingBtn');

    // セレクター選択時の処理
    songItems.forEach(item => {
        item.addEventListener('click', () => {
            // アクティブ状態の更新
            songItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // データ取得
            const title = item.dataset.title;
            const artist = item.dataset.artist;
            const img = item.dataset.img;
            const youtubeId = item.dataset.youtube;
            const link = item.dataset.link;
            const category = item.dataset.category;
            const desc = item.dataset.desc;

            // Now Playing エリアの更新
            if (nowPlayingImg) {
                nowPlayingImg.src = img;
                nowPlayingImg.alt = artist;
            }
            if (nowPlayingBg) {
                nowPlayingBg.src = img;
            }
            if (nowPlayingTitle) {
                nowPlayingTitle.textContent = title;
            }
            if (nowPlayingArtist) {
                nowPlayingArtist.textContent = artist;
            }
            if (nowPlayingBtn) {
                // ボタンのデータとテキストを更新
                if (youtubeId) {
                    nowPlayingBtn.dataset.youtube = youtubeId;
                    nowPlayingBtn.dataset.link = '';
                    nowPlayingBtn.innerHTML = '<i class="fa-solid fa-play"></i> Watch Now';
                } else if (link) {
                    nowPlayingBtn.dataset.youtube = '';
                    nowPlayingBtn.dataset.link = link;
                    nowPlayingBtn.innerHTML = '<i class="fa-solid fa-external-link-alt"></i> View Details';
                }
            }

            // Pick Up 詳細表示も更新
            showPickupDetail({
                youtube: youtubeId,
                title: title,
                artist: artist,
                category: category,
                desc: desc,
                img: img,
                link: link
            });
        });
    });

    // Now Playing ボタンクリック
    if (nowPlayingBtn) {
        nowPlayingBtn.addEventListener('click', () => {
            const youtubeId = nowPlayingBtn.dataset.youtube;
            const link = nowPlayingBtn.dataset.link;

            if (youtubeId) {
                if (typeof openYoutubeModal === 'function') {
                    openYoutubeModal(youtubeId);
                } else {
                    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
                }
            } else if (link) {
                window.open(link, '_blank');
            }
        });
    }

    // ========== スライダーボタンクリック ==========
    const slideButtons = document.querySelectorAll('.works-app-swiper .slide-overlay button');
    slideButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const slide = button.closest('.swiper-slide');
            if (slide) {
                const youtubeId = slide.dataset.youtube;
                if (youtubeId) {
                    if (typeof openYoutubeModal === 'function') {
                        openYoutubeModal(youtubeId);
                    } else {
                        window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
                    }
                }
            }
        });
    });

    // ========== アルバムカードホバーエフェクト ==========
    const albums = document.querySelectorAll('.works-album');
    albums.forEach(album => {
        album.addEventListener('mouseenter', () => {
            const img = album.querySelector('.works-album-frame img');
            if (img) {
                img.style.transform = 'scale(1.1) rotate(2deg)';
            }
        });

        album.addEventListener('mouseleave', () => {
            const img = album.querySelector('.works-album-frame img');
            if (img) {
                img.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // ========== スクロールアニメーション ==========
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

    // アニメーション対象要素
    const animateElements = document.querySelectorAll(
        '.works-slider-container, .works-category-section, .works-albums-section, .works-song-selector, .works-beauty-section'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 初期表示時のアニメーション（少し遅延させて順番に表示）
    setTimeout(() => {
        animateElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }, 200);
});
