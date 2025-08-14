$(function(){
    const html = `<div class="container">
        <ul class="depth-wrp">
            <li><button type="button">품질/고객만족</button></li>
            <li><button type="button">의료기기/의약품</button></li>
            <li><button type="button">정보보안/정보기술</button></li>
            <li><button type="button">환경/에너지</button></li>
            <li><button type="button">안전/재난</button></li>
            <li><button type="button">식품/화장품</button></li>
            <li><button type="button">교육훈련</button></li>
            <li><button type="button">윤리/인권</button></li>
            <li><button type="button">기록</button></li>
            <li><button type="button">지속가능/협력</button></li>
        </ul>

        <div class="depth-container">
            <div class="sidemenu">
                <button type="button" class="icon icon-close-gray">닫기</button>
                <ul class="sidemenu-list">
                    <li><a href="/page/view.do?pageId=PAGE000327&menuId=MENU000886"><div class="text-primary">ISO 9001</div><div>품질경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000328&menuId=MENU000887"><div class="text-primary">ISO 10002</div><div>고객만족경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000329&menuId=MENU000888"><div class="text-primary">IATF 16949</div><div>자동차 품질경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000330&menuId=MENU000889"><div class="text-primary">ISO 41001</div><div>시설관리 경영시스템</div></a></li>
                </ul>
            </div>
            <div class="sidemenu">
                <button type="button" class="icon icon-close-gray">닫기</button>
                <ul class="sidemenu-list">
                    <li><a href="/page/view.do?pageId=PAGE000331&menuId=MENU000890"><div class="text-primary">ISO 15378</div><div>의료포장재 품질경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000332&menuId=MENU000891"><div class="text-primary">ISO 13485</div><div>의료기기 품질경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000333&menuId=MENU000892"><div class="text-primary">ISO 14155</div><div>의료기기 임상시험관리기준</div></a></li>
                </ul>
            </div>
            <div class="sidemenu">
                <button type="button" class="icon icon-close-gray">닫기</button>
                <ul class="sidemenu-list">
                    <li><a href="/page/view.do?pageId=PAGE000334&menuId=MENU000893"><div class="text-primary">ISO/IEC 27001</div><div>정보보안경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000335&menuId=MENU000894"><div class="text-primary">ISO/IEC 27701</div><div>개인정보보호경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000336&menuId=MENU000895"><div class="text-primary">ISO 28000</div><div>공급망사슬보안경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000337&menuId=MENU000896"><div class="text-primary">ISO/IEC 27017</div><div>클라우드서비스 정보보호 통제지침</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000338&menuId=MENU000897"><div class="text-primary">ISO/IEC 27018</div><div>공공 클라우드 개인정보보호 통제지침</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000339&menuId=MENU000898"><div class="text-primary">ISO/IEC 27799</div><div>보건의료 정보보호관리기준</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000340&menuId=MENU000899"><div class="text-primary">ISO/IEC 20000</div><div>IT서비스관리시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000341&menuId=MENU000900"><div class="text-primary">ISO/IEC 42001</div><div>인공지능경영시스템</div></a></li>
                </ul>
            </div>
            <div class="sidemenu">
                <button type="button" class="icon icon-close-gray">닫기</button>
                <ul class="sidemenu-list">
                    <li><a href="/page/view.do?pageId=PAGE000342&menuId=MENU000901"><div class="text-primary">ISO 14001</div><div>환경경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000343&menuId=MENU000902"><div class="text-primary">ISO 50001</div><div>에너지경영시스템</div></a></li>
                </ul>
            </div>
            <div class="sidemenu">
                <button type="button" class="icon icon-close-gray">닫기</button>
                <ul class="sidemenu-list">
                    <li><a href="/page/view.do?pageId=PAGE000344&menuId=MENU000903"><div class="text-primary">ISO 45001</div><div>안전보건경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000345&menuId=MENU000904"><div class="text-primary">ISO 22301</div><div>비즈니스연속성경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000346&menuId=MENU000905"><div class="text-primary">ISO 39001</div><div>도로교통안전경영시스템</div></a></li>
                </ul>
            </div>
            <div class="sidemenu">
                <button type="button" class="icon icon-close-gray">닫기</button>
                <ul class="sidemenu-list">
                    <li><a href="/page/view.do?pageId=PAGE000347&menuId=MENU000906"><div class="text-primary">ISO 22000</div><div>식품안전경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000348&menuId=MENU000907"><div class="text-primary font-mont">FSSC 22000</div><div>식품안전시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000349&menuId=MENU000908"><div class="text-primary">ISO 22716</div><div>화장품 우수제조관리기준</div></a></li>
                </ul>
            </div>
            <div class="sidemenu">
                <button type="button" class="icon icon-close-gray">닫기</button>
                <ul class="sidemenu-list">
                    <li><a href="/page/view.do?pageId=PAGE000350&menuId=MENU000909"><div class="text-primary">ISO 10015</div><div>교육훈련경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000351&menuId=MENU000910"><div class="text-primary">ISO 21001</div><div>교육기관경영시스템</div></a></li>
                </ul>
            </div>
            <div class="sidemenu">
                <button type="button" class="icon icon-close-gray">닫기</button>
                <ul class="sidemenu-list">
                    <li><a href="/page/view.do?pageId=PAGE000352&menuId=MENU000911"><div class="text-primary">ISO 3700</div><div>부패방지경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000353&menuId=MENU000912"><div class="text-primary">ISO 37301</div><div>규범준수경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000355&menuId=MENU000913"><div class="text-primary">ISO 45003</div><div>심리사회적 위험관리시스템</div></a></li>
                </ul>
            </div>
            <div class="sidemenu">
                <button type="button" class="icon icon-close-gray">닫기</button>
                <ul class="sidemenu-list">
                    <li><a href="/page/view.do?pageId=PAGE000354&menuId=MENU000914"><div class="text-primary">ISO 30301</div><div>기록경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000356&menuId=MENU000915"><div class="text-primary">ISO 15489-1</div><div>문헌정보 기록관리시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000357&menuId=MENU000916"><div class="text-primary">ISO 23081-1</div><div>메타데이터 기록관리시스템</div></a></li>
                </ul>
            </div>
            <div class="sidemenu">
                <button type="button" class="icon icon-close-gray">닫기</button>
                <ul class="sidemenu-list">
                    <li><a href="/page/view.do?pageId=PAGE000358&menuId=MENU000917"><div class="text-primary">ISO 20121</div><div>지속가능이벤트경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000359&menuId=MENU000918"><div class="text-primary">ISO 44001</div><div>협업비즈니스관계경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000360&menuId=MENU000919"><div class="text-primary">ISO 31000</div><div>리스크관리경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000414&menuId=MENU000920"><div class="text-primary">ISO 55001</div><div>자산경영시스템</div></a></li>
                    <li><a href="/page/view.do?pageId=PAGE000409&menuId=MENU000921"><div class="text-primary">ISO 26000</div><div>사회적책임 수준진단</div></a></li>
                </ul>
            </div>
        </div>
    </div>`;

    const $isomenu = $('.isomenu');

    $isomenu.html(html);

	const $buttons = $('.depth-wrp button');
    const $menus = $('.depth-container .sidemenu');
	const offsetTop = $isomenu.length ? $isomenu.offset().top : 0;

	$(window).on('scroll', function () {
		const scrollTop = $(window).scrollTop();

		if(!$isomenu.length){
			return false;
		}

		if (scrollTop >= offsetTop) {
			$isomenu.addClass('is-sticky');
		} else {
			$isomenu.removeClass('is-sticky');
		}
	}).trigger('scroll');


    $buttons.eq($isomenu.attr('data-depth')).addClass('active');

    $buttons.on('mouseenter click', function () {
        const index = $(this).parent().index();
        const $btn = $(this);
        const btnOffset = $btn.offset().left - $isomenu.offset().left;

        $menus.removeClass('active');
        $menus.eq(index).addClass('active').css('left', btnOffset);
    });

    $isomenu.on('mouseleave', function () {
        $menus.removeClass('active').removeAttr('style');
    });

	$menus.find('.icon').click(function(){
		$menus.removeClass('active').removeAttr('style');
	});
});