$(function(){
	var correctSound = './common/media/answer.mp3';
	var wrongSound = './common/media/wrong_answer.mp3';
	var completeSound = './media/intro/effect.mp3'
	var puzzle_count = $("#stage1").attr("data-count");

	// 화살표 클릭
	$(".arrow").click(function(){
		puzzle_count = $("#stage1").attr("data-count"); // 최신 값 가져오기
		$("#stage1").addClass("zoom-in");
		$(".char").hide();
		$(".arrow").hide();
		setTimeout(function(){
			$(".dialogue-wrap").fadeIn(300);
		}, 500)

		if (puzzle_count == 0) {
			$("#stage1").attr("data-answer", "4");
			$(".pic-bg2").fadeOut(500);
			$(".pic-bg3").fadeOut(500);
			$(".frame1").addClass("active");
		} else if (puzzle_count == 1) {
			$("#stage1").attr("data-count", "1");
			$("#stage1").attr("data-answer", "3");
			$(".frame2").addClass("active");
		} else if (puzzle_count == 2) {
			$("#stage1").attr("data-count", "2");
			$("#stage1").attr("data-answer", "1");
			$(".text-conts").addClass("md")
			$(".frame3").addClass("active");
		}else if (puzzle_count == 3) {
			$("#stage1").attr("data-count", "3");
			$("#stage1").attr("data-answer", "2");
			$(".frame4").addClass("active");
		}
	})

	// 정답확인
	$(".puzzle-conts").click(function(){
		var answer = $("#stage1").attr("data-answer");
		var question = $(this).attr("data-number");
		$(".arrow-pink").hide();

		if(answer == question){
			playAudio(correctSound);
			$(this).addClass("disabled");
			$(this).find(".show").removeClass("show");
			$(this).find(".puzzle-move").addClass("show active");
			$(this).find(".puzzle-none").addClass("show");
			$(".sparkle-effect").show();
			$(".frame").removeClass("active")
			if(puzzle_count == 0){
				$(".blank1").fadeOut(4000);
			}else if(puzzle_count == 1){
				$(".blank2").fadeOut(4000);
			}else if(puzzle_count == 2){
				$(".blank3").fadeOut(4000);
			}else if(puzzle_count == 3){
				$(".blank4").fadeOut(4000);
			}

			setTimeout(() => {
				$(this).find(".puzzle-move").removeClass("show");
				playAudio(completeSound);
			}, 2000);

			setTimeout(() => {
				$(".puzzle-modal1").removeClass("show");
				$(".btn-wrap").removeClass("is-able");
				$(".puzzle-modal2").addClass("show");
			}, 3000);
		}else{
			// 오답일때
			playAudio(wrongSound);
			$(this).addClass("shake-bottom");

			// 퍼즐 흔들림
			setTimeout(() => {
				$(this).removeClass("shake-bottom");
			}, 500);
		}
	})

	// 다음버튼
	$(".btn-next").click(function(){
		puzzle_count = $("#stage1").attr("data-count");

		$(".sparkle-effect").hide();
		$(".puzzle-modal2").removeClass("show");
		$(".puzzle-modal1").addClass("show");
		if(puzzle_count == 0){
			$("#stage1").attr("data-answer", "3");
			$("#stage1").attr("data-count", "1");
			puzzle_count = 1;
			$(".dialogue-wrap").hide();
			$(".pic-bg1").fadeOut(600);
			$(".pic-bg2").fadeIn(600);
			$(".frame2").addClass("active");

			setTimeout(() => {
				$(".dialogue-wrap").show();
			}, 1000);
		}else if(puzzle_count == 1){
			$("#stage1").attr("data-answer", "1");
			$("#stage1").attr("data-count", "2");
			puzzle_count = 2;
			$(".dialogue-wrap").hide();
			$(".pic-bg2").fadeOut(600);
			$(".pic-bg3").fadeIn(600);
			$(".arrow-pink").show();
			$(".frame3").addClass("active");

			setTimeout(() => {
				$(".dialogue-wrap").show();
			}, 1000);
		}else if(puzzle_count == 2){
			$("#stage1").attr("data-answer", "2");
			$("#stage1").attr("data-count", "3");
			puzzle_count = 3;
			$(".arrow-pink").show();
			$(".frame4").addClass("active");
			// $(".btn-next").removeClass("show").next().addClass("show");
		}else if(puzzle_count == 3){
			$("#finalModal").modal('show');
			$(".btn-reset").show();
		}
	})

	// $(".btn-retry").click(function(){
	// 	$("#stage1").removeClass("zoom-in");
	// 	$(".char").fadeIn(600);
	// 	$(".pic-bg").fadeIn(600);
	// 	$(".dialogue-wrap").hide();
	// 	// $(".btn-reset").show();
	// });

	$(".btn-voice").click(function (event) {
		let puzzle_count = $("#stage1").attr("data-count");

		if (puzzle_count == 0) {
			playMp3_2('./media/intro/15_lee_7-1.mp3', event);
		} else if (puzzle_count == 1) {
			playMp3_2('./media/intro/15_lee_7-2.mp3', event);
		} else if (puzzle_count == 2) {
			playMp3_2('./media/intro/15_lee_7-3.mp3', event);
		} else if (puzzle_count == 3) {
			playMp3_2('./media/intro/15_lee_7-4.mp3', event);
		}
	});

	$(".btn-reset").click(function(){
		reset();
	})

	$(".hd-home").click(function(){
		reset();
	})

	function reset(){
		intro.init();
        $('#ct').attr('data-step' , 'start');
        $('#ct>div#start').addClass('active');
		$('.modal').modal('hide');
        setTimeout(() => {
            $('#startModal').modal('show');
        }, 1000);
		$(".btn-reset").hide();
		$("#stage1").attr("data-count", "0");
		$("#stage1").attr("data-answer", "4");
		$(".puzzle-modal2").removeClass("show").prev().addClass("show");
		$(".puzzle-conts").removeClass("disabled");
		$(".puzzle-conts > img").removeClass("show").removeClass("active");
		$(".puzzle-conts > img:first-child").addClass("show");
		$(".blank").show();
		// $(".btn-retry").removeClass("show").prev().addClass("show");
		$(".text-conts").removeClass("md");
		$(".sparkle-effect").hide();
		$(".frame").removeClass("active");

		// retry
		$("#stage1").removeClass("zoom-in");
		$(".char").fadeIn(600);
		$(".pic-bg").fadeIn(600);
		$(".dialogue-wrap").hide();
	}

	// 마지막 모달
	$(".img-btn").click(function(){
		var thisCount = $(this).index() + 1;

		// 모든 관련 요소의 active 클래스 제거
		$(".img-btn").removeClass("is-active");
		$(".modal_desc_wrp .desc").removeClass("is-active");
		$(".img-frame").removeClass("is-active");

		// 클릭된 요소와 관련된 요소들에 active 클래스 추가
		$(this).addClass("is-active");
		$(".desc_" + thisCount).addClass("is-active");
		$(".img-frame" + thisCount).addClass("is-active");
	});

	// 공통
	var textinterval = false;
    var timeoutclear = false;
    var QuizSound = './media/intro/Quiz.mp3';

	// stage 전환 active
    $('[data-active]').on('click' , function(){
        var stage = $(this).attr('data-active'),
            hint = "#hint1" ,
            nextStage = $('#'+stage).next('div').attr('id');
        $('#messageModal .text-message').text('');

        switch (stage) {
            case 'start':
                intro.start();
                break;

            case 'stage1':
                intro.stage1();
                break;

            case 'finish':
                // 모두 종료
                intro.finish();
                return false ;
                break;
            default:
                break;
        }

        $('#ct').attr('data-step' , stage);
        $('#ct>#'+stage).addClass('active').siblings().removeClass('active');
        $("#secretCode").find('input, button').removeClass('active').attr('tabindex','-1');
        $('#secretCode .icon-hint').attr('data-target', hint);
        $('#secretCode .icon-next').attr('data-active', nextStage);
    });

	$('[data-input]').on('click , keypress' , function(e){
        e.preventDefault(); e.stopPropagation(); // keypress 시 click 중복방지
        // console.log(e.type)
        var tg = $(this).data('input') ,
            inputval = $(this).data('value');
        $(tg).val(inputval);

        playAudio(clickSound);
    });

	var intro = {
        init: function(){
            mediaStop();
            textinterval = false;
            timeoutclear = false;
            $('#ct>div').find('.active').removeClass('active');
            $('#ct>div').find('.finish').removeClass('finish');
            $('.stage4-wrap').removeClass('move');
            $('#stage3 .tank , .screen').html('');
            $('#ct').find('input, button').attr('tabindex','-1');
            $('input[type=text]').val('');
            $('.modal').modal('hide');
        },
        start: function(){
            intro.init();
            $('#ct').attr('data-step' , 'start');
            $('#ct>div#start').addClass('active');
            setTimeout(() => {
                $('#startModal').modal('show');
                // $('#finalModal').modal('show');
            }, 1000);
        },
        stage1: function(){
            $('#startModal').modal('hide');
            timeoutclear = true;
            if (timeoutclear) {
                $('#stage1').addClass('active');
                $('#stage1').fadeOut(400, function() {
                    $(this).css('background-image', 'url(./img/intro/bg.jpg)').fadeIn(200);
                });
                // $('.sticker-popup').addClass('active')
                $('.arrow').delay(600).fadeIn();
            }
        },
        answer: function(){
            // 정답확인
            var correct = true ;
            $('#secretCode input').each(function(){
                if ( $(this).val() != $(this).data('answer') ) correct = false ;
            });

            if (correct){ // 정답
                $('#correctModal').modal('show');
                playAudio(correctSound);
            } else { // 오답
                $('#wrongModal').modal('show');
                playAudio(wrongSound);
            }
        },
        finish: function(){
            // 성공완료
            $('.modal').modal('hide');
            $('#stage4').addClass('finish');
            $('#secretCode , #secretCode input').removeClass('active');
            $("#secretCode").find('input, button').attr('tabindex','-1');

            timeoutclear = true ;
            setTimeout(() => { // 문열기 효과음
                if (timeoutclear) playAudio(DoorSound);
            }, 2500);
            setTimeout(() => { // 성공모달 열기
                if (timeoutclear) {
                    $('#successModal').modal('show');
                    playAudio(successSound);
                 }
            }, 5500);
        },
    };

    intro.start();
})

