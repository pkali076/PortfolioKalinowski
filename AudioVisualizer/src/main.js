import "./navbar.js";
import "./about.js";
import "./footer.js";
import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const drawParams = {
    showGradient : false,
    showArcs : false,
    showRectangles : false,
    showCircles : false,
    showClown : false,
    showInvert : false,
    redAndBlack : false,
    showSpecial : false
};

function init(){
    console.log("init called");
    audio.setupWebaudio("media/PretzelLogic.mp3");
    let canvasElement = document.querySelector("canvas");
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    loop();
}

function loop(){
    requestAnimationFrame(loop);
    canvas.draw(drawParams);

    let audioData = new Uint8Array(audio.analyserNode.fftSize / 2);
    audio.analyserNode.getByteTimeDomainData(audioData);
}

function setupUI(canvasElement){

    const fsButton = document.querySelector("#fsButton");
    const circlesBox = document.querySelector("#circlesCB");
    const clownBox = document.querySelector("#clownCB");
    const arcsBox = document.querySelector("#arcsCB");
    const gradientBox = document.querySelector("#gradientCB");
    const invertBox = document.querySelector("#invertCB");
    const redAndBlackBox = document.querySelector("#redAndBlackCB");
    const showSpecialBox = document.querySelector("#showSpecialCB");

    fsButton.onclick = e => {
        utils.goFullscreen(canvasElement);
    };

    arcsBox.onclick = e => {
        drawParams.showArcs = !drawParams.showArcs;
    };

    gradientBox.onclick = e => {
        drawParams.showGradient = !drawParams.showGradient;
    };

    circlesBox.onclick = e => {
        drawParams.showCircles = !drawParams.showCircles;
    };

    clownBox.onclick = e => {
        drawParams.showClown = !drawParams.showClown;
    };

    showSpecialBox.onclick = e => {
        drawParams.showSpecial = !drawParams.showSpecial;
    };

    redAndBlackBox.onclick = e => {
        drawParams.redAndBlack = !drawParams.redAndBlack;
    };

    invertBox.onclick = e => {
        drawParams.showInvert = !drawParams.showInvert;
    };

    const playButton = document.querySelector("#playButton");

    playButton.onclick = e => {
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

        // Check if context is in suspended state (autoplay policy)
        if (audio.audioCtx.state === "suspended") {
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
        if (e.target.dataset.playing === "no") {
            // If track is currently paused, play it
            audio.playCurrentSound();
            e.target.dataset.playing = "yes"; // Our CSS will set the text to "Pause"
        } else {
            // If track is playing, pause it
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no"; // Our CSS will set the text to "Play"
        }
    };

    const volumeSlider = document.querySelector("#volumeSlider");
    const volumeLabel = document.querySelector("#volumeLabel");

    // Add .oninput event to slider
    volumeSlider.oninput = e => {
        // Set the gain
        audio.setVolume(e.target.value);
        // Update value of label to match value of slider
        volumeLabel.innerHTML = Math.round((e.target.value / 2) * 100);
    };

    // Set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));

    // Hookup track <select>
    const trackSelect = document.querySelector("#trackSelect");
    // Add .onchange event to <select>
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        // Pause the current track if it is playing
        if (playButton.dataset.playing === "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    };
}

// Main
export { init };
