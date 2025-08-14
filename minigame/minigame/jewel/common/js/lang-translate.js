/**
 * 다국어 번역 기능 - 공통 사용 스크립트
 * 사용법: 요소에 data-translate 속성을 부여하면 언어 변경 시 해당 텍스트를 번역함.
 */

// API 설정
const apiKey = 'naver-papago-GoT9zJh4';
const apiUrl = 'https://dev.d-aidt.com/v-api/v1/translate/text';

/**
 * 텍스트 번역 함수
 * @param {string} text - 번역할 텍스트
 * @param {string} sourceLang - 원본 언어 코드
 * @param {string} targetLang - 대상 언어 코드
 * @param {Function} callback - 번역 완료 후 실행할 콜백 함수
 */
function translateText(text, sourceLang, targetLang, callback) {
    if (sourceLang === targetLang) {
        callback(text);
        return;
    }

    // 요청 데이터 준비
    const bodyParams = new URLSearchParams();
    bodyParams.append('text', text);
    bodyParams.append('source', sourceLang);
    bodyParams.append('target', targetLang);

    // API 요청 옵션
    const requestOptions = {
        method: 'POST',
        headers: {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams
    };

    // API 호출
    fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.result === "OK") {
                callback(data.data.translatedText);
            } else {
                console.error("번역 실패:", data);
                callback(text);
            }
        })
        .catch(error => {
            console.error("API 호출 에러:", error);
            callback(text);
        });
}

/**
 * 페이지 내 모든 번역 가능한 요소에 번역 적용
 * @param {string} targetLang - 대상 언어 코드
 */
function applyTranslation(targetLang = 'en') {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const originalHTML = element.dataset.original || element.innerHTML;
        element.dataset.original = originalHTML; // 원문 저장

        // HTML 태그를 보존하면서 텍스트만 번역
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHTML;
        const textNodes = [];

        // 텍스트 노드만 추출
        const walker = document.createTreeWalker(
            tempDiv,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }

        // 각 텍스트 노드를 번역
        let translatedHTML = originalHTML;
        textNodes.forEach(textNode => {
            const originalText = textNode.textContent.trim();
            if (originalText) {
                translateText(originalText, 'ko', targetLang, translated => {
                    translatedHTML = translatedHTML.replace(originalText, translated);
                    element.innerHTML = translatedHTML;
                });
            }
        });
    });
}

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 드롭다운 select 방식
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            applyTranslation(selectedLang);
        });
    }

    // 리스트 클릭 방식 (li > button 구조)
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.lang-item li button');
        if (!button) return;

        let targetLang = 'ko'; // 기본값을 한국어로 설정

        // 아이콘 클래스에 따라 언어 코드 설정
        if (button.querySelector('.icon-jp')) targetLang = 'ja';
        else if (button.querySelector('.icon-en')) targetLang = 'en';
        else if (button.querySelector('.icon-ch')) targetLang = 'zh-CN';
        else if (button.querySelector('.icon-vn')) targetLang = 'vi';
        else if (button.querySelector('.icon-ko')) targetLang = 'ko';

        // 상단과 하단의 아이콘과 텍스트 교체
        const langBtn = document.querySelector('#lang .lang');
        if (langBtn) {
            const currentIcon = langBtn.querySelector('i:first-child').className;
            const currentText = langBtn.textContent.trim();

            const selectedIcon = button.querySelector('i').className;
            const selectedText = button.textContent.trim();

            // 상단 버튼 업데이트 (화살표 아이콘 유지)
            langBtn.innerHTML = `<i class="${selectedIcon}"></i>${selectedText}<i class="icon-arrow-up"></i>`;

            // 하단 리스트 항목 업데이트
            button.innerHTML = `<i class="${currentIcon}"></i>${currentText}`;

            // HTML의 lang 속성 업데이트
            document.documentElement.lang = targetLang;

            // 번역 적용
            applyTranslation(targetLang);
        }
    });
});
