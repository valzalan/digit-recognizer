const ReactDom = require("react-dom"),
      React = require("react");
      //model = require("./model.js"),
      //canvasDrawer = require("./drawer.js");

const container = document.getElementById("dashboard");
ReactDom.render(<p>Hello World!</p>, container);

/*
let canvas = document.getElementById("drawer");
    canvas.addEventListener("mousedown", function(e){
    canvasDrawer.isPainting = true;
    canvasDrawer.recordCursorPos(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    canvasDrawer.draw(canvas.getContext("2d"));
});

canvas.addEventListener("mousemove", function(e){
    if(canvasDrawer.isPainting) {
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
*/
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
