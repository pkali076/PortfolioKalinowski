
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
}

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

    let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
    audio.analyserNode.getByteTimeDomainData(audioData);
}

function setupUI(canvasElement){//}, json){

    const fsButton = document.querySelector("#fsButton");
    const circlesBox = document.querySelector("#circlesCB");
    const clownBox = document.querySelector("#clownCB");
    const arcsBox = document.querySelector("#arcsCB");
    const gradientBox = document.querySelector("#gradientCB");
    const invertBox = document.querySelector("#invertCB");
    const redAndBlackBox = document.querySelector("#redAndBlackCB");
    const showSpecialBox = document.querySelector("#showSpecialCB");
   // const transformSelection = document.querySelector("#transform");

    fsButton.onclick = e => {
        
        utils.goFullscreen(canvasElement);
    };

    arcsBox.onclick = e => {
      if(drawParams.showArcs == true){
          drawParams.showArcs = false; 
      }else{
          drawParams.showArcs = true;
      }
  }
  
      gradientBox.onclick = e => {
      if(drawParams.showGradient == true){
          drawParams.showGradient = false;
      }else{
          drawParams.showGradient = true;
      }
  }
      circlesBox.onclick = e => {
      if(drawParams.showCircles == true){
          drawParams.showCircles = false;
      }else{
          drawParams.showCircles = true;
      }
  }
    clownBox.onclick = e =>{
      if(drawParams.showClown == true){
          drawParams.showClown = false;
      }else{
          drawParams.showClown = true;
      }
  }
  showSpecialBox.onclick = e =>{
      if(drawParams.showSpecial == true){
          drawParams.showSpecial = false;
      }else{
          drawParams.showSpecial = true;
      }
  }
  redAndBlackBox.onclick = e=>{
      if(drawParams.redAndBlack == true){
          drawParams.redAndBlack = false;
      }else{
          drawParams.redAndBlack = true;
      }
  }
  invertBox.onclick = e =>{
      if(drawParams.showInvert == true){
          drawParams.showInvert = false;
      }
      else{
          drawParams.showInvert = true;
      }
  }



    playButton.onclick = e =>{
      console.log(`audioCtx.state before = ${audio.audioCtx.state}`);
  

  //check if context is in suspended state (autoplay policy)
  if(audio.audioCtx.state == "suspended"){
      audio.audioCtx.resume();
  }
  console.log(`audioCtx.state ater = ${audio.audioCtx.state}`);
  if(e.target.dataset.playing == "no"){
      //if track is crrently paused, play it
      audio.playCurrentSound();
      e.target.dataset.playing = "yes"; 
      //if track is playing, pause it
  }else{
      audio.pauseCurrentSound();
      e.target.dataset.playing = "no"; 
  }

};
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");

    //add .oninput event to slider
	volumeSlider.oninput = e => {
        //set the gain
        audio.setVolume(e.target.value);
        //update value of label to match value of slider
        volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
    };
    
    //set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));

    //D-- hokup track <Select>
    let trackSelect = document.querySelector("#trackSelect");
    //add .onchange event to <select>
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        //pause the current track if it is playing
        if(playButton.dataset.playing == "yes"){
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    }

};

//utils
const loadJsonFetch = (url, callback) => {
    fetch(url).then(async response => {
        //if response successful, return JSON
        if(response.ok){
            return response.json();
        }

        //else throw an error that will be caught below
        const text = await response.text();
        throw text;
    }) //send the response.json() promise to the next .then()
    .then(json => { //the second promise is resolved and `json` is a JSON object
        callback(json);
    }).catch(error => {
        //error
        console.log(error);
    });
};

//main
export {init};