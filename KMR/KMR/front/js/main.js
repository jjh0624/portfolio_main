$(function(){
    $('.counter').counterUp();

    const swiperInstances = {};

    function initBusinessSwiper(targetId) {
        const $pane = $(targetId);
        const $swiperEl = $pane.find('.business-swiper');
        const $controls = $pane.find('.swiper-controls');

        const existing = swiperInstances[targetId];

        if (existing) {
            // 👉 슬라이드를 첫 번째 위치로 보내고 autoplay 재시작
            if (existing.params.loop) {
                existing.slideToLoop(0, 0); // loop 슬라이드일 경우 진짜 첫 번째로
            } else {
                existing.slideTo(0, 0);
            }

            if (existing.autoplay) {
                existing.autoplay.stop();
                setTimeout(() => {
                    existing.autoplay.start();
                }, 100);
            }
            return;
        }

        const swiper = new Swiper($swiperEl[0], {
            slidesPerView: 'auto',
            spaceBetween: 12,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                type: "progressbar",
            },
            navigation: {
                nextEl: $controls.find('.swiper-button-next')[0],
                prevEl: $controls.find('.swiper-button-prev')[0]
            },
            observer: true,
            observeParents: true,
            breakpoints: {
                1400: {
                    spaceBetween: 20,
                },
            },
        });

        swiperInstances[targetId] = swiper;
    }

    initBusinessSwiper('#business1');

    $('button[data-toggle="tab"]').on('shown.bs.tab', function () {
        const targetId = $(this).data('target'); // "#business2"
        initBusinessSwiper(targetId);
    });

    new Swiper(".client-swiper", { 
        navigation: {
            nextEl: '.main-client .swiper-button-next',
            prevEl: '.main-client .swiper-button-prev',
        },
        loop: true,
        spaceBetween: 12,
        slidesPerView: 1.1,
        centeredSlides: true,
        observer: true,
        pagination: {
            el: ".swiper-pagination",
            type: "progressbar",
        },
        breakpoints: {
            576: {
                spaceBetween: 12,
                slidesPerView: 2.2,
                centeredSlides: false,
            },

            1200: {
                spaceBetween: 20,
                slidesPerView: 2,
                centeredSlides: false,
            },

            1400: {
                spaceBetween: 40,
                slidesPerView: 2.65,
                centeredSlides: false,
            },
        },
    });

    new Swiper(".news-swiper", { 
        direction: "horizontal",
        navigation: {
            nextEl: '.main-news .swiper-button-next',
            prevEl: '.main-news .swiper-button-prev',
        },
        pagination: {
            el: ".swiper-pagination",
            type: "progressbar",
        },
        loop: true,
        spaceBetween: 16,
        slidesPerView: 1.3,
        observer: true,
        breakpoints: {
            992: {
                direction: "vertical",
                spaceBetween: 16,
                slidesPerView: 2,
            },
        },
    });

    const circles = document.querySelectorAll('.animated-circle');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    circles.forEach(circle => observer.observe(circle));
});

let marqueeInstance = null;

function initMarqueeSwiper() {
    const marquee = document.querySelector('.marquee-swiper');
    if (!marquee) return;

    // 기존 애니메이션 중지 및 초기화
    if (marqueeInstance && typeof marqueeInstance.destroy === 'function') {
        marqueeInstance.destroy();
    }

    marqueeInstance = (function () {
        let position = 0;
        let speed = 0.5;
        let isDragging = false;
        let isHovered = false;
        let startX = 0;
        let marqueeOffset = 0;
        let hasMoved = false;
        let animationFrameId = null;

        const $marquee = $(marquee);
        let width = $marquee.find('.marquee').outerWidth();
        const dragThreshold = 3;

        // 기존 복제 제거 후 재복제
        $marquee.find('.marquee:gt(0)').remove();
        const clone = $marquee.find('.marquee').first().clone();
        for (let i = 0; i < 2; i++) {
            $marquee.append(clone.clone());
        }

        function animateMarquee() {
            if (!isDragging && !isHovered) {
                position -= speed;
                if (position <= -width) {
                    position = 0;
                }
                marquee.style.transform = `translateX(${position}px)`;
            }
            animationFrameId = requestAnimationFrame(animateMarquee);
        }

        function updateTransform(diffX) {
            position = marqueeOffset + diffX;
            if (position > 0) {
                position -= width;
            } else if (position <= -width) {
                position += width;
            }
            marquee.style.transform = `translateX(${position}px)`;
        }

        function onMouseMove(e) {
            if (!isDragging) return;
            const diffX = e.clientX - startX;
            if (Math.abs(diffX) > dragThreshold) {
                hasMoved = true;
                marquee.classList.add('noclick');
            }
            updateTransform(diffX);
        }

        function onTouchMove(e) {
            if (!isDragging) return;
            const diffX = e.touches[0].clientX - startX;
            if (Math.abs(diffX) > dragThreshold) {
                hasMoved = true;
                marquee.classList.add('noclick');
            }
            updateTransform(diffX);
        }

        function destroy() {
            cancelAnimationFrame(animationFrameId);
            marquee.removeEventListener('mouseenter', onMouseEnter);
            marquee.removeEventListener('mouseleave', onMouseLeave);
            marquee.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            marquee.removeEventListener('click', onClick);
            marquee.removeEventListener('touchstart', onTouchStart);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        }

        function onMouseEnter() {
            isHovered = true;
        }

        function onMouseLeave() {
            isHovered = false;
        }

        function onMouseDown(e) {
            isDragging = true;
            startX = e.clientX;
            marqueeOffset = position;
            hasMoved = false;
        }

        function onMouseUp() {
            if (!isDragging) return;
            isDragging = false;
            if (!hasMoved) marquee.classList.remove('noclick');
        }

        function onClick(e) {
            if (marquee.classList.contains('noclick')) {
                e.preventDefault();
                marquee.classList.remove('noclick');
            }
        }

        function onTouchStart(e) {
            isDragging = true;
            startX = e.touches[0].clientX;
            marqueeOffset = position;
            hasMoved = false;
        }

        function onTouchEnd() {
            if (!isDragging) return;
            isDragging = false;
            if (!hasMoved) marquee.classList.remove('noclick');
        }

        // 이벤트 바인딩
        marquee.addEventListener('mouseenter', onMouseEnter);
        marquee.addEventListener('mouseleave', onMouseLeave);
        marquee.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        marquee.addEventListener('click', onClick);
        marquee.addEventListener('touchstart', onTouchStart);
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);

        // 반응형 대응
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                width = $marquee.find('.marquee').first().outerWidth();
            }, 300);
        });

        animateMarquee();

        return { destroy };
    })();
}