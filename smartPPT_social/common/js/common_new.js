
// 오디오 재생
function playAudio(src){
	$('#audio')[0].pause();
	$('#audio').find('source').attr('src', src);
	$('#audio')[0].load();
	$('#audio')[0].oncanplaythrough = $('#audio')[0].play();
}

var correctSound = '../../common/media/correct.mp3';
var wrongSound = '../../common/media/wrong.mp3';

// 미디어 멈춤
function mediaStop(){
	$('#audio')[0].pause();
	$('#audio').find('source').removeAttr('src');
	if (!isNaN($('#audio')[0].duration)) {
		$('#audio')[0].currentTime = 0;
	}

	var videos = Array.prototype.slice.call(document.getElementsByTagName("video"));
	videos.forEach(function(video){
		video.pause();
		video.currentTime = 0;
		video.load();
	});
}

var toggleActiveContent = ['[data-toggle=answer]', '.choice', '[data-invisible]', '.toggle-change', '.form-answer'];

// 문항 체크
var checkAnswer = {
	answerItem : ['.choice', '[data-toggle=answer]'],
	basicFn : function(t){
		var targetObj = $('#wrap'), answerBtn,
			condition  = ['.swiper-slide-active', '.tab-pane.active', '.modal'];

		for (var i = 0; i < condition.length; i++) {
			if($(t).closest(condition[i]).length){
				targetObj = $(t).closest(condition[i]);
				break;
			}
		}

		answerBtn = targetObj.find('[data-toggle=answer-all]');

		if(!answerBtn.length){
			return false;
		}

		var q = $(answerBtn[0].dataset.target).find(this.answerItem.join()),
			a = q.filter('.active');

		if(q.length === a.length){
			answerBtn.trigger('click');
		} else {
			answerBtn.removeClass('active');
		}
	},
	themeFn : function(){},
	run: function(t){
		this.basicFn(t);
		this.themeFn(t);
	}
}

function clickSoundPlay(){
	$('#audio-click')[0].currentTime = 0;
	$('#audio-click')[0].play();
}

