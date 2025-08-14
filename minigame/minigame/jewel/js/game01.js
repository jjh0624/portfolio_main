var clearAni;
var selectedParts = {
    body: null,
    door: null,
    wheel: null
};

stageInit.themeFn = function(){
	$('#wrap').after('<audio id="bgm2" controls loop data-dtext_index="dtext_cls_audio" class="position-absolute d-none"><source src="../media/game01/sub.mp3" type="audio/mpeg"></audio>');
}

var $dragItems = $('.drag-item'),
	$dropBox = $('.drop-box');

function nextStage() {
	nowStage = $stage.filter('.show');
	if(nowStage.next().attr("id") == "ending"){
		if($dropBox.data('drop') < maxStep){
			setTimeout(function(){
				$('#modal-success').modal({backdrop: 'static'});
			}, 1000);
		}
	} else {
		nowStage.removeClass('show').next().addClass('show');
		if(nowStage.next().attr("id") == "act"){
			$gameWrp.addClass('guide-open');
            // 각 단계별로 보여줄 드래그 아이템 설정
            $dragItems.hide();
            switch(step) {
                case 1:
                    $dragItems.filter('.body, .body2, .body3').show();
                    break;
                case 2:
                    $dragItems.filter('.door, .door2, .door3').show();
                    break;
                case 3:
                    $dragItems.filter('.wheel, .wheel2, .wheel3').show();
                    break;
            }
		}
	}
}

$(function($){
	'use strict';

	$(document).on('click', '[data-role=init]', function () {
		$gameWrp.removeClass('begin-bg');
	});

	$(document).on('click','[data-role=start]',function(){
		makeQuiz.run()
	});

	$(document).on('click','.guide',function(){
		$('.help-balloon').css('animation','fadeIn .5s .5s both');
		$dragItems.addClass('on');
		$dragItems.removeClass('on');
	});

	$(document).on('click','[data-role=showtime]',function(){
		gameFinish();
		$gameWrp.addClass('ending-bg');
	});

	setInterval(function(){
		$('.dance-char-2').toggleClass('on');
		$('.dance-char-3').toggleClass('on');
	},800);

	var i = 1;
	setInterval(function(){
		if (i < 4){
			$('.dance-char').removeClass('act1 act2 act3');
			$('.dance-char').addClass('act'+i);
			i++;
		} else {
			i = 1;
			$('.dance-char').removeClass('act1 act2 act3');
		}
	},800 * i);


})

function gameFinish(){
	audioStop('bgm');
	playAudio('ending', 'game01');
	$gameWrp.removeClass('start').addClass('finish');
	$('#ending').addClass('show').siblings().removeClass('show');
}

	function roundClear(){
		if(step == maxStep){
			$('#modal-finish').modal({backdrop: 'static'});
		} else {
			return false;
		}
	}

	// 새 js
	// 알파벳 클릭 로직
