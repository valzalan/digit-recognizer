const canvasDrawer = {
    cursorMoves: [],
    isPainting: false,
    clickDrag: [],
    recordCursorPos: function(cursorX, cursorY, dragging) {
        //console.log("recording movement: " + cursorX + " " + cursorY);
        let coordinate = {
            x: cursorX,
            y: cursorY
        };
        this.clickDrag.push(dragging);
        this.cursorMoves.push(coordinate);
    },
	draw: function(ctx) {
        //console.log("drawing...");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas
        ctx.strokeStyle = "#000000";
        ctx.lineJoin = "round";
        ctx.lineWidth = 5;

        for(var i=0; i < this.cursorMoves.length; i++) {
            ctx.beginPath();
            if(this.clickDrag[i] && i){
                ctx.moveTo(this.cursorMoves[i-1].x, this.cursorMoves[i-1].y);
            }else{
                ctx.moveTo(this.cursorMoves[i].x - 1, this.cursorMoves[i].y);
            }
            ctx.lineTo(this.cursorMoves[i].x, this.cursorMoves[i].y);
            ctx.closePath();
            ctx.stroke();
        }
    }
}

module.exports = canvasDrawer;
