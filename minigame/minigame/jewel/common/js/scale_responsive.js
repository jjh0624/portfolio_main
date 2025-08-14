// 반응형 스케일 조정 함수
function setView() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const wrap = document.querySelector('#wrap.wrapper');

    // 1280x720 기준으로 스케일 계산
    const horizontalZoomRate = width / 1280;
    const verticalZoomRate = height / 720;
    const zoomRate = Math.min(horizontalZoomRate, verticalZoomRate);

    // 소수점 4자리까지 제한하여 부드러운 전환
    const roundedZoomRate = Math.round(zoomRate * 10000) / 10000;

    wrap.style.transform = `scale(${roundedZoomRate})`;
    wrap.style.width = '1280px';
    wrap.style.left = `${(width - 1280 * roundedZoomRate) / 2}px`;

    return roundedZoomRate; // 스케일 값을 반환
}

// iframe 높이 설정 함수
function iframeset() {
    const rootElement = document.getElementById('wrap');
    if (rootElement) {
        const originalHeight = rootElement.offsetHeight;
        const scale = setView(); // 현재 적용된 스케일 값 가져오기
        const scaledHeight = originalHeight * scale; // 스케일이 적용된 실제 높이 계산

        // 콘솔에 값 출력
        console.log('원본 높이:', originalHeight);
        console.log('스케일 값:', scale);
        console.log('스케일 적용 후 높이:', scaledHeight);

        const message = {
            type: 'iframeCurrentPage',
            data: 1,
            height: scaledHeight // 스케일이 적용된 높이 전달
        };
        console.log('부모 창으로 전달되는 메시지:', message);

        window.parent.postMessage(message, '*');
    }
}

// 메시지 수신 함수
function receiveMessage(event) {
    if (event.data.type == 'terminated') contentsClose();
}

// 컨텐츠 종료 함수
function contentsClose() {
    const message = {
        type: 'deinit'
    };
    window.parent.postMessage(message, '*');
}

// 초기 설정
function init() {
    setView();
    iframeset();
}

// 이벤트 리스너 등록
window.addEventListener('load', init);
window.addEventListener('resize', init);
window.addEventListener('orientationchange', init);
window.addEventListener("message", receiveMessage, false);