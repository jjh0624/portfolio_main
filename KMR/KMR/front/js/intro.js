
const initStorySect01Ani = () => {
    ScrollTrigger.matchMedia({
        "(min-width: 768px)": function() {
            ScrollTrigger.create({
                trigger: ".story .sect1",
                start: "top top",
                end: "+=400%",
                pin: true,
                pinSpacing: true,
                fastScrollEnd: true,
                preventOverlaps: true,
            });

            const sect1TL = gsap.timeline({
                scrollTrigger: {
                    trigger: ".story .sect1",
                    start: "top top",
                    end: "+=500%",
                    scrub: 2,
                }
            });

            sect1TL
            .to(
                ".sect1 .slide-wrap",
                { opacity: 1, duration: 0.01}
            )
            .to(".sect1 .slide-wrap", 
                { x: '-450%', delay: 0.05 }
            )
        },
    });
}
const initStorySect02Ani = () => {
    ScrollTrigger.matchMedia({
        "(min-width: 768px)": function() {
            gsap.to(".story .sect2 .tit", {
                scrollTrigger: {
                    trigger: ".story .sect2",
                    pin: ".story .sect2 .tit",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                }
            });
            
            gsap.to(".story .sect2 .bg", {
                width: '100%',
                scrollTrigger: {
                    trigger: ".story .sect2",
                    start: "top bottom-=20%",
                    end: "+=60%",
                    scrub: true,
                }
            });
        },
    });
}
const initStoryGSAP = () => {
    gsap.registerPlugin(ScrollTrigger);

    initStorySect01Ani();
    initStorySect02Ani();
};

const initHistoryAni = () => {
    let topHd = $('.hd').height();

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({
        "(min-width: 992px)": function() {
            gsap.to(".history .list1 .tit", {
                scrollTrigger: {
                    trigger: ".history-list.list1",
                    pin: ".history-list.list1 .tit",
                    start: `top top`,
                    end: "bottom center+=5%",
                    scrub: true,
                }
            });

            gsap.to(".history .list2 .tit", {
                scrollTrigger: {
                    trigger: ".history-list.list2",
                    pin: ".history-list.list2 .tit",
                    start: `top top`,
                    end: "bottom center",
                    scrub: true,
                }
            });
        },
    });
};



$(function(){
    // KMR Story
    if($('.story').length) {

        initStoryGSAP();

        $(window).scroll(function() { 
            if($(document).scrollTop() > $('.sect2').offset().top) {
                $('#wrap').addClass('bg-gray');
            } else {
                $('#wrap').removeClass('bg-gray');
            }

            $.each($('.sect2 .map'), function(index, item) {
                if ($(item).offset().top < ($(window).scrollTop() + $(window).height() / 2)) {
                    $(item).addClass('show');
                } else {
                    $(item).removeClass('show');
                }
            });
        });
    }

    // 연혁
    if ($('.history').length) {
        initHistoryAni();

        ScrollTrigger.matchMedia({
            "(min-width: 768px)": function() {
                gsap.fromTo('.history .banner-img img',
                    { y: 0 }, // 시작 위치
                    {
                        y: '-20%', // 끝 위치
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '.history .banner-img',
                            start: 'top 80%',
                            end: 'bottom 30%',
                            scrub: .7,
                        }
                    }
                );
            },
            "(max-width: 767px)": function() {
                gsap.fromTo('.history .banner-img img',
                    { y: 0 }, // 시작 위치
                    {
                        y: '-10%', // 끝 위치
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '.history .banner-img',
                            start: 'top 80%',
                            end: 'bottom 30%',
                            scrub: .7,
                        }
                    }
                );
            },
        });

        $(".history-nav li").each(function(index) {
            $(this).on("click", function() {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: "#list" + (index + 1), autokill: true }
                });
            });
        });

        $(window).scroll(function() {
            $(".history-list").each(function(index) {
                if($(window).scrollTop() > $(this).offset().top - ($(window).height() / 2)) {
                    $('.history-nav li').removeClass('active');
                    $('.history-nav').find('li').eq(index).addClass('active');
                }
            });

            if($(window).scrollTop() > $(".history-list-wrap").offset().top - ($(window).height() / 2) && $(window).scrollTop() < $(".history-list-wrap").offset().top + $(".history-list-wrap").height() - ($(window).height() / 3 * 2)) {
                $('.history-nav').addClass('show');
            } else {
                $('.history-nav').removeClass('show');
            }
        });
    }

    // CEO인사말
    if ($('.bx-img-banner img').length) {
        gsap.fromTo('.bx-img-banner img',
            { y: 0 }, // 시작 위치
            {
                y: -160, // 끝 위치
                ease: 'none',
                scrollTrigger: {
                    trigger: '.bx-img-banner',
                    start: 'top 100%',
                    end: 'bottom 30%',
                    scrub: .7,
                }
            }
        );
    }
});
