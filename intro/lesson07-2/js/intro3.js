$(function(){ 
	$(".speaker").on("mouseover", function(){
		$(".dialogue-list li").css({"color" : "red"});
	})
	$(".speaker").on("mouseleave", function(){
		$(".dialogue-list li").css({"color" : "#000"});
	})

	$(".arrow").click(function(){
		var count = $("#stage1").attr("data-count");
		var count_num = parseInt(count);
		var count2 = count_num + 1;

		$(".arrow").hide();
		$(".map").show();
		answerChk();
		$(".drag-area > li:nth-child(" + count2 + ") .drag-item").addClass("light");
		console.log(count2)
		
		if(count == 0){
			$("#stage1").addClass("first-puzzle");
			$("#stage1").attr("data-count", "1");
			$("#stage1").attr("data-quiz", "1");
		}else if(count == 1){
			$("#stage1").addClass("second-puzzle");
			$("#stage1").attr("data-count", "2");
			$("#stage1").attr("data-quiz", "2");
		}else if(count == 2){
			$("#stage1").addClass("third-puzzle");
			$("#stage1").attr("data-count", "3");
			$("#stage1").attr("data-quiz", "3");
		}else if(count == 3){
			$("#stage1").addClass("third-puzzle");
			$("#stage1").attr("data-count", "4");
			$("#stage1").attr("data-quiz", "4");

			$(".btn-area").addClass("finish");
		}else if(count == 4){
			$("#stage1").addClass("third-puzzle");

			$(".btn-area").addClass("finish");
		}
	})

	function answerChk() {
		// 기존에 등록된 클릭 이벤트 핸들러를 제거한 후 새로 등록
		$(".map .drag-item").off("click").on("click", function () {
		  const main_data = $("#stage1").attr("data-quiz");
		  const number_count = $("#stage1").attr("data-count");
		  const answer_chk = $(this).attr("data-drag");
	  
		  console.log("현재 number_count 값:", number_count);  // 디버깅용 로그
	  
		  if (!number_count) {
			console.error("number_count 값이 없음");
			return;
		  }

		  if(number_count == 4){
			$(".btn-area").addClass("finish");
			// $(".btn-replay").show();
			}
	  
		  if (main_data == answer_chk) {
			// 정답일때
			playAudio(correctSound); 
			$(this).parent(".drag-obj").addClass("on");
			setTimeout(function(){
				$(".puzzle-answer > li:nth-child(" + number_count + ")").addClass("active");

				setTimeout(function(){
					$(".drag-area > li:nth-child(" + answer_chk + ") .drag-item").hide();
				}, 1000)

				setTimeout(function(){
					$(".map.dialogue").addClass("finish").show();
					$(".dialogue-list li:nth-child(" + number_count + ")").addClass("finish");
				})
			}, 2500)
		  } else {
			// 오답일때
			playAudio(wrongSound);
			$(this).addClass("shake-bottom");
			
			// 퍼즐 흔들림
			setTimeout(() => {
				$(this).removeClass("shake-bottom");
			}, 500);
		  }
		});
	  }

	// 돌아가기 버튼
	$(".backBtn").click(function(){
		var count = $("#stage1").attr("data-count");
		$("#stage1").removeClass().addClass("active");
		$(".map").hide();
		$(".dialogue-list li").removeClass("finish");
		$(".map.dialogue").hide().removeClass("finish");

		$(".btn-replay").show();

		// console.log(count);
		// if(count == 1){
		// 	$(".arrow").css({"top" : "470px", "left" : "500px"}).delay(600).fadeIn();
		// }else if(count == 2){
		// 	$(".arrow").css({"top" : "416px", "left" : "1382px"}).delay(600).fadeIn();
		// 	$("#stage1").attr("data-count", "2");
		// 	$("#stage1").attr("data-quiz", "2");
		// }else if(count == 3){
		// 	$(".arrow").css({"top" : "416px", "left" : "1382px"}).delay(600).fadeIn();
		// 	$("#stage1").attr("data-count", "3");
		// 	$("#stage1").attr("data-quiz", "3");
		// }else if(count == 4){
		// 	$(".arrow").css({"top" : "416px", "left" : "1382px"}).delay(600).fadeIn();
		// 	$("#stage1").attr("data-count", "4");
		// 	$("#stage1").attr("data-quiz", "4");
		// }
	})

	// 다음 버튼
	$(".nextBtn").click(function(){
		var count = $("#stage1").attr("data-count");
		var count_num = parseInt(count);
		var count2 = count_num + 1;

		$(".dialogue-list li").removeClass("finish");
		$(".map.dialogue").hide().removeClass("finish");
		$(".drag-area > li:nth-child(" + count2 + ") .drag-item").addClass("light");
		console.log(count2)

		if(count == 1){
			$("#stage1").removeClass("first-puzzle");
			$("#stage1").addClass("second-puzzle");
			$("#stage1").attr("data-count", "2");
			$("#stage1").attr("data-quiz", "2");
		}else if(count == 2){
			$("#stage1").removeClass("second-puzzle");
			$("#stage1").addClass("third-puzzle");
			$("#stage1").attr("data-count", "3");
			$("#stage1").attr("data-quiz", "3");
		}else if(count == 3){
			$("#stage1").addClass("third-puzzle");
			$("#stage1").attr("data-count", "4");
			$("#stage1").attr("data-quiz", "4");
		}
	})

	// a새로고침 막기
	$('a').click(function(e) {
		e.preventDefault();
	  });


	// 리셋
	$(".btn-replay").click(function(){
		resetAll();
	})

	$(".hd-home").click(function(){
		resetAll();
	})

	function resetAll(){
		$(".btn-replay").hide();
		$(".btn-area").show();
		$('#ct').attr('data-step' , 'start');
        $('#ct>div#start').addClass('active');
		$(".arrow").css({"top" : "182px", "left" : "800px"});
		$("#stage1").attr("data-count", "0");
		$("#stage1").attr("data-quiz", "0");
		$("#stage1").attr("data-drag", "0");
		$(".map").hide();
		
		$(".drag-item").show().removeClass("light");
		$(".drag-obj").removeClass("on");
		$(".puzzle-answer > li").removeClass("active");

		$(".dialogue-list li").removeClass("finish");
		$(".map.dialogue").hide().removeClass("finish");
        setTimeout(() => {
			$("#stage1").removeClass().addClass("active");
            $('#startModal').modal('show');
        }, 1000);
	}


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