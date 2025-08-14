$(document).ready(function () {
  var Button = videojs.getComponent('Button');

  // 정지 버튼 정의
  var StopButton = videojs.extend(Button, {
    constructor: function () {
      Button.apply(this, arguments);
      this.controlText('정지');
      this.addClass('vjs-stop-control');
    },
    handleClick: function () {
      this.player_.pause();
      this.player_.currentTime(0);
      this.player_.posterImage.show();
      this.player_.hasStarted(false);
    }
  });

  videojs.registerComponent('StopButton', StopButton);

  // 모든 video-js 초기화
  $('.video-js').each(function (i) {
    var t = $(this);
    t.attr('id', 'smart-video' + i);

    var player = videojs(document.querySelector('#' + this.id), {
      controls: true,
      width: 1547,
      height: 870,
      preload: "auto",
      playbackRates: [0.8, 1.0, 1.2],
      controlBar: {
        volumePanel: { inline: true, vertical: false },
        children: [
          'playToggle',
          'StopButton',
          'progressControl',
          'currentTimeDisplay',
          'durationDisplay',
          'playbackRateMenuButton',
          'volumeMenuButton',
          'volumePanel',
          'fullscreenToggle',
          'remainingTimeDisplay'
        ]
      }
    });

    // player 인스턴스를 DOM 요소에 저장해두기
    t.data('player', player);

    // 속도 라벨 텍스트 변경
    player.ready(function () {
      if (this.playbackRateMenuButton && this.playbackRateMenuButton.items) {
        this.playbackRateMenuButton.items.forEach(function (item) {
          var rate = item.options_.rate;
          var label = rate.toFixed(1) + 'x';
          item.label = label;
          item.el().innerHTML = label;
        });
      }
    });
  });

  $(document).on('click', '.icon-modal-close', function () {
  const $modal = $(this).closest('.modal');

  $modal.find('.video-js').each(function () {
    const videoEl = this;
    const player = videojs(videoEl);

    player.ready(function () {
      player.pause();
      player.currentTime(0);

      // 이 부분에서 reset() 대신 상태만 초기화
      player.hasStarted(false);
      player.posterImage && player.posterImage.show();

      // vjs-tech 태그 복구를 위해 다시 load() 호출
      videoEl.load(); // HTMLVideoElement에 원본 다시 로드
    });
  });
});


});
