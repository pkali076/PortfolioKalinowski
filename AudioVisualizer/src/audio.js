let audioCtx;
let element, sourceNode, analyserNode, gainNode;

const DEFAULTS = Object.freeze({
    gain: 0.5,
    numSamples: 256
});

function setupWebaudio(filePath) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    element = document.getElementById('audio'); // Get the existing audio element

    loadSoundFile(filePath);
    sourceNode = audioCtx.createMediaElementSource(element);

    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = DEFAULTS.numSamples;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

function loadSoundFile(filePath) {
    element.src = filePath;
    element.load(); // Ensure the audio element is loaded
}

function playCurrentSound() {
    element.play().catch(error => console.log(`Error playing audio: ${error}`));
}

function pauseCurrentSound() {
    element.pause();
}

function setVolume(value) {
    value = Number(value);
    gainNode.gain.value = value;
}

export { audioCtx, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, analyserNode };
