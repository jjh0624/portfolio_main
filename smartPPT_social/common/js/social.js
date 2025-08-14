$(function () {
	// 페이지 로드 시 도움 영상 버튼에 data-lesson 속성 추가
	$('.help-play').each(function() {
		// 현재 페이지의 경로에서 lesson 폴더명 추출
		var currentPath = window.location.pathname;
		var lessonMatch = currentPath.match(/lesson(\d+)/);

		if (lessonMatch) {
			var lessonNumber = lessonMatch[1];
			$(this).attr('data-lesson', 'lesson' + lessonNumber);
		}
	});

	$('.help-play').click(function () {
		// window.jj.link.html($(this).data('vod'), '_blank', { maximize: true, title: $(this).attr('title') });
        window.open(window.location.origin + "/cms/smartppt/idigrow/e_social5_2/" + $(this).data('lesson') + "/ops/" + $(this).data('vod'), $(this).attr('title'), "fullscreen");

	});

	$('.self-check input').click(function () {
		$(this).siblings().prop('checked', false);
    });

    'use strict';

    var swiper = [];

    // 각 modal-body 내부의 swiper-container에 대해 swiper 인스턴스를 생성
    $('.modal-body .swiper-container').each(function (i) {
        var t = $(this);

        swiper[i] = new Swiper(t, {
            observer: true,
            observeParents: true,
            pagination: {
                el: t.find('.swiper-pagination'),
                clickable: true,
            },
            simulateTouch: false,
            allowTouchMove: false,
            navigation: {
                nextEl: t.find('.swiper-button-next'),
                prevEl: t.find('.swiper-button-prev'),
            },
            on: {
                init: function () {
                    t.attr('data-active', 0);
                    // 초기 슬라이드가 0이 아닐 경우 prev 버튼 활성화
                    if (this.activeIndex > 0) {
                        this.$el.find('.swiper-button-prev').removeClass('swiper-button-disabled');
                    }
                },
                slideChange: function (e) {
                    t.attr('data-active', swiper[i].activeIndex);
                    // 현재 슬라이드가 첫 번째가 아닐 경우 prev 버튼 활성화
                    if (this.activeIndex > 0) {
                        this.$el.find('.swiper-button-prev').removeClass('swiper-button-disabled');
                    }
                }
            },
        });
    });

    // 버튼 클릭 시 해당 슬라이더로 이동하는 이벤트 처리
    $('.icon.icon-zoom').click(function () {
        var $btn = $(this);
        var target = $($btn.attr('data-target'));

        if ($btn.hasClass('icon-zoom') && this.dataset.slide) {
            // 현재 클릭된 모달 내부의 슬라이더 인덱스를 계산하고 해당 슬라이더로 이동
            var swiperIndex = target.find('.swiper-container').index('.modal-body .swiper-container');
            swiper[swiperIndex].slideTo(this.dataset.slide); // 슬라이더 인덱스를 정확하게 설정
        }
    });

	$('.btn-popup-start').click(function(){
        $(this).closest('.popup').hide();
    });
});