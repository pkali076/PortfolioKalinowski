
  const getLinearGradient = (ctx,startX,startY,endX,endY,colorStops) => {
    let lg = ctx.createLinearGradient(startX,startY,endX,endY);
    for(let stop of colorStops){
      lg.addColorStop(stop.percent,stop.color);
    }
    return lg;
  };
  
  const goFullscreen = (element) => {
      if (element.requestFullscreen) {
          element.requestFullscreen();
      } else if (element.mozRequestFullscreen) {
          element.mozRequestFullscreen();
      } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
          element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
      }
      // .. and do nothing if the method is not supported
  };

  export {getLinearGradient, goFullscreen};