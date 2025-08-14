function makeCorner(arr){
    var num = arr.split('-');
    var cornerWrap = {};
    var ol = document.createElement('ol');
    ol.classList.add('index-corner-list');

    for (var val in cornerType) {
        let li = document.createElement('li');
        li.classList.add('part');
        $(li).append(`<strong>${cornerType[val]}</strong><ol></ol>`);
        cornerWrap[val] = li;
    }

    var before = 'intro';
    var total = uiData[num[0]].part[num[1]].corner;
    uiData[num[0]].part[num[1]].corner.forEach((corner, idx) => {
        var current = corner.type;
        var li = `<li><div data-page="${num[0]}-${num[1]}-${idx}" role="button">${corner.title}</div></li>`;

        $(cornerWrap[current]).find('ol').append(li);

        current !== before && ol.append(cornerWrap[before]);
        idx === total.length-1 && ol.append(cornerWrap[current]);

        before = current;
    });

    $('.index-corner').append(ol).mCustomScrollbar({
        mouseWheel:{ scrollAmount: 200 },
    });

    $(`.index-corner-list [data-page=${document.querySelector('#wrap').dataset.lesson}]`).parent().addClass('active');
}

function init(arr){
    var thisfilename = decodeURI(document.URL).substring(decodeURI(document.URL).lastIndexOf('/') + 1, decodeURI(document.URL).length);
    var page = arr.split('-'),
        lesson = uiData[page[0]],
        part = lesson.part[page[1]];

    for (var i = 0; i < part.corner.length; i++) {
        if(thisfilename == part.corner[i].url){
            arr += `-${i}`
            break;
        }
    }

    page = arr.split('-');
    var corner = part.corner[page[2]];
    $('#wrap').attr('data-lesson', arr);

    // 상단바
    var $bread = $('.page-bread')
    $bread.append(`<span>${lesson.index}. ${lesson.title}</span>`);
    $bread.append(`<span class="hd-part">${part.title}</span>`);
    if(part.index){
        $('.hd-part').prepend(`<span class="num-circle">${part.index}</span> `)
    }
    $('#page-num').text(`${corner.page} 쪽`);
    $('#other-num').text(`${corner.otherPage} 쪽`);

    // 하단바
    var changeLesson = page[0]*1,
        changePart = page[1]*1,
        changeCorner = page[2]*1;

    makeCorner(arr);

    $(`.index-lesson-list>li:nth-child(${arr.split('-')[0]*1+1}) .part-list>li`).eq(arr.split('-')[1]).addClass('active');

    conerNavi[lesson.navi].forEach((item, i) => {
        for (let i = 0; i < part.corner.length; i++) {
            var num;
            if(part.corner[i].type === item){
                num = i;
                break;
            }
        }

        $('.ft-navi').append(`<button type="button" class="ft-navi-link" data-page="${changeLesson}-${changePart}-${num}"><span>${cornerType[item]}</span></button>`);
    });

    $('.ft-navi button').eq(conerNavi[lesson.navi].indexOf(corner.type)).addClass('active');

    var activePart = $(`.index-corner-list [data-page=${document.querySelector('#wrap').dataset.lesson}]`).closest('.part');

    $('#current').text(activePart.find('li.active').index()+1);
    $('#total').text(activePart.find('li').length);

    // !arr.split('-')[1] && $('.con-paging-prev').prop('disabled', true);

    $('.icon-paging-prev').attr('data-page', `${changeLesson}-${changePart}-${changeCorner-1}`);
    $('.icon-paging-next').attr('data-page', `${changeLesson}-${changePart}-${changeCorner+1}`);
}

$(function(){
    $('#wrap').append(uiInner);

    function markPartlist(start, total, item, idx){
        var ol = document.createElement('ol');
        ol.classList.add('part-list');
        for (let i = start; i < total; i++) {
            var li = document.createElement('li');
            li.innerHTML = `<div role="button">${item.part[i].title}</div>`;
            item.part[i].icon && li.classList.add('dot');
            item.part[i].corner && (li.dataset.corner = `${idx}-${i}`);
            ol.appendChild(li);
        }
        return ol;
    }

    uiData.forEach((item, idx) => {
        var lesson =  document.createElement('li');
        lesson.innerHTML = `<div>${item.title}</div>`;

        if(item.middle){
            var ol = document.createElement('ol');
            for (let i = 0; i < item.middle.length; i++) {
                var li = document.createElement('li');
                var startIdx = item.middle[i-1] ? item.middle[i-1].part : 0;

                li.innerHTML = `<div role="button">${item.middle[i].title}</div>`;

                li.appendChild(markPartlist(startIdx, startIdx+item.middle[i].part, item, idx));
                ol.appendChild(li);
            }
            lesson.appendChild(ol);
        }else if(item.part){
            var ol = markPartlist(0, item.part.length, item, idx);
            lesson.appendChild(ol);
        }

        document.querySelector('.index-lesson-list').appendChild(lesson);
        $('.index-lesson').mCustomScrollbar({
            mouseWheel:{ scrollAmount: 200 },
        });
    });

    $(document).on('click', '.index-lesson-list [role=button]', function(){
        var $corner = $('.index-corner-list');
        $('.index-lesson-list .active').removeClass('active');
        $(this).parent().addClass('active');

        $('.index-corner').hasClass('mCustomScrollbar') && $('.index-corner').mCustomScrollbar('destroy');
        $('.index-corner').empty();

        if(this.parentElement.dataset.corner){
            makeCorner(this.parentElement.dataset.corner);
        }
    });

    $(document).on('click', '.index-toggle', function(){
        var $index = $('#index');

        if($index.hasClass('active')){
            $index.removeClass('active');
            setTimeout(function(){
                $index.hide();
            },600);
        }else{
            $index.show(0, function(){
                $index.addClass('active');
            });
            $('.index-navi>div').mCustomScrollbar("scrollTo", "top",{
                scrollInertia: 0
            });
        }
    });

    $(document).on('click', '[data-page]', function(){
        var page = this.dataset.page.split('-');
        var lesson = uiData[page[0]],
            part = lesson.part[page[1]],
            corner = part.corner[page[2]];

        var url = `/viewer/contents/index.html?contentInformationURL=../../resource/contents/${lesson.folder}&pageName=${corner.url}`;

        jj.link.html(url, '_top');
    });

    init(document.querySelector('#wrap').dataset.lesson);
})
