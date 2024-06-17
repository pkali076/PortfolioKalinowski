let audioCtx;

let element, sourceNode, analyserNode, gainNode;

const DEFAULTS = Object.freeze({
    gain : .5,
    numSamples : 256
});


function setupWebaudio(filePath){
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    element = new Audio();

    loadSoundFile(filePath);
    sourceNode = audioCtx.createMediaElementSource(element);

    analyserNode = audioCtx.createAnalyser();

    //fast fourier transform ... 32, 63, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768 default is 2048
    analyserNode.fftSize = 256;
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}
function loadSoundFile(filePath){
    element.src = filePath;
}
function playCurrentSound(){
    element.play();
}
function pauseCurrentSound(){
    element.pause();
}
function setVolume(value){
    value = Number(value);
    gainNode.gain.value = value;
}

export {audioCtx, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, analyserNode};