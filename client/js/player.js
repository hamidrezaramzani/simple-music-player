let domId = null;
let theme = null;
let musicSource = [];
let musicData = [];
let musicItems = document.querySelector(".music-list ul");
const musicCover = document.querySelector(".music-cover");
const play = document.querySelector(".play");
const playerControl = document.querySelector(".player-control");
const range = document.getElementById("rangeInput");

const rwd = document.querySelector(".rewind");
const fwd = document.querySelector(".forward");

const media = new Audio();

function audio(config) {
  musicSource = config.src;
  parseSources();
}

/**
 * Event listeners
 */

rwd.addEventListener("click", function() {
  if (media.currentSrc) {
    media.currentTime -= 5;
  }
});

fwd.addEventListener("click", function() {
  if (media.currentSrc) {
    media.currentTime += 5;
  }
});

media.addEventListener("loadedmetadata", function() {
  document.querySelector(".totalTime").textContent = getTime(media.duration);
});

media.addEventListener("timeupdate", function() {
  range.value = (Math.floor(media.currentTime) * 100) / media.duration;
  document.querySelector(".currentTime").textContent = getTime(
    media.currentTime
  );
});

range.addEventListener("input", function() {
  if (media.currentSrc) {
    let time = Math.floor(this.value * media.duration) / 100;
    document.querySelector(".currentTime").textContent = getTime(time);
    media.currentTime = time;
  }
});

play.addEventListener("click", function() {
  if (media.currentSrc) {
    if (media.paused) {
      media.play();
    } else {
      media.pause();
    }
    toggleIcon();
  } else {
    alert("please select a music from playlist!");
  }
});

/**
 * end event listeners
 */

function getTime(time) {
  let minute = Math.floor(time / 60);
  let second = Math.floor(time % 60);
  let mainMinute;
  let mainSecond;
  if (minute < 10) {
    mainMinute = "0" + minute;
  } else {
    mainMinute = minute;
  }

  if (second < 10) {
    mainSecond = "0" + second;
  } else {
    mainSecond = second;
  }

  return mainMinute + ":" + mainSecond;
}

function parseSources() {
  let request = new XMLHttpRequest();
  request.onload = function() {
    musicData = JSON.parse(request.responseText);
    renderItems();
  };
  request.open("POST", "http://localhost:3200/");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify({ info: musicSource }));
}

function renderItems() {
  for (let i = 0; i < musicData.length; i++) {
    let li = document.createElement("li");
    li.innerHTML = `        
            <i class="fa fa-play"></i>
            <h3>
                ${musicData[i].title}
                <br>
                <span class="music-name">${musicData[i].artist}</span>
            </h3>    
            `;
    li.onclick = playMusic.bind(null, musicData[i]);
    musicItems.append(li);
  }
  document.querySelector(".loading").style = "display:none";
}

function playMusic(item) {
  media.src = item.path;
  media.play();
  setCover(item);
  document.querySelector(".music-info h3").textContent = item.title;
  document.querySelector(".music-info span").textContent = item.artist;
  play.querySelector("svg").classList.remove("fa-play");
  play.querySelector("svg").classList.add("fa-pause");
}

function toggleIcon() {
  play.querySelector("svg").classList.toggle("fa-play");
  play.querySelector("svg").classList.toggle("fa-pause");
}

function setCover(item) {
  musicCover.innerHTML = "";
  musicCover.appendChild(getPicture(item.picture));
}

function getPicture(picture) {
  var imageData = picture.data;
  var base64String = "";
  for (var i = 0; i < imageData.length; i++) {
    base64String += String.fromCharCode(imageData[i]);
  }
  content = document.createElement("img");
  content.src =
    "data:" + picture.format + ";base64," + window.btoa(base64String);
  return content;
}
