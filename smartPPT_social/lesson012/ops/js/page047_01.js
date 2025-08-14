var $game = $("#game");
if ($game.length) {
  // reset
  $game
    .closest(".modal")
    .find("[data-dismiss=modal]")
    .click(function () {
      $game
        .removeClass("start finish")
        .find(".active,.is-correct,.not-correct")
        .removeClass("active is-correct not-correct")
        .end()
        .find("input")
        .val("");
      tC.attr("disabled", true);
      (i = 0), (xCount = 0);
      clearTimeout(goNextStage);
      $("#lst-quest").children().removeClass("show");
    });

  var goNextStage;
  $(".modal-alert-ox .btn-icon").click(function () {
    var ii = $("#gameQ li.active").index();
    $(".modal-alert-ox").modal("hide");
    if (correct == true) {
      iS.addClass("is-correct");
      $("#word-block p").eq(ii).addClass("is-correct");
    } else {
      iS.addClass("not-correct");
      $("#word-block p").eq(ii).addClass("is-correct");
    }
    if (tQ.filter(".active").index() + 1 === count) {
      finish();
      goNextStage = setTimeout(function () {
        if (count === tStep.filter(".is-correct").length) {
          $("#gameAlertFin .alert-finish-perpect")
            .addClass("active")
            .siblings()
            .removeClass("active");
        } else {
          $("#gameAlertFin .alert-finish-perpect-no")
            .addClass("active")
            .siblings()
            .removeClass("active");
        }
        $("#gameAlertFin").modal({ backdrop: "static" });
      }, 1000);
      return;
    } else {
      goNextStage = setTimeout(nextStep, 1000);
    }
  });
  $("#gameAlertAgain .btn-icon").click(function () {
    $("#gameAlertAgain").modal("hide");
  });

  $("#gameAlertFin .btn-icon:first").click(function () {
    $game
      .removeClass("start finish")
      .find(".active,.is-correct,.not-correct")
      .removeClass("active is-correct not-correct")
      .end()
      .find("input")
      .val("");
    tC.attr("disabled", true);
    i = 0;
    $("#gameAlertFin").modal("hide");
    $("#gameQ > li:last").removeClass('fin');
    $(".last-text").hide()
    $('.last-text > span:last').text('');
    $("#lst-quest").children().removeClass("show");
  });
  $("#gameAlertFin .btn-icon:last").click(function () {
    $(".answer-bx button").attr("disabled", true);
    $(".answer-bx.discription").addClass("no-pointer");
    $(".answer-bx input").attr("disabled", true);
    $("#gameQ > li:last").addClass('fin');
    $("#lst-quest > p").removeClass("active");
  });

  var tStep = $("#gameStep").children(),
    tStart = $("#gameStart"),
    tC = $(".game-control .answer-bx button"),
    tQ = $("#gameQ").children(),
    i = 0,
    iS = tStep.eq(0),
    iO = tQ.eq(0),
    count = tQ.length,
    xCount = 0;
  correct = false;

  tStart.click(function () {
    playAudio("../../common/media/game/click.mp3");

    $("#lst-quest").children().removeClass("active");
    $("#lst-quest").children().removeClass("show");

    if ($game.hasClass("start")) {
        $game
            .removeClass("start finish")
            .find(".active,.is-correct,.not-correct")
            .removeClass("active is-correct not-correct")
            .end()
            .find("input")
            .val("");
        tC.attr("disabled", true);
        i = 0;
        xCount = 0;
        clearTimeout(goNextStage);
        $("#gameQ > li:last").removeClass('fin');
        $('.last-text').hide();
        $('.last-text > span:last').text('');
    } else {
        $game.addClass("start");
        $(".answer-bx.discription").removeClass("no-pointer");

        // input 값이 있을 때만 버튼 활성화, 없으면 비활성화
        var inputVal = $(".game-control .answer-bx input").val();
        if (inputVal.trim() !== "") {
            $(".answer-bx button").removeAttr("disabled");
        } else {
            $(".answer-bx button").attr("disabled", true);
        }

        $(".answer-bx input").removeAttr("disabled");
        nextStep();
    }
    $(".game-control .answer-bx input").val("");
  });

  tC.click(function () {
    playAudio("common/media/game/click.mp3");
    var playerAnswer = $(".game-control .answer-bx input").val().replace(/\s+/g, '');
    var currentQuestion = $('#gameQ li.active'); 
    var correctAnswer = currentQuestion.data('answer') ? currentQuestion.data('answer').replace(/\s+/g, '') : '';

    playAudio("../../common/media/game/click.mp3");
    if (playerAnswer === correctAnswer) {
      correct = true;
      $("#gameAlertCorrect").modal({ backdrop: "static" });
      $(".game-control .answer-bx input").val("");
      if (tQ.filter(".active").index() + 1 === count) {
        finish();
      }
    } else {
      correct = false;
      // 오답 3번일 때
      $("#gameAlertOX").modal({ backdrop: "static" });
      $(".alert-correct").find("span").text(iO.data("answer"));
      $(".game-control .answer-bx input").val("");
    }
    $(this).attr("disabled", true);
  });

  $(".game-control .answer-bx button").attr("disabled", true);

  $(".game-control .answer-bx input").on("change keyup", function () {
    var t = $(this),
      o = $(".game-control .answer-bx"),
      input = o.find("input");
    o.find("input").each(function (i) {
      if ($(this).val()) {
        o.find("button").removeAttr("disabled");
      } else {
        o.find("button").attr("disabled", true);
        return false;
      }
    });
  });

  function nextStep() {
    
    (iS = tStep.eq(i)), (iO = tQ.eq(i));
    iS.addClass("active");
    $("#lst-quest").children().eq(i).addClass("active").siblings().removeClass("active");
    iO.addClass("active").siblings().removeClass("active");

    if(i > 0 && i < 9){
      $("#lst-quest").children().eq(i - 1).addClass("show");
      // console.log("마지막 아님")
    }else if(i >= 9){
      $("#lst-quest").children().eq(i).addClass("show");
      // console.log("마지막")
    }
    
    
    // 암호맞추기 answer1~6 에active 주기위한 것
    const answerClass = `.answer${i}`; 
    const $answerElement = $(answerClass);
    
    if ($answerElement.length) {
      $answerElement.addClass("active");
      
      if (tQ.filter(":last-child").hasClass('active')) {
        $('.last-text').show();
      }
    }

    
    ++i;
    
    
    
  }
  
  
  function finish() {
    tStep.filter(":last-child").addClass("active").siblings();
    $game.addClass("finish");
    
    if ($('#game').hasClass('finish')) {
      // $('.last-text > span:last').text('킬리만자로산');
      // $("#lst-quest").children().removeClass("active");
      $("#lst-quest").children(":last-child").addClass("active");
      $("#lst-quest").children(":last-child").addClass("show");
      // $("#lst-quest").children().removeClass("show");
    }
  }

$('#gameAlertOX').on('show.bs.modal', function() {
  var audio = document.getElementById('funny-wrong');
  audio.currentTime = 0; 
  audio.play(); 
});

$('#gameAlertCorrect').on('show.bs.modal', function() {
  var audio = document.getElementById('funny-correct');
  audio.currentTime = 0;
  audio.play();
});

$('#gameAlertFin').on('show.bs.modal', function() {
  var audio = document.getElementById('funny-ending');
  audio.currentTime = 0;
  audio.play();
});
  
}
