let audio = document.querySelector("audio");
let play_pause = document.querySelector("#play_pause");
let loop = document.querySelector("#loop");
let replay = document.querySelector("#replay");
let slide = document.querySelector("#volume");


play_pause.addEventListener("click", () => {
    if (audio.paused == true) {
        audio.play();
        play_pause.innerHTML = "‖";
    } else {
        audio.pause();
        play_pause.innerHTML = "▶";
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


