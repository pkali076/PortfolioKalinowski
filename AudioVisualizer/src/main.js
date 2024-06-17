import "./navbar.js";
import "./about.js";
import "./footer.js";
import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

// ctx.shadowOffsetX = 5;
// ctx.shadowOffsetY = 5;
// ctx.shadowBlur = 0;
// ctx.shadowColor = 'white';


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
    
  //  loadJsonFetch("app-data/options.json", dataLoaded);
    audio.setupWebaudio("media/PretzelLogic.mp3");
    let canvasElement = document.querySelector("canvas");
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    loop();
}
// const dataLoaded = json =>  {
//     //console.log(json);
//     //options = json.options;
//    // console.log(json);
//     setupUI(canvasElement, json);
//     canvas.setupCanvas(canvasElement, audio.analyserNode);
//    // loop(json);
// }
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
    //console.log(json.options[0].showArcs);

   // console.log(arr);
    arcsBox.onclick = e => {
      if(drawParams.showArcs == true){
          drawParams.showArcs = false; 
      }else{
          drawParams.showArcs = true;
         // console.log(drawParams[0].showArcs);
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
      e.target.dataset.playing = "yes"; //our CSS will set the test to "pause"
      //if track is playing, pause it
  }else{
      audio.pauseCurrentSound();
      e.target.dataset.playing = "no"; // our CSS will set the text to "play"
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















/* ------------------------------------------------------------------------------------------------------------------------------------------------------------ */
//Extra Code, May be necessary, may not be

//     // audioSource = audioContext.createMediaElementSource(audioMine); // create audio source from html element to create audio node
//     // analyser = audioContext.createAnalyser(); // create analyser node to organize and sequence data
//     // audioSource.connect(analyser); //connecting audio source node to the analyser node
//     // analyser.connect(audioContext.destination); //connecting this to destination (most likely the computer speakers)
//     //fast fourier transform ... 32, 63, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768 default is 2048
//     //analyser.fftSize = 1024;
//     //analyser.smoothingTimeConstant = .1;
//    // const bufferLength = analyser.frequencyBinCount; //keeps number of data values for the audio files... will connect these each to a bar for display
//     //always half of fftSize property
//    // const dataArray = new Uint8Array(bufferLength); //convert bufferlength to special type of array that contains elements of 8 integers
//     audioSource = audioContext.createMediaElementSource(audioMine); // create audio source from html element to create audio node
//     analyser = audioContext.createAnalyser(); // create analyser node to organize and sequence data

//     audioSource.connect(analyser); //connecting audio source node to the analyser node
//     analyser.connect(audioContext.destination); //connecting this to destination (most likely the computer speakers)
//     analyser.fftSize = 512;
//     bufferLength = analyser.frequencyBinCount;
//     dataArray = new Uint8Array(bufferLength);

    
    
//     function animate(){

//         x = 0; //for every animation loop,set x back to 0 to make new set of audio bars
//         ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
//         analyser.getByteFrequencyData(dataArray); 
//         requestAnimationFrame(animate);

//     }
//     animate();
// };


//rectangles
// function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray){
//     for(let i = 0; i < bufferLength; i++){
//         barHeight = dataArray[i] * 2;
//         ctx.save();
//         ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);
//         ctx.rotate(i + Math.PI * 2 / bufferLength);

//         //let myHue = i * .2;

//        // ctx.fillStyle = 'hsl(' + myHue + ',100%,' + barHeight/8 + '%)';

//      //   const colorOne = i * 3;
//         const colorNew = i * barHeight/30;
//        //  const colorTwo = i / 2;
//         const colorThree = i * 3;
//         // const colorFour = (i + 5) / barWidth * 5 - 5;
//         // const colorFive = barWidth / 8;
//         const colorSix = i * 2/barHeight;
//        ctx.fillStyle = 'white';
//        ctx.fillRect(x, ctx.canvas.height - barHeight - 100, barWidth, 15);
       
//     //     // ctx.fillStyle = 'rgb(' + colorOne + ',' + colorThree + ',' + colorSix + ')';
//     //     // ctx.fillRect(0, 15, barWidth, barHeight * 2);
        
//     //     ctx.translate(ctx.canvas.width / 3, ctx.canvas.height/3);
//     //     ctx.rotate(i + 1 / bufferLength);
//          ctx.fillStyle = 'rgb(' + colorNew + ',' + colorThree + ',' + colorSix + ')';
//          ctx.fillRect(x, ctx.canvas.height - barHeight, barWidth, barHeight);

// //layer interactions
//             //ctx.beginPath();
//             //ctx.moveTo(0, 0);
//             //ctx.lineTo(0, barHeight);
//             //ctx.stroke();
//             //ctx.beginPath();
//             //ctx.arc(0, barHeight + barHeight / 5, barHeight / 20, 0, Math.PI * 2);
//             //ctx.fill();

     
//          x += barWidth;
//          ctx.restore();
//     }

// }
//conditional rectangles
// function drawVisualizerRectangle(bufferLength, x, barWidth, barHeight, dataArray){
//     for(let i = 0; i < bufferLength; i++){
//         //barHeight = dataArray[i] * 1.5;
//         barHeight = dataArray[i] * .4;
//         ctx.save();
//         ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);
//         ctx.rotate(i * 0.28);

//        let myHue = 120 + i * 2;
//        //let myHue = i * 1.5;
       
//        ctx.fillStyle = 'hsl(' + myHue + ',100%,' + barHeight/3 + '%)';
//        ctx.strokeStyle = 'white';
//        ctx.fillRect(barHeight/2, barHeight/2, barWidth, barHeight);
//        barHeight > 40 ? ctx.strokeRect(barHeight/2, barHeight/2, barWidth, barHeight * 1.2) : ctx.strokeRect(0, 0, 0, 0);
//        barHeight > 70 ? ctx.strokeRect(barHeight/2, barHeight * 1.8, barWidth, barHeight * .2) : ctx.strokeRect(0, 0, 0, 0);

//         x += barWidth;
//         ctx.restore();
//     }
   
// }


























// container.addEventListener('click', function(){

//    // let myAudioTest = new Audio();
//     const audioMine = document.querySelector("#audio1");
    
//     audioMine.src = 'StreamofConsciousness.mp3';
//     const audioContext =  new AudioContext();
//     audioMine.play();
//     audioSource = audioContext.createMediaElementSource(audioMine); // create audio source from html element to create audio node
//     analyser = audioContext.createAnalyser(); // create analyser node to organize and sequence data
//     audioSource.connect(analyser); //connecting audio source node to the analyser node
//     analyser.connect(audioContext.destination); //connecting this to destination (most likely the computer speakers)
//     analyser.fftSize = 256; //fast fourier transform ... 32, 63, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768 default is 2048
//     const bufferLength = analyser.frequencyBinCount; //keeps number of data values for the audio files... will connect these each to a bar for display
//     //always half of fftSize property
//     const dataArray = new Uint8Array(bufferLength); //convert bufferlength to special type of array that contains elements of 8 integers


//     const barWidth = (canvas.width+20)/bufferLength * 2; //each data point sets one bar in visualizser, width of canvas / bufferLength (number of samples available)
//     let barHeight;
//     let x;
//     function animate(){
//         x = 2; //for every animation loop,set x back to 0 to make new set of audio bars
//        // ctx.clearRect(0,0, canvas.width * 10, canvas.height * 2);
//         ctx.clearRect(0,0, canvas.width, canvas.height);
//         analyser.getByteFrequencyData(dataArray); //copies frequency data into array, composed of integers between 0 and 255, determines height of visualizer
//         //repeated over and over as sound plays
//         //..............................................
//         // for(let i = 0; i < bufferLength + 255; i++){
//         //     barHeight = (dataArray[i] * 1.25);
//         //     ctx.fillStyle = '#cdcdcd';
//         //   //  ctx.strokeStyle = 'black';
//         //     ctx.fillRect(x / 3, canvas.height - barHeight, barWidth *.5, barHeight + 5);
//         //     x += barWidth;
//         //     ctx.fillStyle = '#f2695f';
//         //    // ctx.strokeStyle = 'cyan';
//         //    // ctx.Stroke;
//         //     ctx.fillRect(x, canvas.height / barHeight, barHeight / 25, barWidth);
//         //     x += barWidth;
//         //     ctx.fillStyle = '#63e5ff';
//         //     //ctx.strokeStyle = 'white';
//         //     ctx.fillRect(x / 2, canvas.height - barHeight, barWidth * .75, barHeight);
//         //     x += barWidth;
//         //drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);
//         drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray)
//        // }
//           requestAnimationFrame(animate);
//     }
        

    
//     animate();
// });

















    //     for(let i = 0; i < bufferLength; i++){
    //     barHeight = dataArray[i] * 3;
    //     const colorOne = (i - 8) / barHeight - 5;
    //     const colorTwo = barHeight / 2;
    //     const colorThree = i * 7;
    //     ctx.fillStyle = 'rgb(' + colorOne + ',' + colorTwo + ',' + colorThree + ')';
    //     ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    //     x += barWidth;
    // }
