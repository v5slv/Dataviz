let audio = document.querySelector("audio");
let play_pause = document.querySelector("#play_pause img");
let loop = document.querySelector("#loop");
let replay = document.querySelector("#replay");
let slide = document.querySelector("#volume");


play_pause.addEventListener("click", () => {
    if (audio.paused == true) {
        audio.play();
        play_pause.removeAttribute("src", "img/pause.svg");
        play_pause.setAttribute("src", "img/play.svg");
    } else {
        audio.pause();
        play_pause.removeAttribute("src", "img/play.svg");
        play_pause.setAttribute("src", "img/pause.svg");
    }
});

loop.addEventListener("click", () => {
    if (audio.hasAttribute("loop")) {
        audio.removeAttribute("loop");
        console.log("loop removed");
    } else {
        audio.setAttribute("loop", true);
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


