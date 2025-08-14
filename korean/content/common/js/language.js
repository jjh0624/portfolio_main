$(function () {

    // 탭 기능
    // 오른쪽(다음) 버튼
    $('.paging-right').click(function () {
      const $active = $('.nav.paging button.active');
      const $next = $active.next('button');

      if ($next.length) {
      $next.trigger('click');
      }
    });

    // 왼쪽(이전) 버튼
    $('.paging-left').click(function () {
      const $active = $('.nav.paging button.active');
      const $prev = $active.prev('button');

      if ($prev.length) {
      $prev.trigger('click');
      }
    });

    // 슬라이드
	if($('.reading-slide').length){
		new Swiper('.reading-slide', {
			slidesPerView: 1,
			pagination: {
				el: '.reading-slide .reading-pagination',
				clickable: true
			},
			navigation: {
				nextEl: '.reading-slide .reading-next',
				prevEl: '.reading-slide .reading-prev'
			},
			observer: true,
			observeParents: true
		});
	}
    

    // 모달 슬라이드 (비활성화된 경우 주석 유지)
    // new Swiper('.modal-slide', { ... });

    // 모달 swiper 업데이트
    $('#modal2').on('shown.bs.modal', function () {
      const swiper = document.querySelector('.modal-slide')?.swiper;
      if (swiper) swiper.update();
    });

	if($('.slideBox').length){
		// 모달 Swiper 미리 초기화
		const modalSwiper = new Swiper('.slideBox', {
			slidesPerView: 1,
			spaceBetween: 20,
			loop: false,
			pagination: {
				el: '.swiper-pagination',
				clickable: true
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			observer: true,
			observeParents: true
		});

		$('#modal').on('shown.bs.modal', function () {
			setTimeout(() => {
				modalSwiper.update();
			}, 0);
		});

		$('#modal').on('hidden.bs.modal', function () {
			modalSwiper.slideTo(0);
		});
	}

    

    // 스크롤 트랙과 썸 생성
	let isDragging = false;
	let startY = 0;
	let startScrollTop = 0;

	function bindThumbDragEvents() {
		const $scrolled = $('.scrolled');

		// 마우스 시작
		$thumb.on('mousedown touchstart', function (e) {
			e.preventDefault();
			isDragging = true;
			startY = e.type === 'touchstart' ? e.originalEvent.touches[0].clientY : e.clientY;
			startScrollTop = $scrolled.scrollTop();

			console.log('?');

			$(document).on('mousemove.thumbDrag touchmove.thumbDrag', function (e) {
				if (!isDragging) return;

				const clientY = e.type === 'touchmove' ? e.originalEvent.touches[0].clientY : e.clientY;
				const deltaY = clientY - startY;

				const scrollHeight = $scrolled[0].scrollHeight;
				const clientHeight = $scrolled.outerHeight();
				const maxScroll = scrollHeight - clientHeight;

				const thumbHeight = $thumb.outerHeight();
				const maxThumbTop = clientHeight - thumbHeight;

				const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
				$scrolled.scrollTop(startScrollTop + scrollDelta);
			});

			$(document).on('mouseup.thumbDrag touchend.thumbDrag touchcancel.thumbDrag', function () {
				isDragging = false;
				$(document).off('.thumbDrag');
			});
		});
	}

	const $track = $('<div class="custom-track"></div>').appendTo('#wrap');
	const $thumb = $('<div class="custom-thumb"></div>').appendTo('#wrap');

	bindThumbDragEvents();

    function updateScrollbar() {
		const $scrolled = $('.scrolled');
		if (!$scrolled.length) return;

		let clientHeight = $scrolled.outerHeight();
		const hasBtnOffset = $('.btn-wrap').hasClass('position-absolute');
		const offsetHeight = hasBtnOffset ? 98 : 0;

		const scrollHeight = $scrolled[0].scrollHeight;
		const scrollTop = $scrolled.scrollTop();
		const maxScroll = scrollHeight - clientHeight;

		if (maxScroll <= 0) {
			$thumb.hide();
			$track.hide();
			return;
		}

		// const thumbHeight = Math.max(clientHeight * (clientHeight / scrollHeight), 30);
		// $thumb.height(thumbHeight);
		const thumbHeight = 50;
		$thumb.height(thumbHeight);

		const maxThumbTop = (clientHeight - offsetHeight) - thumbHeight;
		const scrollRatio = scrollTop / maxScroll;
		const thumbTop = scrollRatio * maxThumbTop;

		const scrolledPos = $scrolled.position().top + 80;

		$thumb.css({
			top: scrolledPos + thumbTop + 'px',
			right: 20,
			display: 'block'
		});

		$track.css({
			top: scrolledPos + 'px',
			right: 23,
			height: (clientHeight - offsetHeight) + 'px',
			display: 'block'
		});
	}

    setTimeout(updateScrollbar, 50);
	
    // 이벤트 연결
    $('.scrolled').on('scroll', updateScrollbar);
	$(window).on('resize', updateScrollbar);
    $('.scrolled img, .scrolled video').on('load', updateScrollbar);

    const scrolledEl = document.querySelector('.scrolled');

	if (scrolledEl) {
		const observer = new MutationObserver(updateScrollbar);

		observer.observe(scrolledEl, {
			childList: true,      // 자식 노드 추가/삭제
			subtree: true,        // 하위 모든 노드까지 감지
			characterData: true   // 텍스트 노드 변경까지 포함
		});
	}

	// 모달 스크롤
	function initModalScrollbar($scrolled) {
	if ($scrolled.data('scroll-init')) return; // 중복 방지
	$scrolled.data('scroll-init', true);

	const $thumb = $('<div class="custom-thumb modal-thumb"></div>').insertAfter($scrolled);
	const $track = $('<div class="custom-track modal-track"></div>').insertAfter($scrolled);


	let isDragging = false;
	let startY = 0;
	let startScrollTop = 0;

	$thumb.on('mousedown touchstart', function (e) {
		e.preventDefault();
		isDragging = true;
		startY = e.type === 'touchstart' ? e.originalEvent.touches[0].clientY : e.clientY;
		startScrollTop = $scrolled.scrollTop();

		$(document).on('mousemove.modalDrag touchmove.modalDrag', function (e) {
			if (!isDragging) return;
			const clientY = e.type === 'touchmove' ? e.originalEvent.touches[0].clientY : e.clientY;
			const deltaY = clientY - startY;

			const scrollHeight = $scrolled[0].scrollHeight;
			const clientHeight = $scrolled.outerHeight();
			const maxScroll = scrollHeight - clientHeight;

			const thumbHeight = $thumb.outerHeight();
			const maxThumbTop = clientHeight - thumbHeight;

			const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
			$scrolled.scrollTop(startScrollTop + scrollDelta);
		});

		$(document).on('mouseup.modalDrag touchend.modalDrag touchcancel.modalDrag', function () {
			isDragging = false;
			$(document).off('.modalDrag');
		});
	});


	function updateScrollbar() {
		const clientHeight = $scrolled.outerHeight();
		const scrollHeight = $scrolled[0].scrollHeight;
		const scrollTop = $scrolled.scrollTop();
		const maxScroll = scrollHeight - clientHeight;

		if (maxScroll <= 0) {
			$thumb.hide();
			$track.hide();
			return;
		}

		const thumbHeight = 50;
		$thumb.height(thumbHeight);

		const maxThumbTop = clientHeight - thumbHeight + 28;
		const scrollRatio = scrollTop / maxScroll;
		const thumbTop = scrollRatio * maxThumbTop + 183 + 120 - 22;

		$thumb.css({
			top: thumbTop + 'px',
			right: 43,
			display: 'block'
		});
		$track.css({
			top: 283,
			right: 46,
			height: clientHeight + 28 + 'px',
			display: 'block'
		});

		if($('#modal').hasClass('common-modal') == true){
			$thumb.css({
				top: thumbTop - 120 + 'px',
				right: 20,
				display: 'block'
			});
			$track.css({
				top: 182,
				right: 23,
				height: clientHeight - 38 + 'px',
				display: 'block'
			});
		}
	}

	// 이벤트 연결
	$scrolled.on('scroll', updateScrollbar);
	$(window).on('resize', updateScrollbar);
	$scrolled.find('img, video').on('load', updateScrollbar);

	const observer = new MutationObserver(updateScrollbar);
	observer.observe($scrolled[0], {
		childList: true,
		subtree: true,
		characterData: true
	});

	setTimeout(updateScrollbar, 50);
}

	$(function () {
		// 모달이 열릴 때 안의 .scrolled 요소 전부 초기화
		$('.modal').on('shown.bs.modal', function () {
			const $modal = $(this);
			$modal.find('.scrolled').each(function () {
				initModalScrollbar($(this));
			});
		});

		// 탭 전환 시에도 update
		$('[data-toggle="tab"]').on('shown.bs.tab', function () {
			$('.modal .scrolled').each(function () {
				const $this = $(this);
				if ($this.data('scroll-init')) {
					$this.trigger('scroll'); // 강제로 업데이트 유도
				}
			});
		});
	});

	$('[data-toggle="tab"]').on('click', function () {
		const target = $(this).data('target');
		const $scrolled = $(target).find('.scrolled');

		if ($scrolled.length) {
			setTimeout(() => {
				// 중복 방지 제거
				$scrolled.removeData('scroll-init');
				initModalScrollbar($scrolled);
			}, 50);
		}
	});



    $(document).on('click', '.index-toggle', function(){
		$('#index').toggleClass('active');
    });

	// 정답 기능
	const correctAudio = new Audio('../common/media/correct.mp3');
	const wrongAudio = new Audio('../common/media/wrong.mp3');

	$('.btn-answer').on('click', function () {
		const $qWrap = $('.q-wrap');
		const $checked = $qWrap.find('input[type="radio"]:checked');

		$qWrap.removeClass('correct wrong wrong-item wrong-item2');

		if(!$(this).hasClass('active')){
			return false;
		}

		if ($checked.length === 0) {
			// 선택하지 않은 경우 오답 처리
			
			wrongAudio.play();
			if($qWrap.hasClass('choice-wrap') == true){
				$qWrap.addClass('wrong wrong-item2');
			}else{
				$qWrap.addClass('wrong wrong-item');
			}
			return;
			
		}

		const $selectedLabel = $checked.closest('label');

		if ($selectedLabel.is('[data-chk="answer"]')) {
			// 정답 선택
			$qWrap.addClass('correct');
			correctAudio.play();
		} else {
			// 오답 선택
			$qWrap.addClass('wrong');
			wrongAudio.play();
		}
	});
});

// 자기점검 리스트
$(document).ready(function () {
    $('input[type="checkbox"]').on('change', function () {
        const name = $(this).attr('name');
        const $group = $('input[name="' + name + '"]');
        const index = $group.index(this);

        $group.each(function (i) {
            $(this).prop('checked', i <= index);
        });
    });
});