jQuery(function($){
	'use strict';

	// 오디오
	$('body').append('<audio id="audio" controls data-dtext_index="dtext_cls_audio" class="position-absolute d-none"><source src="" type="audio/mpeg"></audio><audio id="audio-click" controls data-dtext_index="dtext_cls_audio" class="position-absolute d-none"><source src="../../common/media/click.mp3" type="audio/mpeg"></audio>');

	$('.custom-check, #ct button:not([data-audio]), [data-toggle="answer"]').click(clickSoundPlay);

	$('.self-check input').change(function(){
		this.checked && clickSoundPlay();
	});

	// 클릭 이벤트
	$(document).on("click", "[data-audio]", function(){
		playAudio(this.dataset.audio);
	});

	$('.nav li:first-child button, .tab-pane:first-child, .paging>button:first-child').addClass('active');

	/* 컨텐츠 */
	// toggle class active
	$('[data-toggle=answer]').click(function(){
		$(this).toggleClass('active');
		checkAnswer.run(this);
	});

	// 선택형
	$('.choice input').click(function(){
		var $choice = $(this).closest('.choice');

		if($choice[0].dataset.multi){
			$choice = $(`[data-multi=${$choice[0].dataset.multi}]`)
		}

		if($choice.hasClass('answered')){
			$choice.removeClass('answered active').find('input').prop('checked', false);
		}else{
			this.dataset.answer === '' ? playAudio(correctSound) : playAudio(wrongSound);
			if(this.type==='checkbox'){
				$choice.find('[data-answer]').length === $choice.find('[data-answer]:checked').length && $choice.addClass('answered active');
			}else{
				$choice.addClass('answered');
				$choice.find('[data-answer]:checked').length && $choice.addClass('active');
			}
		}

		checkAnswer.run(this);
	});

	// 주관식 입력 필드의 값과 정답을 비교 2024-10-31 Jay Yu
	$('.answer-bx input').on('change', function() {
		console.log("주관식 입력 필드 변경됨");
	
		var playerAnswer = $(this).val().replace(/\s+/g, ''); // 공백 제거된 입력값
		
		// 현재 활성화된 질문(li) 요소를 찾고, 그 요소의 data-answer 속성을 가져옴
		var currentQuestion = $('#gameQ li.active'); 
		var correctAnswer = currentQuestion.data('answer') ? currentQuestion.data('answer').replace(/\s+/g, '') : ''; // 공백 제거된 정답
		
		// 입력값과 정답 확인을 위한 콘솔 로그
		console.log("사용자 입력 값 (공백 제거):", playerAnswer);
		console.log("정답 값 (공백 제거):", correctAnswer);
	
		if (playerAnswer === correctAnswer) {
			console.log("정답입니다.");
			playAudio(correctSound);
			$(this).closest('.answer-bx').addClass('answered active');
			$('#gameAlertCorrect').modal({ backdrop: 'static' });
		} else {
			console.log("오답입니다.");
			playAudio(wrongSound);
			$(this).closest('.answer-bx').removeClass('answered active');
			$('#gameAlertOX').modal({ backdrop: 'static' });
			$('.alert-correct').find('span').text(correctAnswer); 
			// 정답 표시
		}
	});

	/* 정답 */
	// 전체 정답
	$('[data-toggle=answer-all]').click(function(e){
		var _this = $(this),
			targetObj = $(this.dataset.target);

		!targetObj.length && (targetObj = $('#wrap'));

		targetObj.find('[data-toggle=answer-all]').toggleClass('active');

		if(_this.hasClass('active')){
			//targetObj.find('input[data-answer]').prop('checked',true);
			targetObj.find('.form-answer>input').each(function(){
				this.value = this.dataset.value;
			});
			targetObj.find(toggleActiveContent.join()).addClass('active');
		} else {
			targetObj.find('input').prop('checked',false);
			targetObj.find('.form-answer>input').val('');
			targetObj.find(toggleActiveContent.join()).removeClass('active answered');
		}
	});

	// scroll
	$(".scrolled").each(function(){
		var t = $(this);
		t.mCustomScrollbar({
			theme:"rounded-dark",
			scrollInertia: 0,
			scrollEasing:"linear",
			setTop: 0,
			callbacks:{
				onInit:function(){
					t.mCustomScrollbar('scrollTo', 'top');
					setTimeout(() => {
						// 뷰어에서 인식을 못할 수 있어서 setTimeout으로 추가 제어
						t.mCustomScrollbar('scrollTo', 'top');
					}, 100);
				},
			}
		});
	});

	// swiper
	var swipeBasic = [];
	$('.swiper-basic').each(function(i){
		var t = $(this);
		swipeBasic[i] = new Swiper(t,{
			observer: true,
			observeParents:true,
			pagination:{
				el: t.find('.swiper-pagination'),
				clickable:true,
			},
			simulateTouch : false,
			allowTouchMove : false,
			navigation:{
				nextEl:t.find('.swiper-button-next'),
				prevEl:t.find('.swiper-button-prev'),
			},
			on: {
				init: function(){
					t.attr('data-active', 0);
				},
				slideChange: function(e){
					t.attr('data-active', swipeBasic[i].activeIndex);;
				}
			}
		});
	});

	var swiperPage = [];
	$('.slide-page .swiper-container').each(function(i){
		var t = $(this);
		var effect = t.data('effect') || 'slide';
		swiperPage[i] = new Swiper(t,{
			autoHeight: t.hasClass('auto-height'),
			effect: effect,
			observer: true,
			observeParents:true,
			simulateTouch:false,
			navigation:{
				nextEl: t.parent().find('.swiper-button-next'),
				prevEl: t.parent().find('.swiper-button-prev'),
			},
			pagination:{
				el: t.parent().find('.swiper-pagination'),
				clickable:true,
			},
			on: {
				slideChange: function(e){
					var $v = t.find('video');
					if ($v.length > 0) {
						$v[0].pause();
					}

					// 스크롤바 있는 콘텐츠가 첫번째가 아닌 탭에 있을 경우 뷰어에서 인식을 못해서 추가 제어
					$(".scrolled").mCustomScrollbar('scrollTo', 'top');
				}
			}
		});
	});

	$('[data-toggle="tab"]').click(function() {
		$(".scrolled").mCustomScrollbar('scrollTo', 'top');
	});

	$('.modal').on('shown.bs.modal', function() {
		$(".modal .scrolled").mCustomScrollbar('scrollTo', 'top');
	});

	$('[data-toggle="active"]').click(function(){
		$(this).toggleClass('active');
		this.dataset.target && $(this.dataset.target).toggleClass('active');
	});
});
