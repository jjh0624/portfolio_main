$(function(){
	'use strict';

    $('#wrap').addClass('start').removeClass('intro end')
    $('#round').addClass('show').siblings().removeClass('show');
    makeQuiz.run();


    $(document).on('click','[data-role=start]',function(){
        makeQuiz.run();
	});
})

function roundClear(){
	gameFinish();
	setTimeout(function(){
		if(isStep){
			if(step < maxStep){
				if(social){                
                    nextStep()
				} else {
					$('#modal-success').modal({backdrop: 'static'});
					return false;
				}
			} else {
				$gameWrp.addClass('finish');
			}
		} else {
			$gameWrp.addClass('finish');
		}
	}, 500)
}