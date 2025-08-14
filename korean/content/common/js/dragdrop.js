jQuery(function($){
    $( ".drag-item" ).draggable({
        revert: true ,
        revertDuration: 100 ,
        create: function( el, ui ) {

        },
        stop: function( el, ui ) {

        }

    });
    $( ".drop-area" ).droppable({
        // accept:function(el) {return $(el).is($(this).data('accept'));},
        drop: function( el, ui ) {
            var $t = $(this);
			var dropChance = $t.data('chance');

            ui.draggable.removeAttr('style').draggable('option', 'disabled', true);
            $t.append(ui.draggable.clone().removeClass('ui-draggable ui-draggable-handle ui-draggable-dragging ui-draggable-disabled'));

            if (dropChance && $t.children().length === dropChance) {
                $t.droppable('option', 'disabled', true);
            } else if (!dropChance) {
                $t.droppable('option', 'disabled', true);
            }

            if ($( ".drop-area").length === $('.ui-droppable-disabled').length) {
                var target = $(this).closest('[data-drop]').attr('data-drop');
                $(`[data-reset-drag="${target}"]`).click();
            }
        }
    });

    $('[data-reset-drag]').click(function(){
        $(this.dataset.resetDrag).find('.drop-area').droppable('option', 'disabled', false).find('.drag-item').remove();
        $(this.dataset.resetDrag).find('.drag-item').draggable('option', 'disabled', false);
    });    
});
