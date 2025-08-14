jQuery(function($){
	"use strict";

	$('.q-line').each(function(){
		var t = $(this);
		t.prepend('<canvas id="canvas-'+t.attr('id')+'" class="canvas"></canvas>').find('.q-line-btn').each(function(i){
			$(this).append('<button type="button" class="text-hide" data-first>선택</button>');
		});

		if(t.find('.line-cross').length){
			$('.line-cross .q-line-btn').each(function(i){
				var t = $(this);
				t.prepend('<button type="button" class="text-hide" data-last>선택</button>');
			});
		}
	});

	var Canvas = {};

	function CANVAS(){
		this.line = '.line-from, .line-to, .line-cross',
		this.moveLine = function(startBtn, endBtn, color, width){
			var sx = startBtn.offset().left-this.parent.offset().left+15;
			var sy = startBtn.offset().top-this.parent.offset().top+12;
			var ex = endBtn.offset().left-this.parent.offset().left+9;
			var ey = endBtn.offset().top-this.parent.offset().top+12;

			this.ctx.lineWidth = width || 6;
			this.ctx.strokeStyle = color || '#04A1E8';
			this.ctx.lineCap = "round";
			this.ctx.beginPath();
			this.ctx.moveTo(sx, sy);
			this.ctx.lineTo(ex, ey);
			this.ctx.stroke();
			this.ctx.closePath();
		},
		this.clear = function(){
			var parent = this.parent;
			this.lineReset();
			parent.find('.line-done, .done').removeClass('line-done done');
			this.ctx.clearRect(0, 0, this.parent.width(), this.parent.height());
			this.chkAnswer = this.isMulti ? this.isMulti : this.parent.find('.line-from .q-line-btn[data-line]').length;
			parent.removeClass('active');
			parent.find('.q-line-btn[data-line]').each(function(){
				$(this).data({
					'done': '',
					'refuse': '',
				});
				if($(this).parents('.line-from').length){
					$(this).data('remain', parent.find('[data-line="'+this.dataset.line+'"]').length-1);
				}
			});
			sizeSet(this.parent, document.getElementById(this.parent.find('canvas').attr('id')));
		},
		this.lineReset = function(){
			this.parent.removeClass('drawing');
			$('.line-start').removeClass('line-start');
			$(this.line).removeClass('disabled');
		}
	}

	function appZoom(){
		if(parent.ZOOMVALUE == undefined) {
			parent.ZOOMVALUE = 1;
		}
		return parent.ZOOMVALUE;
	}

	function offsetValue(value){
		return value/appZoom();
	}

	function sizeSet(o, canvas){
		canvas.width = o.width();
		canvas.height = o.height();
	}

	function lineAnswerLoop(el, endParent, id){
		el.each(function(){
			var startBtn = $(this);
			var startParent = startBtn.parent();
			var endBtn = endParent.find('[data-line="'+startParent.data('line')+'"]').children('button[data-first]');
			if(endBtn.length){
				Canvas[id].moveLine(startBtn, endBtn, "rgba(255,0,0,.7)", 6);
			}
		});
	}

	function lineDrawAnswer(el){
		var id = $(el).attr('id');
		var start = $(el).find('.line-from .q-line-btn[data-line] button[data-first]');
		var end = $(el).find('.line-to');

		if(Canvas[id].isCross){
			lineAnswerLoop(start, $(el).find('.line-cross'), id);
			lineAnswerLoop($(el).find('.line-cross .q-line-btn[data-line] button[data-last]'), end, id);
		}else if(Canvas[id].isMulti){
			lineAnswerLoop(start, end, id);
			$(el).find('[data-multi]').each(function(){
				var multiArr = $(this).data('line').split(',');
				for (var i = 0; i < multiArr.length; i++) {
					var endTarget = $(el).find('[data-line="'+multiArr[i]+'"]');
					var endBtn = endTarget.children('button');
					Canvas[id].moveLine($(this).children('button'),endBtn, "rgba(255,0,0,.7)", 6);
				}
			});
		}else{
			lineAnswerLoop(start, end, id);
		}
		$(el).find('.q-line-btn').addClass('line-done').removeClass('line-start');
	}

	function lineDraw(id){
		var o = $('#'+id);
		var btn = o.find('.q-line-btn');
		var btnAnswer = $('[data-line-target="#'+o.attr('id')+'"]');
		var canvas = document.getElementById(o.find('canvas').attr('id'));
		var startBtn, endBtn, multiAnswer;

		sizeSet(o, canvas);
		Canvas[id] = new CANVAS();
		Canvas[id].ctx = canvas.getContext("2d");
		Canvas[id].parent = o;
		Canvas[id].isCross = o.find('.line-cross').length;
		Canvas[id].isMulti = o.data('multi-line');
		Canvas[id].chkAnswer = Canvas[id].isMulti ? Canvas[id].isMulti : o.find('.line-from .q-line-btn[data-line]').length;

		!o.is(':visible') && o.addClass('hidden');

		if(Canvas[id].isCross){
			o.find('.line-from .q-line-btn[data-line]').each(function(){
				this.dataset.remain = o.find('[data-line="'+this.dataset.line+'"]').length-1;
			});
		}

		btn.on('click',function(e){
			var t = $(this);
			var parent = t.closest(Canvas[id].line);
			o = t.parents('.q-line');

			if(t.hasClass('line-done')) return false;

			parent.hasClass('disabled') && Canvas[id].lineReset();

			function btnLineDraw(startBtn, endBtn){
				Canvas[id].moveLine(startBtn, endBtn);
				Canvas[id].lineReset();
				endBtn = startBtn = '';
			}

			if(!o.hasClass('drawing')){
				startBtn = t.children('button');
				o.addClass('drawing');
				t.addClass('line-start');
				parent.addClass('disabled');
			}else if(Canvas[id].isCross){
				var startParent = startBtn.parents('[data-refuse]');
				var endParent = t.parents('[data-refuse]');
				var endData = t.data('line');

				endBtn = startParent.hasClass('line-to') ? t.children('button[data-last]') : t.children('button[data-first]');

				if(startParent.hasClass('line-cross')){
					startBtn = endParent.hasClass('line-from') ? startBtn.filter('[data-first]') : startBtn.filter('[data-last]');
				}

				if(endParent.data('refuse')){/*  to<->form 요건 if 추가 2021.07.14*/
					if(startParent.attr('class').indexOf(endParent.data('refuse')) !== -1 ||
					startBtn.hasClass('done') || endBtn.hasClass('done')){
						Canvas[id].lineReset();
						return false;
					}
				}
				btnLineDraw(startBtn, endBtn); /* 크로스,멀티라인 요건 추가 2021.06.09*/
				if( !startBtn.parent().hasClass('q-line-multi') ) { startBtn.addClass('done'); }
				if( !endBtn.parent().hasClass('q-line-multi') ) { endBtn.addClass('done'); }

				btn.each(function(i,el){
					if($(el).find('button').length === $(el).find('.done').length) $(el).addClass('line-done');
				});

				if(endData && $(startBtn).parent().data('line') === endData){
					var lineData = o.find('.line-from [data-line="'+endData+'"]').data('remain');
					o.find('.line-from [data-line="'+endData+'"]').data('remain', --lineData);
					!lineData && Canvas[id].chkAnswer--;
				}
			}else if(Canvas[id].isMulti){
				var limit = o.data('multi-limit');
				var prop;
				endBtn = t.children('button');
				btnLineDraw(startBtn, endBtn);

				function multiChk(el, el2){
					var refuse = el.data('refuse') || [];
					if(refuse.indexOf(el2.attr('id')) === -1){
						refuse.push(el2.attr('id'));
						var done = el.data('done') || 0 ;
						el.data('refuse', refuse);
						el.data('done', ++done);
						done === limit && el.addClass('line-done');
						return prop = true;
					}else{
						Canvas[id].lineReset();
						return prop = false;
					}
				}

				multiChk(t, $(startBtn).parent());
				multiChk($(startBtn).parent(), t);

				if(prop){
					var startLine = $(startBtn).parent().data('line')+'';
					var endLine = t.data('line')+'';

					(endLine.indexOf(startLine) !== -1 || startLine.indexOf(endLine) !== -1) && Canvas[id].chkAnswer--;
				}
			}else{
				endBtn = t.children('button');
				btnLineDraw(startBtn, endBtn);

				t.addClass('line-done');
				$(startBtn).parent().addClass('line-done');

				$(startBtn).parent().data('line') === t.data('line') && Canvas[id].chkAnswer--;
			}

			!Canvas[id].chkAnswer && o.addClass('active');

			if(btn.length === o.find('.line-done').length){
				o.addClass('end-line');
				// if(!btnAnswer.data('toggle')){
				// 	btnAnswer.addClass('active');
				// }else{
				// 	btnAnswer.data('qNum') - btnAnswer.data('aNum') === 1 && btnAnswer.addClass('active');
				// }
			}
		});

		btnAnswer.on('click',function(){
			//alert("d")
			var t = $(this);
			!t.data('toggle') && t.toggleClass('active');
			var parenttg = t.data('target'),
				qLineDiv = $(parenttg).find('.q-line') ;

			if (t.hasClass('active')){
				qLineDiv.each(function(e){
					
					lineDrawAnswer( this ) ;
				});
			} else {
				qLineDiv.each(function(e){
					$(this).removeClass('end-line').find('.line-done').removeClass('line-done');
					btn.find('.done').removeClass('done');
					Canvas[$(this).attr('id')].clear();
				});
			}
		});

		// 다시하기 버튼 누르면 리셋
		$('.btn-reset').on('click',function(){
			let resetTarget = $(this).data('line-target');
			$(resetTarget).each(function(e){
				$(this).removeClass('end-line').find('.line-done').removeClass('line-done');
				btn.find('.done').removeClass('done');
				Canvas[$(this).attr('id')].clear();
			});

			$(`.btn-toggle[data-line-target="${resetTarget}"]`).removeClass('active');
		});
	}

	setTimeout(function(){
		$('.q-line').each(function(){
			lineDraw($(this).attr('id'));
		});
	},300);



	$('[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var target = $(e.target.dataset.target).find('.hidden');
		if(target.length && target.closest('.tab-pane').hasClass('active')){
			target.removeClass('hidden');
			sizeSet(target, document.getElementById(target.find('canvas').attr('id')));
		}
	});

	$('.icon-reset[data-canvas]').on('click',function(){ //리셋
		Canvas[this.dataset.canvas].clear();
	});
});
