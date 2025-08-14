 $(function(){
    var textinterval = false;
    var timeoutclear = false;
    var QuizSound = './media/intro/Quiz.mp3';

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
			console.log("시작")
            intro.init();
			$('#ct').attr('data-step', 'start');
            $('#ct>div#start').addClass('active');
            setTimeout(() => {
				$("#stage1").removeClass("first-count");
                $('#startModal').modal('show');
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
                // $('.click-icon').delay(600).fadeIn();
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


	let allow_next = 0;
	let click_count = 0;
	var sound1_1 = './media/intro/1.mp3'
	var sound2_1 = './media/intro/2.mp3'
	var sound3_1 = './media/intro/3.mp3'
	var sound4_1 = './media/intro/4.mp3'

	$("#btnStart").click(function(){
		$(".click-icon").show();
	})

	function click_action(){
		$('.click-icon').click(function() {

			answerChk();
			$(".click-icon").hide();
			$(".sticker-popup").addClass("active");

            if(click_count === 0){
				$(".dialogue:nth-child(1) span").addClass("light-animation");
				$(".click-icon").hide()
				$("#stage1").addClass("first-count").attr("data-quiz", "2").attr("data-count", "1");
				click_count = 1;
				allow_next = 0;

				setTimeout(function(){
					playAudio(sound1_1);
					$(".dialogue1").addClass("active");
					$(".bubble1").addClass("active");
					$(".pic3").addClass("active");

					setTimeout(function(){
						$(".pic2").addClass("active");

						setTimeout(function(){
							$(".pic1").addClass("active");
						}, 200)
					}, 300)
				}, 500);

			}else if(click_count === 1){
				$(".dialogue:nth-child(2) span").addClass("light-animation");
				$(".click-icon").hide();
				$("#stage1").addClass("second-count").attr("data-quiz", "1").attr("data-count", "2");
				part2_start();
				click_count = 2;
				setTimeout(function(){
					playAudio(sound2_1);
					$(".dialogue2").addClass("active");
					$(".bubble2").addClass("active");
				}, 500);
			}else if(click_count === 2){
				$(".dialogue:nth-child(3) span").addClass("light-animation");
				$(".click-icon").hide();
				$("#stage1").addClass("third-count").attr("data-quiz", "3").attr("data-count", "3");
				part3_start();
				click_count = 3;
				setTimeout(function(){
					playAudio(sound3_1);
					$(".dialogue3").addClass("active");
					$(".bubble3").addClass("active");
				}, 500);
			}else if(click_count === 3){
				$(".dialogue:nth-child(4) span").addClass("light-animation");
				$(".click-icon").hide();
				$("#stage1").addClass("four-count").attr("data-quiz", "4").attr("data-count", "4");
				part4_start();
				click_count = 4;
				setTimeout(function(){
					playAudio(sound4_1);
					$(".dialogue4").addClass("active");
					$(".bubble4").addClass("active");
				}, 500);
			}
        });
	}

	click_action();

	//  정답체크
	function answerChk() {
		// 기존에 등록된 클릭 이벤트 핸들러를 제거한 후 새로 등록
		$(".box-area > dl").off("click").on("click", function () {
		  const main_data = $("#stage1").attr("data-quiz");
		  const number_count = $("#stage1").attr("data-count");
		  const answer_chk = $(this).attr("data-answer");
		  var correctSound = './common/media/answer.mp3'
		  var wrongSound = './common/media/wrong_answer.mp3'
		  allow_next = 1;

		  console.log("현재 number_count 값:", number_count);  // 디버깅용 로그

		  if (!number_count) {
			console.error("number_count 값이 없음");
			return;
		  }

		  if (main_data == answer_chk) {
			// 정답일때
			$(".dialogue" + number_count).addClass("correct");
			$(".soundBtn" + number_count).addClass("correct");
			playAudio(correctSound);
		  } else {
			// 오답일때
			playAudio(wrongSound);
		  }
		});
	  }


	// 다음으로
	$(".to-nextStage").click(function(){
		$(".dialogue span").removeClass("light-animation");
		$(".to-nextStage").removeClass("is-able");
		if(allow_next == 1){
			screenReset();
			$(".title").css({"top" : "69px", "left" : "0"});
			if($("#stage1").attr("data-count") == 1){
				$('.click-icon').css({"top" : "792px", "left" : "577px"}).show().delay(600).fadeIn();
			}else if($("#stage1").attr("data-count") == 2){
				$('.click-icon').css({"top" : "605px", "left" : "1282px"}).show().delay(600).fadeIn();
			}else if($("#stage1").attr("data-count") == 3){
				$('.click-icon').css({"top" : "409px", "left" : "1517px"}).show().delay(600).fadeIn();
			}else if($("#stage1").attr("data-count") == 4){
				screenReset();
				part5_start()
			}
		}else{

		}

	})
	// 리셋
	function screenReset(){
		$(".sticker-popup").removeClass("active");
		$("#stage1").removeClass().addClass("active");
		allow_next = 0;
	}

	$("#btnStart").click(function(){
		playAudio('./media/intro/bg.mp3')
	})

	// part2 시작
	function part2_start(){
		$(".sticker-popup").css({"top" : "414px"});
		$(".title").css({"top" : "409px"});
	}

	// part3 시작
	function part3_start(){
		$(".sticker-popup").css({"top" : "345px", "left" : "1478px"});
		$(".title").css({"top" : "339px", "left":"618px"});
	}

	// part4 시작
	function part4_start(){
		$(".sticker-popup").css({"top" : "83px", "left" : "1613px"});
		$(".title").css({"top" : "70px", "left":"746px"});
	}

	function part5_start() {
		$(".title").css({ "top": "69px", "left": "12px" });

		setTimeout(() => {
		  $('#modal_finish').modal('show'); // 모달 열기
		}, 1000);
	  }

	$('#vodModal1 .icon-vod').on('click', function() {
        $(this).toggleClass('on');
    });

	$('#vodModal1 .icon-vtt').on('click', function() {
		console.log("넣음")
		$('#vodModal1 .video-js').addClass('is-caption');
	});

	$('#vodModal1 .icon-script').on('click', function() {
        // 가장 가까운 .video-container 내의 .vod-script 요소를 찾기
        var vodScript = $(this).closest('.modal-content').find('.vod-script');

        if (vodScript.length > 0) {
            vodScript.toggleClass('active'); // active 클래스 토글
        } else {
            console.error("vod-script 요소를 찾을 수 없습니다."); // 요소가 없을 경우 에러 로그
        }
    });

	// const player = videojs.getPlayer("mainVod1");
	const player2 = videojs("mainVod1");

	// VTT 자막 버튼 이벤트
	$('#vodModal .icon-vtt').on('click', function() {
		const tracks = player2.textTracks();
		console.log(tracks);
		for (let i = 0; i < tracks.length; i++) {
			if (tracks[i].kind === 'subtitles') {
			tracks[i].mode = tracks[i].mode === 'showing' ? 'hidden' : 'showing';
			$(this).toggleClass('on');
			$(".vjs-text-track-display").css({"display" : "block"});
			}
		}
	});

	// 스크립트 표시 버튼 이벤트
	$('#vodModal .icon-script').on('click', function() {
		$('.vod-script').toggleClass('show');
		$(this).toggleClass('on');
	});

	$("#vodModal .icon-script").click(function(){
		$(this).toggleClass('on');
	})

	player2.ready(function() {
		player2.on("ended", function() {
			console.log("영상 재생이 완료되었습니다.");
			$(".no-style.img-button.btn-reset").addClass("active");
		});
	});

	var stopBtn = 0;
	$('.vjs-text-track-display').on('click', function() {
		if(stopBtn == 0){
			player2.pause();
			stopBtn = 1;

			console.log("stopBtn = 0")
		}else{
			player2.play();
			stopBtn = 0;

			console.log("stopBtn = 1")
		}
		
	});

	// 마지막 모달
	$(".img-btn").click(function(){
		var thisCount = $(this).index() + 1;
		console.log("지금 인덱스는" + this)

		$(".img-btn").removeClass("is-active");
		$(".modal_desc_wrp .desc").removeClass("is-active");
		$(this).addClass("is-active");
		$(".desc_" + thisCount).addClass("is-active");
		// $(".modal_desc_wrp").addClass("is-active");
	});

	//   function video_event(){
	// 	// videojs 플레이어 인스턴스 가져오기
	// 	const player = videojs.getPlayer("mainVod1");
	// 	let buttonHideTimer;

	// 	if (player) {
	// 		// 플레이어 준비 완료 이벤트에 반응
	// 		player.ready(function() {
	// 			// 강제로 일시정지 및 시작 위치 설정
	// 			player.pause();
	// 			player.currentTime(0);

	// 			// 재생 시도를 지속적으로 중단
	// 			const preventAutoplay = function() {
	// 				player.pause();
	// 				console.log("자동 재생 차단됨");
	// 			};

	// 			// 모든 재생 이벤트 감시
	// 			player.on('play', preventAutoplay);

	// 			// 기본 재생 버튼 클릭 이벤트
	// 			const playButton = player.controlBar.getChild('PlayToggle');
	// 			if (playButton && playButton.el_) {
	// 				playButton.el_.addEventListener('click', function userClickedPlay() {
	// 					console.log("사용자가 직접 재생 버튼을 클릭함");
	// 					player.off('play', preventAutoplay); // 감시 제거
	// 					setTimeout(() => player.play(), 50); // 약간의 지연 후 재생
	// 					playButton.el_.removeEventListener('click', userClickedPlay);

	// 					// 재생 상태에 따라 버튼 상태 관리
	// 					updateButtonVisibility();
	// 				});
	// 			}

	// 			// 버튼 가시성 업데이트 함수
	// 			function updateButtonVisibility() {
	// 				clearTimeout(buttonHideTimer);

	// 				if (player.paused()) {
	// 					// 일시정지 상태일 때는 재생 버튼 표시
	// 					$('.play-btn').addClass('show');
	// 					$('.stop-btn').removeClass('show');
	// 				} else {
	// 					// 재생 중일 때는 정지 버튼 표시 (마우스 호버 시)
	// 					if ($('.video-js:hover').length > 0) {
	// 						$('.stop-btn').addClass('show');
	// 						$('.play-btn').removeClass('show');
	// 					} else {
	// 						// 호버 아닐 때는 모든 버튼 숨김
	// 						$('.stop-btn, .play-btn').removeClass('show');
	// 					}
	// 				}

	// 				// 재생 중이면 일정 시간 후 버튼 숨기기
	// 				if (!player.paused()) {
	// 					buttonHideTimer = setTimeout(function() {
	// 						$('.stop-btn, .play-btn').removeClass('show');
	// 					}, 2000); // 2초 후 버튼 숨김
	// 				}
	// 			}

	// 			// 비디오 플레이어에 마우스 이벤트 추가
	// 			$('.video-js').on('mouseenter', function() {
	// 				if (!player.paused()) {
	// 					// 재생 중일 때 마우스 호버 시 정지 버튼 표시
	// 					$('.stop-btn').addClass('show');

	// 					// 일정 시간 후 버튼 숨김 설정
	// 					clearTimeout(buttonHideTimer);
	// 					buttonHideTimer = setTimeout(function() {
	// 						$('.stop-btn').removeClass('show');
	// 					}, 2000); // 2초 후 버튼 숨김
	// 				}
	// 			});

	// 			$('.video-js').on('mouseleave', function() {
	// 				if (!player.paused()) {
	// 					// 재생 중 마우스가 벗어나면 일정 시간 후 버튼 숨김
	// 					clearTimeout(buttonHideTimer);
	// 					buttonHideTimer = setTimeout(function() {
	// 						$('.stop-btn').removeClass('show');
	// 					}, 500); // 0.5초 후 버튼 숨김
	// 				}
	// 			});

	// 			// 커스텀 재생/정지 버튼 이벤트 추가
	// 			$('.btn-vodclick').on('click', function() {
	// 				if (player.paused()) {
	// 					// 재생 시작
	// 					player.off('play', preventAutoplay); // 감시 제거
	// 					player.play();
	// 				} else {
	// 					// 정지
	// 					player.pause();
	// 				}

	// 				// 버튼 상태 업데이트
	// 				updateButtonVisibility();
	// 			});

	// 			// 재생 상태 변경 이벤트
	// 			player.on('play', function() {
	// 				updateButtonVisibility();
	// 			});

	// 			player.on('pause', function() {
	// 				updateButtonVisibility();
	// 			});

	// 			// 영상이 끝났을 때 이벤트
	// 			player.on('ended', function() {
	// 				console.log("영상 재생이 완료되었습니다.");
	// 				// 재생 버튼 표시
	// 				$('.stop-btn').removeClass('show');
	// 				$('.play-btn').addClass('show');
	// 				// 여기에 영상 종료 시 실행할 코드 추가
	// 				// 예: $('#vodModal').modal('hide');
	// 			});

	// 			// 재생 중 특정 시간에 이벤트 발생시키기
	// 			player.on('timeupdate', function() {
	// 				const currentTime = player.currentTime();

	// 				// 예: 10초 지점에서 특정 액션 실행
	// 				if (currentTime >= 10 && currentTime < 10.5) {
	// 					console.log("10초 지점에 도달했습니다.");
	// 					// showSpecialContent();
	// 				}
	// 			});

	// 			// VTT 자막 버튼 이벤트
	// 			$('.icon-vtt').on('click', function() {
	// 				const tracks = player.textTracks();
	// 				 console.log(tracks);
	// 				for (let i = 0; i < tracks.length; i++) {
	// 					if (tracks[i].kind === 'subtitles') {
	// 						tracks[i].mode = tracks[i].mode === 'showing' ? 'hidden' : 'showing';
	// 						$(this).toggleClass('on');
	// 						$(".vjs-text-track-display").css({"display" : "block"});
	// 					}
	// 				}
	// 			});

	// 			// 스크립트 표시 버튼 이벤트
	// 			$('.icon-script').on('click', function() {
	// 				$('.vod-script').toggleClass('show');
	// 				$(this).toggleClass('on');
	// 			});

	// 			// 초기 버튼 상태 설정
	// 			updateButtonVisibility();
	// 		});

	// 		// 모달 닫힐 때 이벤트 정리
	// 		$('#vodModal').on('hidden.bs.modal', function() {
	// 			if (player) {
	// 				player.pause();
	// 				// 모든 관련 이벤트 리스너 제거
	// 				player.off('ended');
	// 				player.off('timeupdate');
	// 				player.off('play');
	// 				player.off('pause');

	// 				// 타이머 정리
	// 				clearTimeout(buttonHideTimer);

	// 				// 버튼 UI 초기화
	// 				$('.stop-btn').removeClass('show');
	// 				$('.play-btn').addClass('show');

	// 				// 스크립트 숨기기
	// 				$('.vod-script').removeClass('show');
	// 				$('.icon-script').removeClass('on');
	// 				$('.icon-vtt').removeClass('on');
	// 			}
	// 		});

	// 		// 모달 열릴 때 이벤트
	// 		$('#vodModal').on('shown.bs.modal', function() {
	// 			// 플레이어 재설정
	// 			player.pause();
	// 			player.currentTime(0);

	// 			// UI 초기화
	// 			$('.stop-btn').removeClass('show');
	// 			$('.play-btn').addClass('show');
	// 			$('.vod-script').removeClass('show');
	// 			$('.icon-script').removeClass('on');
	// 			$('.icon-vtt').removeClass('on');
	// 		});
	// 	}
	// }

	// 영상 끄면
	// $("#vodModal .icon-close").click(function(){
	// 	$(".btn-reset").addClass("active");
	// })



	// 전체 리셋
	function part_reset(){
		$('.click-icon').css({"top" : "479px", "left" : "518px"});
		$("#stage1").removeClass().addClass("active").attr("data-quiz", "2").attr("data-count", "1");
		$(".sticker-popup").removeClass("active").css({"left" : "883px", "top" : "88px"});
		$(".title").css({"top":"69px", "left":"12px"})
		$(".dialogue").removeClass("active").removeClass("correct");
		$(".bubble").removeClass("active");
		$(".pic").removeClass("active");
		$("#vodModal .icon-close").click();

		// 다음 버튼
		$(".to-nextStage").removeClass("is-able");

		// 마지막 모달
		$(".img-btn").removeClass("is-active");
		$(".modal_desc_wrp .desc").removeClass("is-active");

		click_count = 0;
		allow_next = 0;
	}
	$(".btn-reset").click(function(){
		reset_all()
	})

	function reset_all(){
		$('#ct').attr('data-step' , 'start');
		$('#ct>div#start').addClass('active');
		$(".btn-reset").removeClass("active");
		part_reset();
		click_count = 0;
		setTimeout(() => {
			$('#startModal').modal('show');
		}, 1000);
		console.log(click_count)
	}

	// 버튼 hover
	$(".soundBtn").mouseover(function(){
		$(this).addClass("hover");
	})
	$(".soundBtn").mouseleave(function(){
		$(this).removeClass("hover");
	})

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


	$('#vodModal .icon-close').off('click').on('click', function() {
		var $modal = $(this).closest('#vodModal');
		var player = videojs($modal.find('.video-js')[0]);
		var tracks = player.textTracks();

		if (tracks && tracks.length > 0) {
			for (var i = 0; i < tracks.length; i++) {
				tracks[i].mode = 'hidden'; // 자막 완전히 꺼서 초기화
			}
		}

		player.pause();
		player.currentTime(0);

		// UI 초기화 - 'on' 클래스 완전히 제거
		$modal.find('.icon-vtt').removeClass('on');
		$modal.find('.video-js').removeClass('is-caption');
		$modal.find('.icon-script').removeClass('on')
		$modal.find('.vod-script').removeClass('active')
		console.log("모달 닫힘: 'on' 클래스 제거 및 자막 초기화");
	});

	// 모달이 열릴 때 (shown.bs.modal) - 자막 숨기기
	$('#vodModal').on('shown.bs.modal', function() {
		var $modal = $(this);
		var player = videojs($modal.find('.video-js')[0]);
		var tracks = player.textTracks();
		if (tracks && tracks.length > 0) {
			for (var i = 0; i < tracks.length; i++) {
				tracks[i].mode = 'hidden'; // 자막 숨기기 (로드는 유지)
			}
		}

		// 'on' 클래스 제거해 초기 상태로
		$modal.find('.icon-vtt').removeClass('on');
		console.log("모달 열림: 'on' 클래스 제거 및 자막 숨기기");
	});

	$('#vodModal').on('click', '.icon-vtt', function() {
		var $modal = $(this).closest('#vodModal');
		var player = videojs($modal.find('.video-js')[0]);

		$(this).toggleClass('on');
		var isOn = $(this).hasClass('on');
		console.log("on 클래스 상태:", isOn);

		var tracks = player.textTracks();
		if (tracks && tracks.length > 0) {
			for (var i = 0; i < tracks.length; i++) {
				if (tracks[i].kind === 'subtitles' || tracks[i].kind === 'captions') {
					tracks[i].mode = isOn ? 'showing' : 'hidden';
					console.log("자막 상태 변경됨:", tracks[i].mode);
				} else {
					console.log("필터링된 트랙 종류:", tracks[i].kind);
				}
			}
		}
		var $textTrackDisplay = $modal.find('.vjs-text-track-display');
		if (isOn) {
			$textTrackDisplay.css('display', 'block');
		} else {
			$textTrackDisplay.css('display', 'none');
		}
	});

});

// 전역 변수로 현재 재생 중인 오디오 관리
let currentAudio = null;

function playMp3(audioSrc, event) {
	console.log('playMp3 function called');
	console.log('audioSrc:', audioSrc);
	console.log('event:', event);

	const $audioMessage = $(event.target);

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
		$audioMessage.removeClass('light-animation');
		$(".ch-modal-btn-wrp").addClass("is-disable")
	});

	// 오디오 재생 종료 시 text-red 클래스 제거
	currentAudio.addEventListener('ended', function() {
		console.log('Audio play ended');
		$audioMessage.removeClass('text-red');
		$audioMessage.addClass('light-animation');
		$(".to-nextStage").addClass("is-able");
		$(".ch-modal-btn-wrp").removeClass("is-disable");
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