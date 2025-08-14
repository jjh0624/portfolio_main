function loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onload = function () {
        if (callback) {
            callback();
        }
    };

    document.head.appendChild(script);
}

loadScript('../common/js/naviData.js', function() {
	function generateIndexHtml(data) {
		const $index = $('<div id="index" class="index"></div>');
		const $wrap = $('<div class="index-wrap"></div>').appendTo($index);

		// Header
		const $hd = $(`
			<div class="index-hd">
				<h3>중학교 국어 2-1</h3>
				<button type="button" class="icon icon-modal-close index-toggle"></button>
			</div>
		`).appendTo($wrap);

		// Scroll structure
		const $scroll = $('<div class="unit-scroll"></div>').appendTo($wrap);
		$scroll.append(`
			<div class="custom-scrollbar">
				<div class="unit-custom-thumb"></div>
			</div>
		`);

		const $scrollInner = $('<div class="unit-scroll-inner"></div>').appendTo($scroll);
		const $ul = $('<ul class="index-lesson"></ul>').appendTo($scrollInner);

		Object.keys(data).forEach((lessonKey, idx) => {
			const title = [
				'1. 생각을 키우는 소통',
				'2. 나와 너의 세상 보기',
				'3. 의도가 담긴 말과 글',
				'4. 생각하고 설명하는 힘'
			]
			const lesson = data[lessonKey];
			const $lessonLi = $('<li></li>');
			const $lessonTitle = $(`<div class="unit-title">${title[idx]}</div>`);
			$lessonLi.append($lessonTitle);

			const $mainUl = $('<ul class="main-unit"></ul>');

			lesson.forEach(chapter => {
				const $chapterLi = $('<li></li>');
				const $chapterTitle = $(`<div role="button" class="unit-sub-title">${chapter.title}</div>`);
				if (chapter.url) {
					$chapterTitle.attr('data-index-page', `../${chapter.url}.html`);
				}
				$chapterLi.append($chapterTitle);

				if (Array.isArray(chapter.sections)) {
					$chapterTitle.addClass('last-unit-title').removeAttr('data-index-page');

					const $lastUl = $('<ul class="last-unit"></ul>');

					chapter.sections.forEach(section => {
						const $sectionLi = $('<li></li>');
						const $sectionA = $(`<div role="button">${section.title}</div>`);
						if (section.url) {
							$sectionA.attr('data-index-page', `../${section.url}.html`);
						}
						$sectionLi.append($sectionA);
						$lastUl.append($sectionLi);
					});

					$chapterLi.append($lastUl);
				}

				$mainUl.append($chapterLi);
			});

			$lessonLi.append($mainUl);
			$ul.append($lessonLi);
		});

		return $index;
	}

	const indexHtml = generateIndexHtml(DATA);
	$('#wrap').append(indexHtml);


	// index 스크롤
	// 📌 요소 참조
	const scrollContainer = document.querySelector('.unit-scroll-inner');
	const scrollbar = document.querySelector('.unit-scroll .custom-scrollbar');
	const thumb = document.querySelector('.unit-scroll .unit-custom-thumb');

	// 📌 thumb 높이 계산
	function updateThumbHeight() {
		const ratio = scrollContainer.clientHeight / scrollContainer.scrollHeight;
		const thumbHeight = scrollbar.clientHeight * ratio;
		thumb.style.height = `${Math.max(40, thumbHeight)}px`; // 최소 높이 40px
	}

	// 스크롤 위치에 따른 thumb 위치 계산
	function updateThumbPosition() {
		const scrollRatio = scrollContainer.scrollTop / (scrollContainer.scrollHeight - scrollContainer.clientHeight);
		const thumbMaxTop = scrollbar.clientHeight - thumb.offsetHeight;
		const thumbTop = scrollRatio * thumbMaxTop;
		thumb.style.top = `${thumbTop}px`;
	}

	// 스크롤 발생 시 thumb 위치 갱신
	scrollContainer.addEventListener('scroll', updateThumbPosition);

	// 창 크기나 콘텐츠 변화 대응 (선택적 호출)
	window.addEventListener('resize', () => {
		updateThumbHeight();
		updateThumbPosition();
	});

	// 드래그로 thumb → scrollContainer.scrollTop 이동
	let isDragging = false;
	let startY = 0;
	let startThumbTop = 0;

	thumb.addEventListener('mousedown', (e) => {
		isDragging = true;
		startY = e.clientY;
		startThumbTop = parseFloat(thumb.style.top) || 0; // 기존 위치 저장
		document.body.style.userSelect = 'none';
	});

	document.addEventListener('mousemove', (e) => {
		if (!isDragging) return;

		const deltaY = e.clientY - startY;
		const trackHeight = scrollbar.clientHeight - thumb.offsetHeight;
		const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;

		let newThumbTop = startThumbTop + deltaY;
		newThumbTop = Math.max(0, Math.min(trackHeight, newThumbTop));

		const newScrollTop = (newThumbTop / trackHeight) * scrollHeight;
		scrollContainer.scrollTop = newScrollTop;
	});

	document.addEventListener('mouseup', () => {
		isDragging = false;
		document.body.style.userSelect = '';
	});

	// 📌 초기 실행
	updateThumbHeight();
	updateThumbPosition();


	$(document).on('click', '#index [data-index-page]', function () {
		window.location = `${this.dataset.indexPage}`;
    });

	$(document).on('click', '.last-unit-title', function(e){
		$(this).parent().toggleClass('active');
	});

	// 임시 - 2단원 외 클릭 불가/닫아두기
	$('.main-unit').hide();
	$('.index-lesson > li').eq(1).children('.main-unit').show();
	console.log()
});

