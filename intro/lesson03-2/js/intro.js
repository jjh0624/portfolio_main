
var bgm_bg = './media/bg.mp3';

$(document).ready(function () {
	$(".btn-replay").hide();
    $("#startModal").modal('hide');
    $("#stage .stage-box").hide();

    setTimeout(function () {
        $("#startModal").modal('show');
    }, 1000);

    // btnStart 클릭 이벤트 핸들러
    $("#btnStart").on("click", function() {
        $(".modal-backdrop").css("opacity", "0");

        $("#startModal").modal('hide');
        $("#stage .stage-box").show();
		playAudio(bgm_bg);

        $("#startModal").on('hidden.bs.modal', function () {
            $("#stage").show();
            $(".modal-backdrop").remove();
        });
    });
});


var voice_01 = './media/11_lee_3-1.mp3'
var voice_02 = './media/11_lee_3-2.mp3'
var voice_03 = './media/11_lee_3-3.mp3'
var voice_04 = './media/11_lee_3-4.mp3'
var voice_05 = './media/11_lee_3-5.mp3'

$(document).ready(function () {
	// 글자 색
	$("#stageModal2 .btn-audio").click(function(){
		$(this).prev().toggleClass("text-red");
	})

    $("#stageModal, #stageModal2").hide();
    const answers = {
        0: ['b', 'a', 'k', 'e', 'r'], // baker
        1: ['s', 'i', 'n', 'g', 'e', 'r'], // singer
        2: ['a', 'r', 't', 'i', 's', 't'], // artist
        3: ['d', 'o', 'c', 't', 'o', 'r'], // doctor
        4: ['d', 'r', 'i', 'v', 'e', 'r']  // driver
    };

    let currentQuestion = 0; // 현재 질문 인덱스
    let correctInputs = 0; // 맞춘 입력 개수
    let popupPositionLeft = 659;
    let popupOpen = false; // 팝업이 열려 있는지 여부
    let hintOpen = false;  // 힌트 상태 변수

    // 힌트 버튼 클릭 시 힌트 모달 열기/닫기
    $(".btn-hint").on("click", function () {
        if (hintOpen) {
            $("#hintModal").fadeOut(100);
            hintOpen = false;
        } else {
            $("#hintModal").fadeIn(100);
            hintOpen = true;
        }
    });

	$(".btn-hint").click(function(){
		var currentCount = $("#stage").attr("data-count")

		if(currentCount == 0){
			playAudio(voice_01);
		}else if(currentCount == 1){
			playAudio(voice_02);
		}else if(currentCount == 2){
			playAudio(voice_03);
		}else if(currentCount == 3){
			playAudio(voice_04);
		}else if(currentCount == 4){
			playAudio(voice_05);
		}
	})

	$(".btn-click").on("click", function () {
		let currentCount = $("#stage").attr("data-count");
		console.log("누름!!!!!!!!!!!!!!!!!!!!!")
		if(currentCount == 2){
			// $(".stage-box").css({"top":"220px", "left":"5px"}).addClass("small");
			console.log("바뀜!!!!!!!!!!!!!!!!!!!!!")
			$(".prev-text").text("I'm an");
		}else if(currentCount == 3){
			// $(".stage-box").css({"top":"44px", "left":"244px"}).addClass("small");
			$(".prev-text").text("I'm a");
		}else if(currentCount == 4){
			$(".prev-text").text("I'm a bus ");
		}else{
			$(".prev-text").text("I'm a");
		}
        btn_click();
    });

	$(".alp-click").click(function(){
		$(this).next().next().addClass("dasdas").click();
	})

	function btn_click(){
		let currentCount = parseInt($("#stage").attr("data-count"), 10);

        if (currentCount >= 0) {
            $("#stage").removeClass("zoom-out");
            $("#stage").addClass("zoom-in");
            $(".btn-click").fadeOut(100);
            setTimeout(function(){
				$("#stageModal").fadeIn(1500);
			}, 1500)

			// 정답처리로직
			$(".alphabet-val input").off("click").on("click", function () {
				let $this = $(this);
				let inputValue = $this.attr("data-value");

				// 팝업이 이미 열려 있으면 클릭하지 않음
				if (!popupOpen) {
					$("#popupModal").fadeIn(1300);
					popupOpen = true; // 팝업이 열렸다고 표시

					if (correctInputs > 0) {
						popupPositionLeft += 87;
						$(".popupModal").css("left", popupPositionLeft + "px");
					}

					$("#popupModal .btn-wrp button").off("click").on("click", function () {
						let popupValue = $(this).attr("value");
						let $button = $(this);

						$button.addClass("active");

						console.log("선택된 값:", popupValue);
						console.log("현재 입력해야 할 값:", inputValue);

						if (inputValue === popupValue) {
							playAudio(correctSound);
							$(this).addClass('correct')
							correctInputs++; // 정답 개수 증가
							console.log("정답 입력됨! 현재 correctInputs:", correctInputs);
							console.log("필요한 정답 개수:", answers[currentQuestion].length);

							$("#popupModal").fadeIn(100, function() {
								$this.val(popupValue).prop("disabled", true)// 값을 입력하고 비활성화
								setTimeout(() => {
									$this.next().click();
								}, 500);
								console.log("클릭")
								$button.removeClass("active");

								// 힌트 모달 닫기
								if (hintOpen) {
									$("#hintModal").fadeOut(100);
									hintOpen = false;
								}

								// 모든 입력이 완료되었는지 확인
								if (correctInputs === answers[currentQuestion].length) {
									console.log("🎉 모든 정답 입력 완료! StageModal2를 띄웁니다.");
									setTimeout(function() {
										$("#popupModal").hide();
										$("#stageModal").hide();
										$("#stageModal2").fadeIn(1500);
										$("#stageModal2 .btn-sound").on("click", function () {
											playAudio(correctSound);
										});
										$(".btn-hint").css("display", "none");
									}, 500);
								} else {
									console.log("다음 입력 필드를 활성화합니다.");
									$(".alphabet-val input").eq(correctInputs).prop("disabled", false);
								}

								popupOpen = false; // 팝업이 닫혔으므로 상태 리셋
							});
						} else {
							playAudio(wrongSound);
							console.log("❌ 오답! 다시 선택하세요.");
							setTimeout(() => {
								$button.removeClass("active");
							}, 500);
						}

					});

				}
			});
        }
	}
//
    $("#stageModal2 .btn-next").on("click", function () {		
        modal_next();

		$(".stage-box").css({"top":"74px", "left":"5px"}).removeClass("small").removeClass("small2").removeClass("md");
    });

	function modal_next(){
		let currentCount = parseInt($("#stage").attr("data-count"), 10);
		console.log("현재 카운트:", currentCount);
		let nextCount = currentCount + 1;
	
		// 데이터 카운트 업데이트
		$("#stage").attr("data-count", nextCount);
	
		$("#stageModal, #stageModal2").hide();
		$(".btn-click").fadeIn(100);
		$(".btn-hint").css("display", "block");
	
		// 다음 문제로 이동하고 currentQuestion 설정
		currentQuestion = nextCount; // 다음 질문 인덱스로 설정
	
		// 마지막 문제인지 확인
		if(currentQuestion >= Object.keys(answers).length){
			console.log("마지막 문제에 도달");
			$("#stage").removeClass("zoom-in");
			$("#stageModal, #stageModal2").hide();				
			$("#stage").attr("data-count", "0")
			
			$("#finalModal").addClass("show").find(".nav-item1").click();
			$(".stage-box").css({"top":"74px", "left":"5px"}).removeClass("small").removeClass("small2").removeClass("md");
			return; // 더 이상 진행하지 않음
		}
	
		correctInputs = 0;
		$(".alphabet-val input").val(""); // 입력 필드 초기화
		$(".alphabet-val input").prop("disabled", false); // 모든 입력 필드 활성화
		$(".alphabet-val input").eq(0).prop("disabled", false); // 첫 번째 입력 필드 활성화
	
		let currentWord = answers[currentQuestion].join(""); // 현재 단어 문자열 변환
	
		console.log("현재 질문 단어:", currentWord);
	
		switch (currentWord) {
			case "singer":
				popupPositionLeft = 319;
				break;
			case "artist":
				popupPositionLeft = 590;
				break;
			case "doctor":
				popupPositionLeft = 579;
				break;
			case "driver":
				popupPositionLeft = 627;
				break;
		}
		
		// 팝업 모달의 left 값 설정
		$(".popupModal").css("left", popupPositionLeft + "px");
	}

	// 리셋
	$(".btn-reset").on("click", function(){
		reset_all();
		$(".stage-box").css({"top":"74px", "left":"5px"}).removeClass("small").removeClass("small2").removeClass("md");
	});

	$(".hd-home").click(function(){
		reset_all();
		$(".stage-box").css({"top":"74px", "left":"5px"}).removeClass("small").removeClass("small2").removeClass("md");
	})

	function reset_all(){
		// 초기 상태로 되돌리기
		$("#stage").attr("data-count", "0"); // 첫 번째 문제로 초기화
		$(".btn-click").show(); // 클릭 버튼 보이기
		$("#stageModal, #stageModal2, #popupModal, #hintModal").hide(); // 모든 모달 숨기기
		$(".alphabet-val input").val("").prop("disabled", false); // 입력값 초기화 및 활성화
		$(".btn-hint").css("display", "block"); // 힌트 버튼 보이기
		$(".btn-replay").fadeOut(600); // 다시하기 버튼 숨기기
		$("#startModal").modal('show');
		$(".stage-box").hide();
		$("#finalModal").removeClass("show");
		$('.btn-wrp button').removeClass('correct')
		$("#stage").removeClass("zoom-in").addClass("zoom-out");

		let popupPositionInitialLeft = 726;
		popupPositionLeft = popupPositionInitialLeft; // 변수 초기화
		$(".popupModal").css("left", popupPositionLeft + "px");

		correctInputs = 0; // 맞힌 정답 개수 초기화
		currentQuestion = 0; // 현재 문제 초기화
		popupOpen = false; // 팝업 열린 상태 초기화
		hintOpen = false; // 힌트 열린 상태 초기화
		 correctInputs = 0;
    }
});

function playMp3(audioSrc) {
    const audio = new Audio(audioSrc); // Audio 객체 생성
    const $audioMessage = $(event.currentTarget).find('span.audio-message'); // 클릭된 버튼의 하위 span.audio-message 선택

    // 오디오 재생 시작 시 active 클래스 추가
    audio.addEventListener('play', function() {
        $audioMessage.addClass('text-red');
    });

    // 오디오 재생 종료 시 active 클래스 제거
    audio.addEventListener('ended', function() {
        $audioMessage.removeClass('text-red');
    });

    audio.play(); // 오디오 재생
}



