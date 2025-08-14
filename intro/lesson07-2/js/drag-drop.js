let currentStep = 1;
$(function() {
    // 게임 시작 시 첫 번째 drop-item에 효과 적용
    $('.drop-item[data-drag="' + currentStep + '"]').addClass('blink-1-after');
    
    $('.drag-item').on('click', function() {
        let dragId = $(this).data("drag");

        if (dragId !== currentStep) {
            $(this).addClass("shake-bottom");
            setTimeout(() => {
                $(this).removeClass("shake-bottom");
            }, 500);
            return;
        }

        let $dropTarget = $('.drop-item[data-drag="' + dragId + '"]');

        if ($dropTarget.length) {
            let dragOffset = $(this).offset();
            let dropOffset = $dropTarget.offset();
            let translateX = dropOffset.left - dragOffset.left;
            let translateY = dropOffset.top - dragOffset.top;
            let dropWidth = $dropTarget.outerWidth();
            let dropHeight = $dropTarget.outerHeight();

            // 원래 위치에 잔상 남기기 (clone)
            let $clone = $(this).clone().addClass("clone");
            $clone.css({
                position: "absolute",
                top: dragOffset.top + "px",
                left: dragOffset.left + "px",
                width: $(this).outerWidth() + "px",
                height: $(this).outerHeight() + "px",
                opacity: 0.1,
                pointerEvents: "none"
            });
            $("body").append($clone); // 복제한 잔상 추가

            // 원본 드래그 아이템 이동
            $(this).css({
                transform: 'translate(' + translateX + 'px, ' + translateY + 'px)',
                width: dropWidth + 'px',
                height: dropHeight + 'px'
            });

            setTimeout(() => {
                $dropTarget.removeClass('blink-1-after'); // 현재 단계 완료 후 효과 제거

                setTimeout(() => {
                    $dropTarget.addClass('on');
                    $(this).hide(); // 원래 요소 숨기기
                    currentStep++;

                    // 다음 drop-item에 효과 추가
                    $('.drop-item[data-drag="' + currentStep + '"]').addClass('blink-1-after');
                }, 2000);
            }, 300);
        }
    });

    $('.video-btn').on('click', function () {
        $(this).closest('.drop-item').addClass('finish');
    });
});