/**
 * Get UI reference
 */
let fileLoader = document.querySelector('#file-loader');
let videoPlayer = document.querySelector('#video-player');
let playBtn = document.querySelectorAll('.play-btn');
let pauseBtn = document.querySelectorAll('.pause-btn');
let videoTimer = document.querySelector('#video-timer');
let videoDuration = document.querySelector('#video-duration');
let progressBar = document.querySelector('.progress-bar');
let progress = document.querySelector('.progress');
let prevBtn = document.querySelector('#prev-btn');
let nextBtn = document.querySelector('#next-btn');
let playListMenu = document.querySelector('#play-list-menu');
let title = document.querySelector('#title');
let expandBtn = document.querySelector('#expand-btn');
let playIndex = 0;
let playList = [];



/**
 * Event handlers
 */

function addToPlayListMenu(title) {
  let index = playList.length - 1;
  let label = document.createElement('label');
  label.textContent = `${index+1}. ${title}`;
  label.attributes['data-id'] = index;
  label.addEventListener('click', playFromPlayListMenu);
  playListMenu.appendChild(label);
}

function addToPlayList(files = []) {
  for (let file of files) {
    let isPlayable = videoPlayer.canPlayType(file.type);
    console.log(isPlayable)
    if (isPlayable) {
      let reader = new FileReader();
      reader.addEventListener('load', (event) => {
        let data = event.target.result;
        let media = {
          data,
          title: file.name
        }

        playList.push(media);
        addToPlayListMenu(media.title);
        console.log(media)
        if (videoPlayer.paused) play();
      })

      reader.readAsDataURL(file);
    }
  }
}

function playFromPlayListMenu(event) {
  event.preventDefault();
  let index = event.target.attributes['data-id'];
  playIndex = index;
  videoPlayer.currentTime = 0;
  play(event);
}

function play(event) {
  if (playList.length == 0) return;
  let media = playList[playIndex];
  playBtn.forEach(btn => {
    btn.classList.add('hide');
  })
  pauseBtn.forEach(btn => {
    btn.classList.remove('hide');
  });

  if (videoPlayer.currentTime == 0) {
    videoPlayer.src = media.data;
    title.textContent = media.title;
  }
  videoPlayer.play();
}

function pause(event) {
  event.preventDefault();

  playBtn.forEach(btn => btn.classList.remove('hide'));
  pauseBtn.forEach(btn => btn.classList.add('hide'));
  videoPlayer.pause();
}

function next(event) {
  event.preventDefault();

  if (playList.length < 0) return;
  videoPlayer.currentTime = 0;
  ++playIndex;
  if (playIndex > playList.length - 1) playIndex = 0;
  play();
}

function prev(event) {
  event.preventDefault();

  if (playList.length < 0) return;
  videoPlayer.currentTime = 0;
  --playIndex;
  if (playIndex < 0) playIndex = playList.length - 1;
  play();
}

function seek(event) {
  event.preventDefault();
  if (videoPlayer.paused) return;

  let width = this.offsetWidth;
  let xPos = event.offsetX;
  let currentTime = (xPos / width) * videoPlayer.duration;
  videoPlayer.currentTime = currentTime;
}

function progressHandler(event) {
  let currentTime = videoPlayer.currentTime;
  let duration = videoPlayer.duration;
  let percent = (currentTime / duration) * 100;
  progress.style.width = `${percent}%`;
  if (duration > 0) {
    videoDuration.textContent = getTimer(duration);
  }
  if (currentTime > 0) {
    videoTimer.textContent = getTimer(currentTime);
  }
  if (percent === 100) next(event);
}

function loadHandler(event) {
  event.preventDefault();
  addToPlayList(this.files);
}

function getTimer(millis = 0) {
  let hours = padZero(Math.floor((millis / (60 * 60)) % 24));
  let minutes = padZero(Math.floor((millis / 60) % 60));
  let seconds = padZero(Math.floor(millis % 60));

  return `${Number(hours) > 0? hours + ':' : ''}${minutes}:${seconds}`;
}

function padZero(value) {
  return value < 10 ? `0${value}` : value;
}

function openFullscreen(event) {
  event.preventDefault();

  if (videoPlayer.requestFullscreen) {
    videoPlayer.requestFullscreen();
  } else if (videoPlayer.webkitRequestFullscreen) {
    videoPlayer.webkitRequestFullscreen();
  } else if (videoPlayer.msRequestFullscreen) {
    videoPlayer.msRequestFullscreen();
  }
}

/**
 * Register Events
 */

fileLoader.addEventListener('change', loadHandler);
progressBar.addEventListener('click', seek);
videoPlayer.addEventListener('timeupdate', progressHandler)

playBtn.forEach(btn => {
  btn.addEventListener('click', play);
})

pauseBtn.forEach(btn => {
  btn.addEventListener('click', pause);
})

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

expandBtn.addEventListener('click', openFullscreen);