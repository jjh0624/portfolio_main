window.onload = function() {
    setTimeout(function() {
         document.body.classList.add('page-open');
    }, 500); 
}
// 오디오 재생

function playAudio(src) {
	const audio = $('#audio')[0];
	audio.pause();
	$('#audio').find('source').attr('src', src);
	audio.load();
	audio.oncanplaythrough = function () {
		audio.play().catch(err => {
			console.warn("Playback failed:", err);
		});
	};
}


var correctSound = '../common/media/correct.mp3';
var wrongSound = '../common/media/wrong.mp3';

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
	$('body').append('<audio id="audio" controls data-dtext_index="dtext_cls_audio" class="position-absolute d-none"><source src="" type="audio/mpeg"></audio><audio id="audio-click" controls data-dtext_index="dtext_cls_audio" class="position-absolute d-none"><source src="common/media/click.mp3" type="audio/mpeg"></audio>');

	$('.custom-check, #ct button:not([data-audio]), [data-toggle="answer"]').click(clickSoundPlay);

	$('.self-check input').change(function(){
		this.checked && clickSoundPlay();
	});

	// 클릭 이벤트
	$(document).on("click", "[data-audio]", function (e) {
		// .btn-answer 클래스가 있으면 무시
		if ($(this).hasClass('btn-answer')) return;

		const src = this.dataset.audio;
		if (src) {
			playAudio(src);
		}
	});

   $('body').on('click', '.btn-toggle', function () {
		if (!$(this).hasClass('active')) {
			$(this).attr('data-audio', '../common/media/click.mp3');
		} else {
			$(this).attr('data-audio', '../common/media/correct.mp3');
		}
	});



	$('.nav li:first-child button, .tab-pane:first-child, .paging>button:first-child').addClass('active');

    // 도입 캐릭터 말풍선
    $("body").on("click",".cha-wrap",function(){
        $('.cha-text').toggleClass('on');
    });

	// 개념 중단원 마무리 버튼
	/*$('body').on('click','.concept-page .page-btn',()=>{
        function goBack(){
            window.history.back();
        }
        goBack();
    });*/
	function goBack(){
		window.history.back();
	}
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

			targetObj.find('.btn-modal-comment').removeClass('d-none');
		} else {
			targetObj.find('input').prop('checked',false);
			targetObj.find('.form-answer>input').val('');
			targetObj.find(toggleActiveContent.join()).removeClass('active answered');

			targetObj.find('.btn-modal-comment').addClass('d-none');
		}
	});

	// $('.img-txt').draggable();

	// scroll
	
	// $(".scrolled").each(function(){
	// 	var t = $(this);
	// 	t.mCustomScrollbar({
	// 		theme:"rounded-dark",
	// 		scrollInertia: 0,
	// 		scrollEasing:"linear",
	// 	});
	// });


    // $("body").on("click", '[data-toggle="modal"]', function(){
	// 	let scrolled = document.getElementsByClassName("scrolled");
    //     scrolled.toggleClass("scrolled");
	// });

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
					t.attr('data-active', swipeBasic[i].activeIndex);
				}
			}
		});
	});

	if ($('#audioBar').length) {
		const audio = document.querySelector("#audioBar audio");
		const playBtn = document.getElementById("btn-play");
		const stopBtn = document.getElementById("btn-stop");
		const seekBar = document.getElementById("seek-bar");
		const volumeBtn = document.getElementById("volume-btn");
		const seekProgress = document.getElementById("seek-progress");

		const defaultPlayImg = "url('../common/img/btn-play_audio.svg')";
		const playingImg = "url('../common/img/btn-stop2.svg')";

		// 초기화
		seekBar.max = 100;
		seekProgress.max = 100;
		playBtn.style.backgroundImage = defaultPlayImg;

		audio.addEventListener("loadedmetadata", () => {
			seekBar.value = 0;
			seekProgress.value = 0;
			updateSeekBar(0);
		});

		// 재생 / 일시정지 토글
		playBtn.addEventListener("click", () => {
			if (audio.paused) {
				audio.play();
				playBtn.style.backgroundImage = playingImg;
			} else {
				audio.pause();
				playBtn.style.backgroundImage = defaultPlayImg;
			}
		});

		// 처음으로 돌아가는 stop 버튼
		stopBtn.addEventListener("click", () => {
			audio.pause();
			audio.currentTime = 0;
			playBtn.style.backgroundImage = defaultPlayImg;
		});

		// 재생이 끝났을 때도 초기화
		audio.addEventListener("ended", () => {
			playBtn.style.backgroundImage = defaultPlayImg;
		});

		// 진행바
		audio.addEventListener("timeupdate", () => {
			const value = (audio.currentTime / audio.duration) * 100;
			seekBar.value = value;
			seekProgress.value = value;
			updateSeekBar(value);
		});

		seekBar.addEventListener("input", () => {
			const value = seekBar.value;
			audio.currentTime = (value / 100) * audio.duration;
			seekProgress.value = value;
			updateSeekBar(value);
		});

		function updateSeekBar(value) {
			seekProgress.style.background = `linear-gradient(to right, #ffd439 0%, #ffd439 ${value}%, transparent ${value}%)`;
		}

		updateSeekBar(0);

		// 음소거
		volumeBtn.addEventListener("click", () => {
			audio.muted = !audio.muted;
			volumeBtn.classList.toggle("muted", audio.muted);
		});
	}

});