const PAGE_DATA = {
	lesson2 : [
		["2. 나와 너의 세상 보기", "대단원 도입", "", "62_01"],
		["2. 나와 너의 세상 보기", "대단원 도입", "", "62_02"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "소단원 도입", "64_01"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "소단원 도입", "64_02"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "소단원 도입", "64_03"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "소단원 도입", "65_01"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "글 읽기", "66_01"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "글 읽기", "66_02"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "글 읽기", "66_03"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "글 읽기", "66_04"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "글 읽기", "66_05"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "이해 활동", "68_01"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "이해 활동", "69_01"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "이해 활동", "69_02"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "이해 활동", "70_01"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "이해 활동", "70_02"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "이해 활동", "70_03"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "적용 활동", "71_01"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "적용 활동", "71_02"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "적용 활동", "72_01"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "적용 활동", "72_02"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "소단원 마무리", "73_01"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "소단원 마무리", "73_02"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "소단원 마무리", "73_03"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "소단원 마무리", "73_04"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "소단원 마무리", "73_05"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "소단원 마무리", "73_06"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "더 읽어 보기", "74_01"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "더 읽어 보기", "74_02"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "더 읽어 보기", "74_03"],
		["2. 나와 너의 세상 보기", "(1) 시와 화자", "더 읽어 보기", "75_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "소단원 도입", "76_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "소단원 도입", "76_02"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "소단원 도입", "76_03"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "소단원 도입", "77_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "글 읽기", "79_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "글 읽기", "79_02"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "글 읽기", "79_03"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "글 읽기", "80_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "글 읽기", "80_02"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "글 읽기", "82_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "글 읽기", "82_02"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "글 읽기", "84_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "글 읽기", "88_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "글 읽기", "89_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "글 읽기", "89_02"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "글 읽기", "89_03"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "이해 활동", "90_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "이해 활동", "90_02"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "이해 활동", "91_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "이해 활동", "93_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "이해 활동", "93_02"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "이해 활동", "94_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "이해 활동", "94_02"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "이해 활동", "94_03"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "적용 활동", "95_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "적용 활동", "96_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "적용 활동", "96_02"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "적용 활동", "97_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "적용 활동", "97_02"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "소단원 마무리", "98_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "소단원 마무리", "98_02"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "소단원 마무리", "98_03"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "소단원 마무리", "98_04"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "소단원 마무리", "98_05"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "소단원 마무리", "98_06"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "소단원 마무리", "98_07"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "더 읽어 보기", "99_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "더 읽어 보기", "101_01"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "더 읽어 보기", "101_02"],
		["2. 나와 너의 세상 보기", "(2) 소설과 서술자", "더 읽어 보기", "101_03"],
		["2. 나와 너의 세상 보기", "생활 속 국어 활동", "", "102_01"],
		["2. 나와 너의 세상 보기", "생활 속 국어 활동", "", "102_02"],
		["2. 나와 너의 세상 보기", "생활 속 국어 활동", "", "103_01"],
		["2. 나와 너의 세상 보기", "생활 속 국어 활동", "", "103_02"],
		["2. 나와 너의 세상 보기", "생활 속 국어 활동", "", "103_03"],
		["2. 나와 너의 세상 보기", "생활 속 국어 활동", "", "104_01"],
		["2. 나와 너의 세상 보기", "대단원 마무리", "", "105_01"],
		["2. 나와 너의 세상 보기", "대단원 마무리", "", "105_02"]
	]
}

$(function () {
    const $wrap = $('#wrap');
    const lessonNum = $wrap.data('lesson'); 
    const lessonKey = `lesson${lessonNum}`;
    const data = PAGE_DATA[lessonKey];

    const url = window.location.href;
    const match = url.match(/(\d{3}_\d{2})\.html/); 
    if (!match) return;

    const rawPageId = match[1]; 
    const parts = rawPageId.split('_');
    const pageId = `${parseInt(parts[0], 10)}_${parts[1]}`; 

    const pageData = data.find(item => item[3] === pageId);
    if (!pageData) return;

    const [title, section, sub, pageCode] = pageData;

    const $bread = $('.page-bread');
    $bread.append(`<span class="hd-part">${title}</span>`);
    if (section) $bread.append(`<span class="hd-part">${section}</span>`);
    if (sub) $bread.append(`<span class="hd-part">${sub}</span>`);

    // 페이지 번호 설정
    const pageNum = pageCode.split('_')[0];
    //$('#page-num').val(pageNum);
    $('.page-label').attr('data-page',pageNum).find('strong').text(pageNum);

	const currentIndex = data.findIndex(item => item[3] === pageId);
    if (currentIndex === -1) return;

	$('.now-page').text(String(currentIndex + 1).padStart(3, '0'));
	$('.total-page').text(String(data.length).padStart(3, '0'));

	function moveTo(index) {
        const target = data[index];
        if (!target) return;
        const href = `page${target[3].padStart(6, '0')}.html`; 
        window.location.href = href;
    }

	$('[data-action]').click(function(){
		switch (this.dataset.action) {
			case 'prev':
				currentIndex > 0 &&  moveTo(currentIndex - 1);
				break;

			case 'next':
				currentIndex < data.length - 1 && moveTo(currentIndex + 1);
				break;
		
			default:
				break;
		}
	})
});