// 전역 변수로 현재 재생 중인 오디오 관리
let currentAudio = null;

function playMp3(audioSrc, event) {
	console.log('playMp3 function called');
	console.log('audioSrc:', audioSrc);
	console.log('event:', event);

	const $audioMessage = $(event.target).closest('li').find('span.audio-message');
	const $btnWrap = $('.btn-wrap');

	// 현재 재생 중인 오디오가 있다면 정지
	if (currentAudio) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
		// 이전 이벤트 리스너 제거
		currentAudio.removeEventListener('play', null);
		currentAudio.removeEventListener('ended', null);
		currentAudio.removeEventListener('error', null);
	}

	// 새로운 오디오 객체 생성
	currentAudio = new Audio(audioSrc);

	// 오디오 재생 시작 시 text-red 클래스 추가
	currentAudio.addEventListener('play', function() {
		console.log('Audio play started');
		$audioMessage.addClass('text-red');
	});

	// 오디오 재생 종료 시 text-red 클래스 제거
	currentAudio.addEventListener('ended', function() {
		console.log('Audio play ended');
		$audioMessage.removeClass('text-red');
		currentAudio = null;
		$btnWrap.addClass('is-able');
	});

	// 오디오 재생 오류 확인
	currentAudio.addEventListener('error', function(e) {
		console.error('Audio error:', e);
		currentAudio = null;
	});

	currentAudio.play().catch(function(error) {
		console.error('Error playing audio:', error);
		currentAudio = null;
	});
}

