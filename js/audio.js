let audio = document.querySelector("audio");
let play_pause = document.querySelector("#play_pause img");
let loop = document.querySelector("#loop img");
let replay = document.querySelector("#replay");
let slide = document.querySelector("#volume");
let volumebtn = document.querySelector("#volume-btn")


play_pause.addEventListener("click", () => {
    if (audio.paused == true) {
        audio.play()
        play_pause.src = "img/pause.svg";
        console.log("play")
    } else {
        audio.pause();
        play_pause.src = "img/play.svg";
        console.log("pause")
    }
});


loop.addEventListener("click", () => {
    if (audio.hasAttribute("loop")) {
        audio.removeAttribute("loop");
        loop.src = "img/loop.svg"
        loop.style = "opacity: 1";
        console.log("loop removed");
    } else {
        audio.setAttribute("loop", true);
        loop.src = "img/loop-dea.svg"
        loop.style = "opacity: .4";
        console.log("loop added");
    }
});

replay.addEventListener("click", () => {
    if (audio.paused == true) {
        audio.currentTime = 0;
        audio.play()
    } else {
        audio.currentTime = 0;
    }
});

slide.addEventListener("change", e => {
    audio.volume = e.currentTarget.value;
});

volumebtn.addEventListener("click", () => {
    if (audio.volume != 0) {
        volumebtn.src = "img/no-sound.svg"
        audio.volume = 0;
    } else {
        volumebtn.src = "img/sound.svg"
        audio.volume = 1;
    }
});


