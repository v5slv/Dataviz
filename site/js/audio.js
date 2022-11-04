let audio = document.querySelector("audio");
let play_pause = document.querySelector("#play_pause");
let loop = document.querySelector("#loop");
let replay = document.querySelector("#replay");
let slide = document.querySelector("#volume");
let curseur = document.querySelector("progress");

play_pause.addEventListener("click", () => {
    if (audio.paused == true) {
        audio.play();
    } else {
        audio.pause();
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
    audio.currentTime = 0;
});

slide.addEventListener("change", e => {
    audio.volume = e.currentTarget.value;
    // console.log(audio.volume);
});

window.requestAnimationFrame(
    audio.addEventListener("timeupdate", () => {
        curseur.value = audio.currentTime * 100 / audio.duration;
        
        // console.log(curseur.value);
    })
);