function playMp3_2(audioSrc, event) {
	console.log('playMp3 function called');
	console.log('audioSrc:', audioSrc);
	console.log('event:', event);
	const $btnWrap = $('.btn-wrap');
	let puzzle_count_2 = $("#stage1").attr("data-count");
	let puzzle_count_3 = parseInt(puzzle_count_2);
	let puzzle_count_4 = puzzle_count_3 + 1;

	// 현재 재생 중인 오디오가 있다면 정지
	if (currentAudio) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
		currentAudio.removeEventListener('play', null);
		currentAudio.removeEventListener('ended', null);
		currentAudio.removeEventListener('error', null);
	}

	// 새로운 오디오 객체 생성
	currentAudio = new Audio(audioSrc);

	// 오디오 재생 시작 시 text-red 클래스 추가
	currentAudio.addEventListener('play', function() {
		console.log('Audio play started');
		$(".text-list li:nth-child(" + puzzle_count_4 + ")").addClass("text-red");
	});

	// 오디오 재생 종료 시 text-red 클래스 제거
	currentAudio.addEventListener('ended', function() {
		console.log('Audio play ended');
		$(".text-list li:nth-child(" + puzzle_count_4 + ")").removeClass("text-red");
		$btnWrap.addClass('is-able');
		currentAudio = null;
	});

	// 오디오 재생 오류 확인
	currentAudio.addEventListener('error', function(e) {
		console.error('Audio error:', e);
		currentAudio = null;
	});

	currentAudio.play().catch(function(error) {
		console.error('Error playing audio:', error);
		currentAudio = null;
	});
}

function playMp3_3(audioSrc, event) {
	console.log('playMp3 function called');
	console.log('audioSrc:', audioSrc);
	console.log('event:', event);

	const $audioMessage = $(event.target);

	// 현재 재생 중인 오디오가 있다면 정지
	if (currentAudio) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
		currentAudio.removeEventListener('play', null);
		currentAudio.removeEventListener('ended', null);
		currentAudio.removeEventListener('error', null);
	}

	// 새로운 오디오 객체 생성
	currentAudio = new Audio(audioSrc);

	// 오디오 재생 시작 시 text-red 클래스 추가
	currentAudio.addEventListener('play', function() {
		console.log('Audio play started');
		$audioMessage.addClass("text-red");
		$(".last.btn-reset").addClass("is-disable");
	});

	// 오디오 재생 종료 시 text-red 클래스 제거
	currentAudio.addEventListener('ended', function() {
		console.log('Audio play ended');
		$audioMessage.removeClass("text-red");
		currentAudio = null;
		$(".last.btn-reset").removeClass("is-disable");
	});

	// 오디오 재생 오류 확인
	currentAudio.addEventListener('error', function(e) {
		console.error('Audio error:', e);
		currentAudio = null;
	});

	currentAudio.play().catch(function(error) {
		console.error('Error playing audio:', error);
		currentAudio = null;
	});
}