document.addEventListener('DOMContentLoaded', () => {
	let pickAudioTimeout = null;
	let gameEnded = false;
	let currentStageIndex = 0;
	let wrongStageIndices = [];
	const allStages = document.querySelectorAll('.stage-text');
	// const choice_box2 = document.querySelector('.choice-box');

	// 초기 첫 문제만 보이게
	allStages.forEach((stage, index) => {
		stage.classList.toggle('show', index === currentStageIndex);
	});

	// 다음 버튼 이벤트 등록
	document.querySelectorAll('.btn-next').forEach(button => {
		const cart = document.querySelector('.cart');
		button.addEventListener('click', () => {
			// 이미 애니메이션이 진행 중이면 중복 실행 방지
			if (cart.classList.contains('moveCartOut')) return;

			document.querySelector('.cart').classList.remove('moveCart');
			document.querySelector('.cart').classList.add('moveCartOut');
			// setTimeout(() => {
			// 	playAudio('twinkle')
			// }, 3000);
			document.querySelector('.stage-text.show').querySelector(".btn-complete").disabled = true;

			// 이벤트 핸들러를 한 번만 등록
			const handleAnimationEnd = function () {
				console.log('나가는 애니메이션 끝22');
				// 이벤트 리스너 제거
				cart.removeEventListener('animationend', handleAnimationEnd);

				// 모든 문제가 완료되었는지 확인
				if (stages.length === 0 && stagesToRetry.length === 0) {
					// 게임 스테이지 숨기기
					document.querySelector('.game-stage.show')?.classList.remove('show');
					clearTimeout(pickAudioTimeout);

					// 체력이 2 이하이면 실패 화면으로 이동
					if (totalPickCount - currentPickCount <= 2) {
						console.log('[게임 종료] 체력이 부족하여 보석을 캘 수 없습니다.');
						$('.fail-stage').addClass('show');
						return;
					}

					// act 스테이지로 이동
					const actStage = document.querySelector('.act-stage01');
					if (actStage) {
						// 카트 애니메이션 끝날 때 act 스테이지로 전환되므로 여기서는 아무것도 하지 않음
					} else {
						onGameComplete();
					}
				} else {
					goToNextStage();
				}
			};

			cart.addEventListener('animationend', handleAnimationEnd);
		});
	});


	// choice 알파벳 클릭
	document.querySelectorAll('.choice-list li').forEach(choice => {
		choice.addEventListener('click', () => {
			// 이미 비활성화된 경우 클릭 무시
			if (choice.classList.contains('disabled')) return;

			const selectedChar = choice.textContent;
			let currentStage = document.querySelector('.stage-text.show');
			if (!currentStage) return;

			const answerText = currentStage.querySelector('.answer-text');
			const pList = Array.from(answerText.querySelectorAll('p'));
			const emptyP = pList.find(p => p.textContent.trim() === '');
			const btnComplete = currentStage.querySelector(".btn-complete");

			if (emptyP) {
				emptyP.textContent = selectedChar;
				// 클릭한 li 비활성화
				choice.classList.add('disabled');

				// 하나라도 입력되면 버튼 활성화 및 delete 클래스 추가
				btnComplete.disabled = false;
				btnComplete.classList.add('delete');
			}

			// 모든 p가 채워졌는지 확인하고 클래스 추가
			const allFilled = pList.every(p => p.textContent.trim() !== '');
			let btnRetry = document.querySelector(".stage-text.show").querySelector(".btn-delete");
			if (allFilled) {
				currentStage.classList.add('answer-retry');
				// document.querySelector('.choice-box').style.display = "none";
				document.querySelector('.choice-box').classList.add('noneClick');
				console.log('5자 모두 입력 완료 - answer-retry 클래스 추가');
				btnRetry.disabled = false;
				// 모든 칸이 채워지면 delete 클래스 제거
				btnComplete.classList.remove('delete');
			}
		});
	});

	// 정답 확인/지우기 버튼 기능 바인딩
	document.querySelectorAll('.btn-complete').forEach(button => {
		button.addEventListener('click', () => {
			const currentStage = button.closest('.stage-text');
			if (!currentStage) return;

			const answerText = currentStage.querySelector('.answer-text');
			const pList = Array.from(answerText.querySelectorAll('p'));
			const allFilled = pList.every(p => p.textContent.trim() !== '');

			if (allFilled) {
				// 모든 칸이 채워진 경우 - 정답 확인 로직
				playAudio('click');
				// checkAnswer();
			} else {
				// 모든 칸이 채워지지 않은 경우 - 지우기 로직
				playAudio('click');
				const choiceList = document.querySelector('.choice-list.show');
				const choices = Array.from(choiceList.querySelectorAll('li'));

				// 가장 마지막에 입력된 알파벳부터 지우기
				for (let i = pList.length - 1; i >= 0; i--) {
					if (pList[i].textContent.trim() !== '') {
						// 해당 알파벳을 찾아서 다시 활성화
						const char = pList[i].textContent;
						const choice = choices.find(c => c.textContent === char && c.classList.contains('disabled'));
						if (choice) {
							choice.classList.remove('disabled');
						}
						// 입력된 알파벳 지우기
						pList[i].textContent = '';
						break;
					}
				}

				// 모든 칸이 비어있으면 버튼 비활성화 및 delete 클래스 제거
				const allEmpty = pList.every(p => p.textContent.trim() === '');
				if (allEmpty) {
					button.disabled = true;
					button.classList.remove('delete');
				}
			}
		});
	});

	// 지우기 버튼 초기화 (비활성화)
	function initializeDeleteButtons() {
		document.querySelectorAll('.btn-delete').forEach(button => {
			button.disabled = true;
		});
	}

	// 지우기 버튼 기능 바인딩
	function bindDeleteButtons() {
		document.querySelectorAll('.btn-delete').forEach(button => {
			button.onclick = () => {
				playAudio('click');
				document.querySelector(".stage-text.show").querySelector(".btn-complete").disabled = true;
				const currentStage = button.closest('.stage-text.show');
				if (!currentStage) return;

				const answerText = currentStage.querySelector('.answer-text');
				const pList = Array.from(answerText.querySelectorAll('p'));
				const choiceBox = currentStage.parentElement.parentElement.querySelector('.choice-box');
				const choiceList = choiceBox.querySelector('.choice-list.show');

				pList.forEach(p => p.textContent = '');
				$(choiceList).find('li').removeClass('disabled');
				currentStage.classList.remove('answer-retry');

				// choiceBox.style.display = 'block';
				choiceBox.classList.remove('noneClick')

				// 버튼 다시 비활성화
				button.disabled = true;
			};
		});
	}

	// 지우기 버튼 초기화 및 바인딩
	initializeDeleteButtons();
	bindDeleteButtons();

	// 정답 확인
	const answers = {
		stage01: 'phone',
		stage02: 'apple',
		stage03: 'mango',
		stage04: 'berry',
		stage05: 'pencil',
		stage06: 'water',
	};

	// 게이지
	let wrongCount = 0;
	const maxWrong = 10;
	const gaugeBar = document.querySelector('.gauge-bar');
	let gaugePercent = 100; // 전역 선언으로 변경

	// 맞힌 개수
	let correctCount = 0;

	// 정답 체크 버튼 눌렀을 때 로직
	// let wrongStageIndices = [];
	const stagesToRetry = []; // 다시 풀어야 할 스테이지 저장
	let currentIndex = 0;
	let delayedMoveIndex = null; // 다음 이동 시 뒤로 보내야 할 인덱스를 저장
	const stages = Array.from(document.querySelectorAll('.stage-text'));
	const choices = Array.from(document.querySelectorAll('.choice-list'));
	const gameStageAll = document.querySelectorAll('.game-stage');
	const failStage = document.querySelector('.fail-stage');

	// checkAnswer 함수 내부 수정
	document.querySelectorAll('.btn-complete').forEach(button => {
		button.addEventListener('click', () => {
			const currentStage = button.closest('.stage-text');
			const allCurrentStages = Array.from(document.querySelectorAll('.stage-text'));
			const currentIndex = stages.indexOf(currentStage);
			const answerText = currentStage.querySelector('.answer-text');
			const stageClass = Array.from(currentStage.classList).find(cls => /^stage\d+$/.test(cls));

			const pList = Array.from(answerText.querySelectorAll('p'));
			const userAnswer = pList.map(p => p.textContent.replace(/\u00A0/g, '').trim()).join('');

			const filled = pList.every(p => p.textContent.trim() !== '');

			if (!filled || userAnswer.length !== pList.length) return;

			const correctAnswer = answers[stageClass];
			const choice_box = currentStage.parentElement.parentElement.querySelector('.choice-box');
			const text_box = currentStage.parentElement.parentElement;

			text_box.classList.add('next-stage');
			answerText.classList.add('active');
			// choice_box.style.display = "none";
			choice_box.classList.add('noneClick');
			currentStage.classList.remove('answer-retry');
			var bgmElement = $('#bgm');
			if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
				fadeBgmVolume(bgmElement, 0.1);
				// 정답일 경우
				stages.splice(currentIndex, 1);  // 올바른 currentIndex 기준으로 제거
				choices.splice(currentIndex, 1);

				// 중요: stagesToRetry에서도 제거
				const retryIndex = stagesToRetry.indexOf(currentStage);
				if (retryIndex !== -1) {
					stagesToRetry.splice(retryIndex, 1);
				}

				// wrongStageIndices에서도 제거 (인덱스로 관리 중인 경우)
				const wrongIndex = wrongStageIndices.indexOf(currentIndex);
				if (wrongIndex !== -1) {
					wrongStageIndices.splice(wrongIndex, 1);
				}

				correctCount++;
				text_box.classList.add('correct');
				playAudio('correct');
				// 디버깅 정보 출력

				// if (correctCount == 1) {
				// 	setTimeout(() => {
				// 		playAudio('twinkle');
				// 	}, 1000);
				// } else if (correctCount == 2) {
				// 	setTimeout(() => {
				// 		playAudio('twinkle');
				// 	}, 1000);
				// } else if (correctCount == 6) {
				// 	setTimeout(() => {
				// 		playAudio('twinkle');
				// 	}, 1000);
				// } else if (correctCount == 4) {
				// 	setTimeout(() => {
				// 		playAudio('twinkle');
				// 	}, 1000);

				// }


				console.log(`정답 남은 문제: ${stages.length}, 남은 재시도: ${stagesToRetry.length}`);

                    if (currentValue > 0) {
                        currentSpan.textContent = stages.length;
                    }

				setTimeout(() => {
					fadeBgmVolume(bgmElement, 1);
				}, 2000);
			} else {
				// 오답일 경우
				playAudio('wrong');
				wrongCount++;
				gaugePercent = Math.max(0, gaugePercent - 10);
				gaugeBar.style.width = `${gaugePercent}%`;
				text_box.classList.add('false');
				fadeBgmVolume(bgmElement, 0.1);
				document.querySelector('.bg-obj03').classList.add('active');

				setTimeout(() => {
					fadeBgmVolume(bgmElement, 1);
				}, 2000);

				// 체력 감소
				decreaseHealth();

				// 돌 떨어지는 효과 추가
				createFallingStones();

				setTimeout(() => {
					document.querySelector('.bg-obj03').classList.remove('active');
				}, 3000);

				if (wrongCount >= maxWrong) {
					// 게임 오버
					gameStageAll.forEach(stage => stage.classList.remove('show'));
					failStage.classList.add('show');
					return; // 게임 오버면 더 이상 진행하지 않음
				}

				// 틀린 경우 stagesToRetry에 넣기 (중복 체크)
				if (!stagesToRetry.includes(currentStage)) {
					stagesToRetry.push(currentStage);
				}

				// 인덱스 저장 (필요한 경우)
				if (!wrongStageIndices.includes(currentIndex)) {
					wrongStageIndices.push(currentIndex);
				}

				delayedMoveIndex = currentIndex; // 나중에 이동하도록 저장

				// 디버깅 정보 출력
				console.log(`오답! stagesToRetry 길이: ${stagesToRetry.length}`);
			}

			// .btn-complete 클릭 직후
			let userClickedNext = false; // 사용자가 수동 클릭했는지 여부

			// .btn-next 버튼에 클릭 감지
			document.querySelectorAll('.btn-next').forEach(btn => {
				btn.addEventListener('click', () => {
					userClickedNext = true; // 사용자가 수동 클릭하면 true로 설정
				});
			});

			// 2초 뒤 자동 클릭 시도
			setTimeout(() => {
				if (!userClickedNext) {
					console.log('자동으로 다음 문제로 이동');
					const currentNextBtn = document.querySelector('.stage-text.show .btn-next');
					if (currentNextBtn) currentNextBtn.click();
				}
			}, 2000)

			// 모든 문제를 맞혔는지 확인하는 로직 추가
			if (stages.length === 0 && stagesToRetry.length === 0) {
				console.log("모든 문제 완료 onGameComplete 호출");
				setTimeout(() => {
					// 체력이 2 이하이면 실패 화면으로 이동
					if (totalPickCount - currentPickCount <= 2) {
						console.log('[게임 종료] 체력이 부족하여 보석을 캘 수 없습니다.');
						// 게임 스테이지 숨기기
						$('.game-stage.show').removeClass('show');
						// 실패 스테이지 보이기
						$('.fail-stage').addClass('show');
						return;
					}

					// act-stage01이 있으면 보여주고, 없으면 바로 onGameComplete 호출
					const actStage = document.querySelector('.act-stage01');
					if (actStage) {
						setTimeout(() => {
							actStage.classList.add('show');
						}, 3000);
					} else {
						onGameComplete();
					}
				}, 1000);
			}

			if (correctCount == 1) {
				document.querySelector('.answer-jewel03').classList.add('active');
			} else if (correctCount == 2) {
				document.querySelector('.answer-jewel01').classList.add('active');
			} else if (correctCount == 6) {
				document.querySelector('.answer-jewel04').classList.add('active');
			} else if (correctCount == 4) {
				document.querySelector('.answer-jewel02').classList.add('active');

			}
		});
	});

	function goToNextStage() {
		const currentStage = document.querySelector('.stage-text.show');
		const currentChoice = document.querySelector('.choice-list.show');

		if (!currentStage || !currentChoice) {
			console.error("현재 표시된 스테이지 또는 선택지가 없습니다");
			return;
		}

		const parentsElement = currentStage.parentElement.parentElement;
		const parentsElement2 = currentChoice.parentElement;

		currentStage.classList.remove('show');
		currentChoice.classList.remove('show');

		let nextStage = currentStage.nextElementSibling;
		let nextChoice = currentChoice.nextElementSibling;

		// 다음 스테이지를 찾되, 맞힌 스테이지는 건너뛴다
		while (nextStage && (!nextStage.classList.contains('stage-text') || nextStage.classList.contains('correct'))) {
			nextStage = nextStage.nextElementSibling;
		}
		while (nextChoice && (!nextChoice.classList.contains('choice-list') || nextChoice.classList.contains('correct'))) {
			nextChoice = nextChoice.nextElementSibling;
		}

		if (nextStage && nextChoice) {
			// 다음 스테이지로 진행
			nextStage.classList.add('show');
			nextChoice.classList.add('show');
			currentIndex++;

			const cart = document.querySelector('.cart');
			const textBox = document.querySelector('.text-box');
			const choiceBox = document.querySelector('.choice-box');

			// 스테이지가 show될 때 noneClick 추가
			if (textBox) {
				textBox.classList.add('noneClick');
			}
			if (choiceBox) {
				choiceBox.classList.add('noneClick');
			}

			cart.querySelector('.quizpad').classList.remove('on');
			cart.classList.remove('moveCartOut');
			cart.classList.add('moveCart');
			console.log('moveCart 애니메이션 시작');
			playAudio('cart');

			// 이벤트 핸들러를 한 번만 등록
			const handleAnimationEnd = function () {
				console.log('애니메이션 끝1 - text-box와 choice-box의 noneClick 제거 시도');
				cart.querySelector('.quizpad').classList.add('on');

				if (textBox) {
					textBox.classList.remove('noneClick');
					console.log('text-box noneClick 제거됨');
				} else {
					console.log('text-box를 찾을 수 없음');
				}
				if (choiceBox && choiceBox.classList.contains('choice-box')) {
					choiceBox.classList.remove('noneClick');
					console.log('choice-box noneClick 제거됨');
					// show 클래스가 있는 choice-list의 li 요소들의 disabled 클래스 제거
					const choiceList = choiceBox.querySelector('.choice-list.show');
					if (choiceList) {
						$(choiceList).find('li').removeClass('disabled');
					}
				} else {
					console.log('choice-box를 찾을 수 없음');
				}
				// 이벤트 리스너 제거
				cart.removeEventListener('animationend', handleAnimationEnd);
			};

			cart.addEventListener('animationend', handleAnimationEnd);
			parentsElement.classList.remove('next-stage', 'false', 'correct');
			parentsElement2.style.display = 'block';

			bindDeleteButtons();

			if (delayedMoveIndex !== null) {
				moveStageToEnd(delayedMoveIndex);
				delayedMoveIndex = null;
			}
		} else if (stagesToRetry.length > 0) {
			// 재시도할 문제가 있으면 처리
			console.log("재시도 문제로 진행합니다.");

			const retryStage = stagesToRetry[0];
			const retryIndex = stages.indexOf(retryStage);

			const textBox = document.querySelector('.text-box');
			const choiceBox = document.querySelector('.choice-box');
			if (textBox) textBox.classList.add('noneClick');
			if (choiceBox) choiceBox.classList.add('noneClick');

			const cart = document.querySelector('.cart');
			cart.classList.remove('moveCartOut');
			cart.classList.add('moveCart');

			// 이벤트 핸들러를 한 번만 등록
			const handleAnimationEnd = function () {
				console.log('애니메이션 끝2');
				cart.querySelector('.quizpad').classList.add('on');
				const choiceBox = document.querySelector('.choice-box');
				if (choiceBox && choiceBox.classList.contains('choice-box')) {
					// 재시도 문제의 disabled 클래스 제거
					const choiceList = choiceBox.querySelector('.choice-list.show');
					if (choiceList) {
						$(choiceList).find('li').removeClass('disabled');
					}
				}
				// 이벤트 리스너 제거
				cart.removeEventListener('animationend', handleAnimationEnd);
			};

			cart.addEventListener('animationend', handleAnimationEnd);
			parentsElement.classList.remove('next-stage', 'false', 'correct');
			if (retryIndex === -1) {
				console.error("재시도할 스테이지를 찾을 수 없습니다");
				stagesToRetry.shift(); // 문제가 있는 항목은 제거
				goToNextStage(); // 다시 시도
				return;
			}

			console.log("재시도 문제 인덱스:", retryIndex);
			moveStageToEnd(retryIndex);

			// 다시 현재 인덱스를 맨 마지막으로 설정
			currentIndex = stages.length - 1;

			// 마지막 스테이지와 선택지를 표시
			if (stages[currentIndex]) {
				stages[currentIndex].classList.add('show');
				choices[currentIndex].classList.add('show');
				parentsElement2.style.display = 'block';
			} else {
				console.error("재시도할 스테이지가 없습니다. 모두 완료된 것으로 처리합니다.");
				allCompleted();
			}
		} else {
			// 모든 스테이지 완료
			console.log("모든 스테이지 완료!");
			allCompleted();
		}
	}

	function moveStageToEnd(index) {
		if (index < 0 || index >= stages.length) {
			console.error("유효하지 않은 인덱스:", index);
			return;
		}

		const textBox = document.querySelector('.text-box');
		const choiceBox = document.querySelector('.choice-box');

		const stage = stages[index];
		const choice = choices[index];

		// undefined일 경우 함수 종료
		if (!stage || !choice) {
			console.error("해당 인덱스의 스테이지 또는 선택지가 없습니다:", index);
			return;
		}

		// 상태 초기화
		const answerText = stage.querySelector('.answer-text');
		if (answerText) {
			answerText.querySelectorAll('p').forEach(p => p.textContent = '');
		}
		stage.classList.remove('answer-retry', 'correct', 'false');

		const parentElement = stage.parentElement?.parentElement;
		if (parentElement) {
			parentElement.classList.remove('correct', 'false');
		}

		// DOM에서 마지막으로 이동
		textBox.appendChild(stage);
		choiceBox.appendChild(choice);

		// 배열에서도 맨 뒤로 재배열
		stages.push(stages.splice(index, 1)[0]);
		choices.push(choices.splice(index, 1)[0]);

		console.log("스테이지를 맨 뒤로 이동했습니다. 현재 스테이지 수:", stages.length);
	}

	// checkAnswer(currentIndex)

	const introCmp = document.getElementById("intro").querySelector(".btn-cmp");

	// 수레 움직이기 버튼
	introCmp.addEventListener('click', () => {
		const cart = document.querySelector('.cart');
		cart.classList.add('moveCart');
		playAudio('cart')
		cart.addEventListener('animationend', function handleAnimationEnd() {
			console.log('애니메이션 끝');
			cart.querySelector('.quizpad').classList.add('on');
			const textBox = document.querySelector('.text-box');
			const choiceBox = document.querySelector('.choice-box');

			if (textBox) {
				textBox.classList.remove('noneClick');
				console.log('text-box noneClick 제거됨');
			}
			if (choiceBox && choiceBox.classList.contains('choice-box')) {
				choiceBox.classList.remove('noneClick');
			}
		});
	});

	const act_stage01 = document.querySelector(".act-stage01");
	console.log("act-stage01 요소:", act_stage01);

	document.addEventListener('click', function (e) {
		// 클릭된 요소가 .btn-cmp인지 확인
		if (e.target.closest('.btn-cmp') && e.target.closest('.act-stage01')) {
			console.log("act-stage01의 btn-cmp 버튼 클릭됨!");
			const nowActStage = e.target.closest('.act-stage01').querySelector(".step-wrp1");
			const actChar = nowActStage.parentElement.querySelector(".intro-char");
			if (actChar) actChar.style.display = "none";
			nowActStage.style.display = "none";
		}
	});



	// 곡괭이 + 모션
	const pick = document.querySelector('.pick');
	const jewels = document.querySelectorAll('.pick_jewel');

	const positions = {
		'pick_jewel01': { x: 543, y: 155 },
		'pick_jewel02': { x: 452, y: 306 },
		'pick_jewel03': { x: 708, y: 306 },
		'pick_jewel04': { x: 769, y: 130 },
		'pick_jewel05': { x: 940, y: 244 },
		'pick_jewel06': { x: 1081, y: 293 },
	};

	// 전역 변수 선언
	let pickJewelCount = 0;
	let totalPickCount = 20; // 전체 곡괭이질 횟수
	let currentPickCount = 0; // 현재 곡괭이질 횟수
	let pickedJewels = []; // 획득한 보석 목록
	let jewelPickCount = {}; // 각 보석별 곡괭이질 횟수

	// 게임 완료 함수
	function onGameComplete() {
		var bgmElement = $('#bgm');
		var iconSpeaker = $('.icon-spk');

		gameEnded = true;
		console.log("onGameComplete 함수 호출됨!");
		// 획득한 보석 개수에 따라 처리
		const jewelCount = pickedJewels.length;
		console.log(`획득한 보석 개수: ${jewelCount}`);

		if (pickInterval) {
			clearInterval(pickInterval);
			isPicking = false;
		}

		// 엔딩 메시지 설정
		let message = '';
		if (jewelCount <= 3) {
			message = `이번엔 좀 어려웠지?<br> 다시 도전해보자!`;
		}else if (jewelCount === 4) {
			message = `잘했어!<br> 연습하면<br> 더 좋아질 거야!`;
		}else if (jewelCount === 5) {
			message = `오, 실력이 꽤 좋은걸?`;
		}else if (jewelCount === 6) {
			message = `완벽해! <br> 보석을 전부 캤어!`;
		}

		// 엔딩 메시지 요소 생성 및 설정
		const endingBubble = document.querySelector('.ending-bubble');
		endingBubble.innerHTML = message;
		endingBubble.setAttribute('data-translate', '');

		// 현재 언어에 맞춰 번역 적용
		const currentLang = document.documentElement.lang;
		if (currentLang !== 'ko') {
			// 번역할 때만 <br> 태그를 제거
			const messageWithoutBr = message.replace(/<br>/g, ' ');
			translateText(messageWithoutBr, 'ko', currentLang, translated => {
				// 번역된 텍스트에 <br> 태그 다시 추가
				const translatedWithBr = translated.replace(/\s+/g, '<br>');
				endingBubble.innerHTML = translatedWithBr;
				endingBubble.style.visibility = 'visible';
			});
		} else {
			endingBubble.style.visibility = 'visible';
		}

		// 엔딩 화면으로 이동
		$('.game-stage.show').removeClass('show');
		$('.pick_jewel').off('click');
		$('.ending-page').addClass('show');
		$('.gauge').hide();
		playAudio('twinkle');
		bgmElement[0].pause(); //볼륨 줄이기
		iconSpeaker.addClass('disabled').hide();

		// 획득한 보석 표시
		$('.ending-jewel').hide();
		pickedJewels.forEach(jewel => {
			const jewelNumber = jewel.replace('pick_jewel', '');
			$(`.ending-jewel${jewelNumber}`).show();
		});
	}

	// 게이지 바 업데이트 함수
	function updateGaugeBar() {
		const remainingPercent = Math.max(0, ((totalPickCount - currentPickCount) / totalPickCount) * 100);
		$('.gauge-bar').css('width', `${remainingPercent}%`);
		console.log(`[체력 게이지 업데이트] 현재 체력: ${currentPickCount}/${totalPickCount} (${remainingPercent}%)`);
	}

	// 문제 틀렸을 때 체력 감소
	function decreaseHealth() {
		currentPickCount += 2;
		updateGaugeBar();
		console.log(`[체력 감소] 틀렸습니다. 체력 -2, 현재 체력: ${currentPickCount}/${totalPickCount}`);

		// 체력이 0이 되면 바로 실패 스테이지로 이동
		if (currentPickCount >= totalPickCount) {
			console.log('[게임 종료] 체력이 모두 소진되었습니다.');
			// 게임 스테이지 숨기기
			$('.game-stage.show').removeClass('show');
			// 실패 스테이지 보이기
			$('.fail-stage').addClass('show');
			return;
		}
	}

	// 보석 클릭 이벤트 핸들러
	let pickInterval = null;
	let isPicking = false;

	$(document).on('click', '.pick_jewel', function () {
		if (gameEnded || isPicking) return;
		if ($(this).hasClass('picked')) return;

		isPicking = true;

		$(".act-stage01").addClass("no-touch");

		const className = $(this).attr('class').split(' ')[1];
		const jewel = $(this);
		const pick = $('.pick');
		const jewelImg = jewel.find('img');
		const jewelNumber = className.replace('pick_jewel', '');

		// 곡괭이 위치 설정
		const positions = {
			'01': { x: 513, y: 155 },
			'02': { x: 422, y: 306 },
			'03': { x: 678, y: 306 },
			'04': { x: 739, y: 130 },
			'05': { x: 910, y: 244 },
			'06': { x: 1051, y: 293 }
		};

		const pos = positions[jewelNumber];
		if (!pos) return;

		// 곡괭이 애니메이션 시작
		pick.css({ left: pos.x + 'px', top: pos.y + 'px' });
		pick.removeClass('pick-animation fade-out');

		// 3회의 곡괭이질 실행
		let pickCount = 0;
		const pickInterval = setInterval(() => {
			if (gameEnded) {
				clearInterval(pickInterval);
				isPicking = false;
				$(".act-stage01").removeClass("no-touch");
				return;
			}

			switch (pickCount) {
				case 0:
					if (gameEnded) break;
					// 첫 번째 곡괭이질
					jewelImg.attr('src', `../img/game01/work-jewel${jewelNumber}_02.png`);
					currentPickCount++;
					updateGaugeBar();
					pick.removeClass('fade-out').addClass('pick-animation');
					setTimeout(() => {
						pick.removeClass('pick-animation');
					}, 500);
					playAudio('pick');
					break;

				case 1:
					if (gameEnded) break;
					// 두 번째 곡괭이질
					jewelImg.attr('src', `../img/game01/work-jewel${jewelNumber}_03.png`);
					currentPickCount++;
					updateGaugeBar();
					pick.addClass('pick-animation');
					setTimeout(() => {
						pick.removeClass('pick-animation');
					}, 500);
					playAudio('pick');
					break;

				case 2:
					if (gameEnded) break;
					// 세 번째 곡괭이질
					jewelImg.attr('src', `../img/game01/work-jewel${jewelNumber}.png`);
					jewel.addClass('picked');
					pickedJewels.push(className);
					currentPickCount++;
					updateGaugeBar();
					pick.addClass('pick-animation');
					setTimeout(() => {
						pick.removeClass('pick-animation').addClass('fade-out');
						jewel.addClass(`jewel${jewelNumber}`);
						$(".act-stage01").removeClass("no-touch");

						// 남은 체력 부족 시 게임 종료
						if (totalPickCount - currentPickCount < 3) {
							console.log('[게임 종료] 남은 체력이 부족하여 더 이상 보석을 캘 수 없습니다.');
							setTimeout(() => {
								onGameComplete();
							}, 1000);
							clearInterval(pickInterval); // 종료도 같이!
							isPicking = false;
							return;
						}else{
							isPicking = false;
						}
					}, 500);
					playAudio('pick');

					// 모든 보석을 캤는지 확인
					if (pickedJewels.length === 6) {
						console.log('[게임 종료] 모든 보석을 획득했습니다.');
						setTimeout(() => {
							onGameComplete();
						}, 1000);
						clearInterval(pickInterval); // 종료도 같이!
					}
					break;
			}

			pickCount++;
		}, 1000);

	});

	// 게임 시작 시 초기화
	$(document).ready(function () {
		console.log('[게임 시작] 초기 체력 설정');
		// 초기 체력 설정
		currentPickCount = 0;
		updateGaugeBar();
	});

	jewels.forEach(jewel => {
		jewel.addEventListener('click', (e) => {
			const className = [...jewel.classList].find(cls => /pick_jewel\d+/.test(cls));
			const pos = positions[className];
			pickJewelCount++;

			if (!pos) return;

			// 보석 이벤트

		});
	});

	gameReset.themeFn = function () {
		$gameWrp.addClass('begin-bg');
		$dropBox.data('drop', 0).attr('data-drop', 0);
		$dragItems.removeClass('dropped');
		selectedParts = {
			body: null,
			door: null,
			wheel: null
		};
		window.location.reload();
	};

	// 돌 떨어지는 함수 추가
	function createFallingStones() {
		const gameStage = document.querySelector('.game-stage.show');
		const totalStones = Math.floor(Math.random() * 8) + 8; // 8~15개의 돌 생성

		// 효과 타입 배열
		const effectTypes = ['fade', 'spin', 'bounce'];

		for (let i = 1; i <= totalStones; i++) {
			setTimeout(() => {
				// 작은 돌이 더 많이 나오도록 확률 조정
				let stoneNumber;
				const random = Math.random();

				if (random < 0.3) { // 60% 확률로 작은 돌
					stoneNumber = Math.floor(Math.random() * 12) + 15; // 15-26번
				} else if (random < 0.5) { // 20% 확률로 중간 돌
					stoneNumber = Math.floor(Math.random() * 8) + 7; // 7-14번
				} else { // 20% 확률로 큰 돌
					stoneNumber = Math.floor(Math.random() * 6) + 1; // 1-6번
				}

				// 이미지 번호에 따라 크기 결정
				let stoneSize;
				let stoneWidth;

				if (stoneNumber <= 6) { // 1~6번: 큰 돌
					stoneSize = 'large';
					stoneWidth = Math.floor(Math.random() * 20) + 55; // 55~75px
				} else if (stoneNumber <= 14) { // 7~14번: 중간 돌
					stoneSize = 'medium';
					stoneWidth = Math.floor(Math.random() * 15) + 35; // 35~50px
				} else { // 15~26번: 작은 돌
					stoneSize = 'small';
					stoneWidth = Math.floor(Math.random() * 10) + 20; // 20~30px
				}

				// 랜덤 효과 선택
				const effectType = effectTypes[Math.floor(Math.random() * effectTypes.length)];

				const stone = document.createElement('div');
				stone.className = `falling-stone ${stoneSize} ${effectType}`;
				stone.style.left = `${Math.random() * 90 + 5}%`; // 5%~95% 위치에 랜덤 배치
				stone.style.width = `${stoneWidth}px`;
				stone.innerHTML = `<img src="../img/game01/drop-stone-${stoneNumber}.png" style="width: 100%">`;

				gameStage.appendChild(stone);

				// 애니메이션 종료 후 요소 제거
				stone.addEventListener('animationend', () => {
					stone.remove();
				});
				const audio = new Audio('../media/game01/effect/rocks.mp3');
				audio.volume = 0.3; // 볼륨 30%
				audio.play();

				// 1.5초 후에 오디오 중지
				setTimeout(() => {
					audio.pause();
					audio.currentTime = 0;
				}, 1500);
			}, Math.random() * 1500); // 1.5초 내에 랜덤하게 생성
		}
	}

	let isOverlayClosing = false; // 오버레이 닫힘 상태 추적 변수 추가

	function overlayClose() {
		if (isOverlayClosing) return; // 이미 닫히는 중이면 중복 실행 방지
		isOverlayClosing = true;

		overlayShow = false;
		clearTimeout(overlayAutoAni); // 기존 타이머 정리

		setTimeout(function () {
			$('.answered').find('input').filter(':checked').prop('checked', false);
			setTimeout(function () {
				if (isCorrect) {
					round++;
					makeQuiz.run();
				} else {
					$('.answered').removeClass('answered');
					if (isEnd) {
						if (social) {
							if (step < maxStep) {
								nextStep();
							} else {
								$('#modal-fail').modal({ backdrop: 'static' });
							}
						} else {
							$('#modal-fail').modal({ backdrop: 'static' });
						}
					}
				}
				isOverlayClosing = false; // 닫힘 상태 초기화
			}, 500);
		}, 1000);
	}

	// 오버레이 클릭 이벤트 핸들러 수정
	$(document).on('click', '.overlay', function () {
		if (isOverlayClosing) return; // 이미 닫히는 중이면 중복 실행 방지
		$('#round').removeClass('overlay-open');
		clearTimeout(overlayAutoAni);
		overlayClose();
	});

	// 지우기 버튼 클릭 이벤트
	document.querySelectorAll('.btn-delete').forEach(button => {
		button.addEventListener('click', () => {
			const currentStage = document.querySelector('.stage-text.show');
			if (!currentStage) return;

			const answerText = currentStage.querySelector('.answer-text');
			const pList = Array.from(answerText.querySelectorAll('p'));
			const btnComplete = currentStage.querySelector(".btn-complete");

			// 모든 입력 지우기
			pList.forEach(p => p.textContent = '');

			// 모든 li 활성화
			document.querySelectorAll('.choice-list li').forEach(li => {
				li.classList.remove('disabled');
			});

			// 버튼 상태 초기화
			button.disabled = true;
			btnComplete.disabled = true;
			btnComplete.classList.remove('delete');
		});
	});

	// 리셋 버튼 이벤트 핸들러 추가
	$(document).on('click', '[data-role="reset"]', function() {
		resetGame();
	});

	// 리셋 버튼 이벤트 핸들러 추가 -> 다시하기기
	$(document).on('click', '.btn-reset', function() {
		resetGame2();
	});

	const originalStageOrder = ['01', '02', '03', '04', '05', '06'];

	function resetGame() {
		// const textBox = document.querySelector('.text-box');
		// const choiceBox = document.querySelector('.choice-box');

		// console.log('리셋 버튼 클릭됨');

		// // 게임 리셋 인식
		// gameEnded = false;

		// $('.icon-home').css({'opacity':'0', 'visibility': 'hidden'});
		// $('#lang').addClass('active');

		// // .stage-text와 .choice-list들을 원래 순서대로 다시 append
		// originalStageOrder.forEach(num => {
		// 	const stage = document.querySelector(`.stage-text.stage${num}`);
		// 	const choice = document.querySelector(`.choice-list.choice-list${num}`);

		// 	if (stage && choice) {
		// 		textBox.appendChild(stage);
		// 		choiceBox.appendChild(choice);
		// 	}
		// });

		// // 기본 변수 초기화
		// currentStageIndex = 0;
		// wrongStageIndices = [];
		// totalPickCount = 20;
		// currentPickCount = 0;
		// pickedJewels = [];
		// stages.length = 0;
		// choices.length = 0;
		// stagesToRetry.length = 0;
		// delayedMoveIndex = null;
		// correctCount = 0;
		// gaugePercent = 100;
		// wrongCount = 0;

		// // 문제 보석 초기화
		// $('.answer-jewel').removeClass('active')

		// // 모든 스테이지 초기화
		// document.querySelectorAll('.stage-text').forEach((stage, index) => {
		// 	stage.classList.toggle('show', index === 0);
            if (index === 0) {
                stage.setAttribute('tabindex', '0');
            } else {
                stage.setAttribute('tabindex', '-1');
            }
		// 	stage.classList.remove('correct', 'false', 'answer-retry');
		// 	const answerText = stage.querySelector('.answer-text');
		// 	if (answerText) {
		// 		answerText.querySelectorAll('p').forEach(p => p.textContent = '');
		// 		answerText.classList.remove('show');
		// 	}
		// 	stages.push(stage);
		// });

		// // 모든 선택지 초기화
		// document.querySelectorAll('.choice-list').forEach((choice, index) => {
		// 	choice.classList.toggle('show', index === 0);
            if (index === 0) {
                choice.setAttribute('tabindex', '0');
            } else {
                choice.setAttribute('tabindex', '-1');
            }
		// 	choice.querySelectorAll('li').forEach(li => li.classList.remove('disabled', 'show'));
		// 	choices.push(choice);
		// });

		// // 버튼 상태 초기화
		// document.querySelectorAll('.btn-complete').forEach(btn => {
		// 	btn.disabled = true;
		// 	btn.classList.remove('delete');
		// });
		// document.querySelectorAll('.btn-delete').forEach(btn => {
		// 	btn.disabled = true;
		// });
		// // document.querySelectorAll('.choice-list').qu

		// // 텍스트 및 선택 박스 클래스 초기화
		// document.querySelectorAll('.choice-box').forEach(box => {
		// 	box.classList.remove('correct', 'false', 'next-stage', 'noneClick');
		// 	// box.style.display = 'none';
		// 	box.classList.add('noneClick');
		// });

		// document.querySelectorAll('.text-box').forEach(box => {
		// 	box.classList.add('noneClick');
		// });

		// document.querySelectorAll('.question-stage').forEach(box => {
		// 	box.classList.remove('correct', 'false', 'next-stage');
		// });

		// // 카트 및 퀴즈패드 상태 초기화
		// const cart = document.querySelector('.cart');
		// cart.classList.remove('moveCart', 'moveCartOut');
		// cart.querySelector('.quizpad')?.classList.remove('on');

		// // act-stage 초기화
		// document.querySelectorAll('.act-stage01 .step-wrp, .act-stage01 .intro-char').forEach(el => {
		// 	el.style.display = 'block';
		// });
		// document.querySelector('.act-stage01')?.classList.remove('no-touch');

		// // 보석 초기화
		// document.querySelectorAll('.pick_jewel').forEach(jewel => {
		// 	jewel.classList.remove('picked');
		// 	const jewelNumber = jewel.className.match(/pick_jewel(\d+)/)?.[1];
		// 	if (jewelNumber) {
		// 		jewel.querySelector('img').src = `../img/game01/work-jewel${jewelNumber}_01.png`;
		// 	}
		// 	jewel.className = `pick_jewel pick_jewel${jewelNumber}`;
            $(jewel).append("<i class='click-here text-hide'>클릭유도</i>");
		// });

		// // 게이지 초기화
		// updateGaugeBar();

		// // 화면 초기화
		// document.querySelectorAll('.game-stage').forEach(stage => stage.classList.remove('show'));
		// document.querySelector('.game-wrp')?.classList.add('begin-bg');
		// document.querySelector('#home')?.classList.add('show');
		// $('.gauge').show();
		// $('.fail-stage, .ending-page').removeClass('show');

		// // 엔딩 버블 숨기기
		// const endingBubble = document.querySelector('.ending-bubble');
		// if (endingBubble) {
		// 	endingBubble.style.visibility = 'hidden';
		// 	endingBubble.innerHTML = '';
		// }

		// // 보석 결과 숨기기
		// document.querySelectorAll('.ending-jewel').forEach(el => el.style.display = 'none');

		// // xAPI 로깅
		// if (window.octoPlayerXAPI) {
		// 	octoPlayerXAPI.sendLog('게임 재시작');
		// }
	}

	function resetGame2() {
		const textBox = document.querySelector('.text-box');
		const choiceBox = document.querySelector('.choice-box');

		console.log('리셋 버튼2 클릭됨');

		// 게임 리셋 인식
		gameEnded = false;

		// $('.icon-home').css({'opacity':'0', 'visibility': 'hidden'});
		// $('#lang').addClass('active');

		// .stage-text와 .choice-list들을 원래 순서대로 다시 append
		originalStageOrder.forEach(num => {
			const stage = document.querySelector(`.stage-text.stage${num}`);
			const choice = document.querySelector(`.choice-list.choice-list${num}`);

			if (stage && choice) {
				textBox.appendChild(stage);
				choiceBox.appendChild(choice);
			}
		});

		// 기본 변수 초기화
		currentStageIndex = 0;
		wrongStageIndices = [];
		totalPickCount = 20;
		currentPickCount = 0;
		pickedJewels = [];
		stages.length = 0;
		choices.length = 0;
		stagesToRetry.length = 0;
		delayedMoveIndex = null;
		correctCount = 0;
		gaugePercent = 100;
		wrongCount = 0;

		// 배경음 아이콘 보이기
		$('.icon-spk').show();

		// 문제 보석 초기화
		$('.answer-jewel').removeClass('active')

		// 모든 스테이지 초기화
		document.querySelectorAll('.stage-text').forEach((stage, index) => {
			stage.classList.toggle('show', index === 0);
            if (index === 0) {
                stage.setAttribute('tabindex', '0');
            } else {
                stage.setAttribute('tabindex', '-1');
            }
			stage.classList.remove('correct', 'false', 'answer-retry');
			const answerText = stage.querySelector('.answer-text');
			if (answerText) {
				answerText.querySelectorAll('p').forEach(p => p.textContent = '');
				answerText.classList.remove('show');
			}
			stages.push(stage);
		});

		// 모든 선택지 초기화
		document.querySelectorAll('.choice-list').forEach((choice, index) => {
			choice.classList.toggle('show', index === 0);
            if (index === 0) {
                choice.setAttribute('tabindex', '0');
            } else {
                choice.setAttribute('tabindex', '-1');
            }
			choice.querySelectorAll('li').forEach(li => li.classList.remove('disabled', 'show'));
			choices.push(choice);
		});

		// 버튼 상태 초기화
		document.querySelectorAll('.btn-complete').forEach(btn => {
			btn.disabled = true;
			btn.classList.remove('delete');
		});
		document.querySelectorAll('.btn-delete').forEach(btn => {
			btn.disabled = true;
		});
		// document.querySelectorAll('.choice-list').qu

		// 텍스트 및 선택 박스 클래스 초기화
		document.querySelectorAll('.choice-box').forEach(box => {
			box.classList.remove('correct', 'false', 'next-stage', 'noneClick');
			// box.style.display = 'none';
			box.classList.add('noneClick');
		});

		document.querySelectorAll('.text-box').forEach(box => {
			box.classList.add('noneClick');
		});

		document.querySelectorAll('.question-stage').forEach(box => {
			box.classList.remove('correct', 'false', 'next-stage');
		});

		// 카트 및 퀴즈패드 상태 초기화
		const cart = document.querySelector('.cart');
		cart.classList.remove('moveCart', 'moveCartOut');
		cart.querySelector('.quizpad')?.classList.remove('on');

		// act-stage 초기화
		document.querySelectorAll('.act-stage01 .step-wrp, .act-stage01 .intro-char').forEach(el => {
			el.style.display = 'block';
		});
		document.querySelector('.act-stage01')?.classList.remove('no-touch');

		// 보석 초기화
		document.querySelectorAll('.pick_jewel').forEach(jewel => {
			jewel.classList.remove('picked');
			const jewelNumber = jewel.className.match(/pick_jewel(\d+)/)?.[1];
			if (jewelNumber) {
				jewel.querySelector('img').src = `../img/game01/work-jewel${jewelNumber}_01.png`;
			}
			jewel.className = `pick_jewel pick_jewel${jewelNumber}`;
            $(jewel).append("<i class='click-here text-hide'>클릭유도</i>");
		});

		// 게이지 초기화
		updateGaugeBar();

		// 화면 초기화
		document.querySelectorAll('.game-stage').forEach(stage => stage.classList.remove('show'));
		document.querySelector('.game-wrp')?.classList.add('begin-bg');
		// $('.intro-stage .btn-cmp').click();
		document.querySelector('.intro-stage')?.classList.add('show');
		$('.gauge').show();
		$('.fail-stage, .ending-page').removeClass('show');

		// 엔딩 버블 숨기기
		const endingBubble = document.querySelector('.ending-bubble');
		if (endingBubble) {
			endingBubble.style.visibility = 'hidden';
			endingBubble.innerHTML = '';
		}

		// 보석 결과 숨기기
		document.querySelectorAll('.ending-jewel').forEach(el => el.style.display = 'none');

		// xAPI 로깅
		if (window.octoPlayerXAPI) {
			octoPlayerXAPI.sendLog('게임 재시작');
		}
	}

	// 이미지 프리로드 함수 추가
	function preloadImages(imageArray, callback) {
		let loaded = 0;
		let total = imageArray.length;
		if (total === 0 && typeof callback === 'function') callback();
		for (let i = 0; i < total; i++) {
			const img = new Image();
			img.onload = () => {
				loaded++;
				if (loaded === total && typeof callback === 'function') callback();
			};
			img.src = imageArray[i];
		}
	}
	// 프리로드할 이미지 목록
	const imagesToPreload = [
		'../img/game01/work-jewel01_01.png',
		'../img/game01/work-jewel01_02.png',
		'../img/game01/work-jewel01_03.png',
		'../img/game01/work-jewel02_01.png',
		'../img/game01/work-jewel02_02.png',
		'../img/game01/work-jewel02_03.png',
		'../img/game01/work-jewel03_01.png',
		'../img/game01/work-jewel03_02.png',
		'../img/game01/work-jewel03_03.png',
		'../img/game01/work-jewel04_01.png',
		'../img/game01/work-jewel04_02.png',
		'../img/game01/work-jewel04_03.png',
		'../img/game01/work-jewel05_01.png',
		'../img/game01/work-jewel05_02.png',
		'../img/game01/work-jewel05_03.png',
		'../img/game01/work-jewel06_01.png',
		'../img/game01/work-jewel06_02.png',
		'../img/game01/work-jewel06_03.png',
		// 돌 떨어지는 효과 이미지 (1~26번)
		...Array.from({length: 26}, (_, i) => `../img/game01/drop-stone-${i+1}.png`)
	];
	preloadImages(imagesToPreload);
})
