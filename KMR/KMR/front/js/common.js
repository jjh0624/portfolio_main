$(function(){
	if($('[data-aos]').length){
		AOS.init({
			once: true,
			duration: 600,
		});
	}

	document.querySelectorAll('.depth3').forEach(ul => {
        const items = Array.from(ul.children);
        const total = items.length;

        if (total >= 21) {
            const half = Math.ceil(total / 2);

            items.forEach((li, i) => {
                const column = i < half ? 1 : 2;
                const row = i < half ? i + 1 : i - half + 1;
                li.style.gridColumn = column;
                li.style.gridRow = row;
            });
        }
    });

	$('.gnb > li > a').on('mouseenter', function () {
		$('.depth').removeClass('active');
		$('.gnb > li > a').removeClass('on');
		$(this).addClass('on').siblings('.depth').addClass('active');
	});

	$('.gnb').on('mouseleave', function () {
		$('.depth').removeClass('active');
		$('.gnb > li > a').removeClass('on');
	});

	$('.bt-sitemap').on('click', function(){
		$('body').toggleClass('sitemap-open');
		$('#sitemap').toggle();
	});

	$('.bt-srch').on('click', function(){
		$('#head-srch').toggle();
	});

	$('.pop-close').on('click', function(){
		$(this).closest('.popup').hide();
	});

	$(window).scroll(function(){
		const hdOffset = $(this).scrollTop();
		document.documentElement.style.setProperty('--hd-offset', `${hdOffset}px`);
		const offset = $('.topbanner.visible').length ? $('.topbanner.visible').height() : $('.hd').height();
		$('body').toggleClass('is-scroll', $(this).scrollTop() > offset);
	}).trigger('scroll');

	$(document).on('click', '.ft-sitemap>li>a, .sitemap>li>a, .sitemap-depth>li>a', function (e) {
		const width = $(this).closest('.ft-sitemap').length ? 1200 : 1400;
		const isMobile = window.innerWidth < width;
		const $li = $(this).parent();
		const $submenu = $li.children('ul');

		if (isMobile && $submenu.length) {
			e.preventDefault();
			$(this).toggleClass('on');
			$submenu.toggleClass('active');
		}
	});

	$('.btn-cs').on('click', function(){
		$('#cs').toggle();
		$('.floating>.btn').toggleClass('d-none');
	});

	if($('.card-swiper').length){
		new Swiper(".card-swiper", { 
			pagination: {
				el: ".swiper-pagination",
				type: "progressbar",
			},
			spaceBetween: 16,
			slidesPerView: 1.3,
			breakpoints: { 
				557: {
					spaceBetween: 16,
					slidesPerView: 2.3,
				},
				992: {
					spaceBetween: 24,
					slidesPerView: 3,
				},
			},
		});
	}

	$('.scroll-wrapper').each(function () {
		const $wrapper = $(this);
		let isDragging = false;
		let startX, scrollStart;

		$wrapper.on('mousedown', function (e) {
			isDragging = true;
			$wrapper.addClass('dragging');
			startX = e.pageX - $wrapper.offset().left;
			scrollStart = $wrapper.scrollLeft();
		});
		$(document).on('mousemove', function (e) {
			if (!isDragging) return;
			const x = e.pageX - $wrapper.offset().left;
			const walk = (x - startX) * 1.5;
			$wrapper.scrollLeft(scrollStart - walk);
		});

		$(document).on('mouseup', function () {
			isDragging = false;
			$wrapper.removeClass('dragging');
		});

		$wrapper.on('wheel', function (e) {
			if (Math.abs(e.originalEvent.deltaY) > Math.abs(e.originalEvent.deltaX)) {
				e.preventDefault();
				$wrapper.scrollLeft($wrapper.scrollLeft() + e.originalEvent.deltaY);
			}
		});
	});

	document.querySelectorAll('.paint-text>span').forEach(el => {
		el.setAttribute('data-copy', el.textContent);
	});

	document.querySelectorAll('summary').forEach(summary => {
		summary.addEventListener('click', (e) => {
			const details = summary.parentNode;

			const isOpening = !details.open;
			const scrollY = window.scrollY;
			
			e.preventDefault();
			details.open = isOpening;

			requestAnimationFrame(() => {
				window.scrollTo({ top: scrollY });
			});
		});
	});

	let certification = {
		"q1": "",
        "q2": "",
        "q3": "",
	}

	$('.find-start').click(function(){
		$('#findIntro').hide();
		$('#findCont').show();
	});

	// 다음 버튼
    $('.find-next').on('click', function () {
        let $currentStep = $('.findstep.active');
        let $selectedInput = $currentStep.find('input[type="radio"]:checked');

        if ($selectedInput.length === 0) return; // 선택되지 않았으면 중단

        // 값 저장
        let name = $selectedInput.attr('name');
        let value = $selectedInput.val();
        certification[name] = value;

        let target = $selectedInput.data('target');
        $currentStep.removeClass('active');

        if (target) {
            $(target).addClass('active');
        } else {
            $('#findCont').hide();

			$.getJSON('/front/js/certification.json', function (data) {
                const $resultList = $('.find-result').empty();

                const matched = data.filter(item =>
                    item.q1 === certification.q1 &&
                    item.q2 === certification.q2 &&
                    item.q3 === certification.q3
                );

                matched.forEach(item => {
                    const $li = $('<li>');
                    $li.append(`<strong>${item.result}</strong>`);

                    item.contact.forEach(contact => {
						if (contact.includes('/')) {
							const [label, rest] = contact.split('/');
							const $div = `
								<div class="fsm">
									<div>${label}</div>
									<div>${rest}</div>
								</div>
							`;
							$li.append($div);
						} else {
							$li.append(`
								<div class="fsm">
									<div>${contact}</div>
								</div>
							`);
						}
					});

                    $resultList.append($li);
                });
            });	

            $('#findResult').show();
        }
    });

    // 이전 버튼
    $('.find-prev').on('click', function () {
        let $currentStep = $('.findstep.active');
        let prev = $currentStep.data('prev');
        if (!prev) return;

        $currentStep.removeClass('active');
        $(prev).addClass('active');
    });

	function resetFindSteps() {
		certification = {
			q1: '',
			q2: '',
			q3: ''
		};

		$('.findstep').removeClass('active').first().addClass('active');
		$('.findstep input[type="radio"]').prop('checked', false);

		$('#findCont, #findResult').hide();
		$('#findIntro').show();
	}

	$('.find-reset').on('click', resetFindSteps);

	$('#findCont').on('hide.bs.modal', resetFindSteps);
});