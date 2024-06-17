import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData, bufferLength, barHeight, x;


function setupCanvas(canvasElement, analyserNodeRef){
    //create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    //create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{percent:0, color:'white'}, {percent:.5, color:'orange'},{percent:1, color:'black'}]);
    //keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    bufferLength = analyserNode.frequencyBinCount;
    //this is the array where the analyser data will be stored
    audioData = new Uint8Array(bufferLength);
}

function draw(params={}){
    //1 populate the audioData array with the frequency dat from the analyserNode
    //notice these arrays are pased "by reference"
    x =0;
   ctx.clearRect(0,0,canvasWidth, canvasHeight);
    analyserNode.getByteFrequencyData(audioData);
    //OR
    //analyserNode.getByteTimeDomainData(audioData); //waveform data

    //2 - draw background
   ctx.save();
   ctx.fillStyle = "black";
   ctx.globalAlpha = .1;
   ctx.fillRect(0,0,canvasWidth, canvasHeight);
   ctx.restore();

    //3 -draw gradient
    if(params.showGradient){
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }
    if(params.showArcs){
        const arcBarWidth = 15;

        for(let i = 0; i < bufferLength; i++){
           // x =0;
            //ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            //barHeight = dataArray[i] * 1.5;
            barHeight = audioData[i] * 2.5;
            ctx.save();
            ctx.translate(canvasWidth/2, canvasHeight/2);
            ctx.rotate(i * 4.184);

            // let myHue = 120 + i * 2;
            let myHue = 120 + i * .05;
            // ctx.fillStyle = 'hsl(' + myHue + ',100%,' + barHeight/3 + '%)';
            ctx.fillStyle = 'hsl(' + myHue + ',100%, 50%)';
            ctx.beginPath();
            //ctx.arc(5, arcBarWidth * 1.2, barHeight * 1.2, 0, i % 2 + 1);
            ctx.arc(15, arcBarWidth/2, barHeight/2, 0, Math.PI / 4);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.translate(canvasWidth/2, canvasHeight/2);
            ctx.rotate(i * 2.184);

            // let myHue = 120 + i * 2;
            myHue = 255 + i * .05;
            // ctx.fillStyle = 'hsl(' + myHue + ',100%,' + barHeight/3 + '%)';
            ctx.fillStyle = 'hsl(' + myHue + ',100%, 50%)';
            ctx.beginPath();
            //ctx.arc(5, arcBarWidth * 1.2, barHeight * 1.2, 0, i % 2 + 1);
            ctx.arc(30, arcBarWidth/2, barHeight/2, 0, Math.PI / 6);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.translate(canvasWidth/2, canvasHeight/2);
            ctx.rotate(i * 3.097);

            // let myHue = 120 + i * 2;
            myHue = 50 + i * .15;
            // ctx.fillStyle = 'hsl(' + myHue + ',100%,' + barHeight/3 + '%)';
            ctx.fillStyle = 'hsl(' + myHue + ',100%, 50%)';
            ctx.beginPath();
            //ctx.arc(5, arcBarWidth * 1.2, barHeight * 1.2, 0, i % 2 + 1);
            ctx.arc(30, arcBarWidth/2, barHeight/2, 0, Math.PI / 6);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.translate(canvasWidth/2, canvasHeight/2);
            ctx.rotate(i * 1.097);

            // let myHue = 120 + i * 2;
            myHue = 175 + i * .15;
            // ctx.fillStyle = 'hsl(' + myHue + ',100%,' + barHeight/3 + '%)';
            ctx.fillStyle = 'hsl(' + myHue + ',100%, 50%)';
            ctx.beginPath();
            //ctx.arc(5, arcBarWidth * 1.2, barHeight * 1.2, 0, i % 2 + 1);
            ctx.arc(50, arcBarWidth/2, barHeight/2, 0, Math.PI / 9);
            ctx.fill();
            ctx.stroke();
            x += arcBarWidth;
            ctx.restore();
        }
    }
    if(params.showCircles){
        const circleBarWidth = 3;
        analyserNode.fftSize = 128;
        bufferLength = analyserNode.frequencyBinCount;
    //this is the array where the analyser data will be stored
        //audioData = new Uint8Array(bufferLength);
    for(let i = 0; i < bufferLength; i++){
        //barHeight = dataArray[i] * 1.5;
        barHeight = audioData[i] * 1.4;
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight/2);
        ctx.rotate(i * bufferLength * -2.005);

       // let myHue = 120 + i * 2;
       let myHue = 250 + i * 2;
       // ctx.fillStyle = 'hsl(' + myHue + ',100%,' + barHeight/3 + '%)';
       ctx.fillStyle = 'hsl(' + myHue + ',100%, 50%)';
       ctx.beginPath();
       //  ctx.arc(5,circleBarWidth * 1.2, barHeight * 1.2, 0, i % 2 + 1);
        ctx.arc(0, barHeight, barHeight / 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, barHeight/2, barHeight / 20, 0, Math.PI / 2);
         ctx.fill();

         ctx.beginPath();
         ctx.arc(0, barHeight / 3, barHeight/ 15, 0, Math.PI * 6);
         ctx.fill();
         ctx.beginPath();
         ctx.arc(0, barHeight / 4, barHeight / 2, 0, Math.PI / 4);
         ctx.fill();
         
        // ctx.stroke();
        x +=  circleBarWidth;
        ctx.restore();
    }
    }
    if(params.showClown){
        const circlesTwoBarWidth = .5;
        analyserNode.fftSize = 256;
        bufferLength = analyserNode.frequencyBinCount;
            for(let i = 0; i < bufferLength; i++){
                barHeight = audioData[i] * 3;
                ctx.save();
                ctx.translate(canvasWidth / 2, canvasHeight/2);
                ctx.rotate(i * bufferLength * -1.005);
                let myHue = 250 + i * 3;
                    // ctx.fillStyle = 'hsl(' + myHue + ',100%,' + barHeight/3 + '%)';
                ctx.fillStyle = 'hsl(' + myHue + ',100%, 50%)'; 
                ctx.beginPath();
                ctx.arc(0, barHeight/2, barHeight / 10, 0, Math.PI / 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(0, barHeight /3, barHeight / 20,0, Math.PI - 10);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(0, barHeight /4, barHeight / 10, 0, i - 3);
                ctx.fill();
                x += circlesTwoBarWidth * 2.0005;
                ctx.restore();
    } 

    }
    if(params.showSpecial){
    const showSpecialWidth = 2;
    analyserNode.fftSize = 128;
    bufferLength = analyserNode.frequencyBinCount;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = 'white';
    for(let i = 0; i < bufferLength; i++){
        barHeight = audioData[i];
        
        ctx.save();
        ctx.translate(canvasWidth/2, canvasHeight/2);
        ctx.rotate(i * 1.8);
        ctx.shadowBlur = 40;
        const hue = 190 + i * barHeight/15;
        ctx.strokeStyle = 'hsl(' + hue + ',100%, 50%)';
        ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';
        ctx.beginPath();
        ctx.arc(barHeight + 55, barHeight + 55, 50, 0, Math.PI * 2);
        ctx.moveTo(barHeight + 90, barHeight + 55);
        ctx.arc(barHeight + 55, barHeight + 55, 15, 0, Math.PI);
        ctx.stroke();
        ctx.lineWidth = barHeight / 20 > .15 ? barHeight/20 : .15;
        ctx.beginPath();
        ctx.moveTo(barHeight + 45, barHeight + 45);
        ctx.arc(barHeight + 40, barHeight + 45, 5, 0, Math.PI * 2);
        ctx.moveTo(barHeight + 55, barHeight + 45);
        ctx.arc(barHeight + 50,barHeight +  45, 5, 0, Math.PI * 2);
        ctx.fill();
        x += showSpecialWidth;
        ctx.restore();

        }


    }
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    for(let i = 0; i < length; i +=4){
            if(params.showInvert){
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = 255 - red;
            data[i+1] = 255 - green;
            data[i+2] = 255 - blue;
        }
    }
    for(let i = 0; i <length; i += 4){
        if(params.redAndBlack){
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = 255 - red;
            data[i+1] = 50 - green;
            data[i+2] = 50 - blue;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}
export{setupCanvas, draw};