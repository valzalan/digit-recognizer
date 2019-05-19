const model = require("./model.js"),
      canvasDrawer = require("./drawer.js");

let canvas = document.getElementById("drawer");
canvas.addEventListener("mousedown", function(e){
    console.log("mousedown");
    canvasDrawer.isPainting = true;
    canvasDrawer.recordCursorPos(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    canvasDrawer.draw(canvas.getContext("2d"));
});

canvas.addEventListener("mousemove", function(e){
    if(canvasDrawer.isPainting) {
        console.log("e.pageX: " + e.pageX);
        console.log("e.pageY: " + e.pageY);
        console.log("this.offsetLeft: " + this.offsetLeft);
        console.log("this.offsetTop: " + this.offsetTop);
        canvasDrawer.recordCursorPos(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        canvasDrawer.draw(canvas.getContext("2d"));
    }
});

canvas.addEventListener("mouseup", function(e){
    canvasDrawer.isPainting = false;
});

canvas.addEventListener("mouseleave", function(e){
    canvasDrawer.isPainting = false;
});

/*setTrainButtonCallback(async () => {
  setStatus("Loading MNIST data...");
  await load();

  setStatus("Creating model...");
  const model = createConvModel();
  model.summary();

  setStatus("Starting model training...");
  await train(model, () => showPredictions(model));
  //await setPredictButton(model);
});*/
