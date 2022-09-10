const colorSelectButtons = document.querySelectorAll(".color-select");
const undoButton = document.getElementById("undo-button");
const clearButton = document.getElementById("clear-button");
const colorPicker = document.getElementById("color-picker");
const strokeWidthSelector = document.getElementById("stroke-width-selector");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const canvasWidth = window.innerWidth - 4 * 16;
const aspectRatio = 16 / 9;
canvas.width = canvasWidth;
canvas.height = 250 // canvasWidth * (1 / aspectRatio);

const defaultCanvasColor = "white";
let strokeColor = "black";
let strokeWidth = "10";
let isDrawing = false;
let drawings = [];
let index = -1;

context.fillStyle = defaultCanvasColor;
context.fillRect(0, 0, canvas.width, canvas.height);

function start(e) {
  e.preventDefault();
  isDrawing = true;
  context.beginPath();
  context.moveTo(
    e.clientX - canvas.offsetLeft,
    e.clientY - canvas.offsetTop,
  )
}

function draw(e) {
  e.preventDefault();
  if (!isDrawing) return;

  context.lineTo(
    e.clientX - canvas.offsetLeft,
    e.clientY - canvas.offsetTop,
  );
  
  context.strokeStyle = strokeColor;
  context.lineWidth = strokeWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke();
}

function stop(e) {
  e.preventDefault();

  if (!isDrawing) return;

  context.stroke();
  context.closePath();
  isDrawing = false;

  drawings.push(context.getImageData(0, 0, canvas.width, canvas.height))
  index += 1;
}

function clearCanvas() {
  context.fillStyle = defaultCanvasColor;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawings = [];
  index = -1;
}

function undoLastDrawing() {
  if (index <= 0) return clearCanvas();

  index -= 1;
  drawings.pop();
  context.putImageData(drawings[index], 0, 0)
}

// Mobile devices
canvas.addEventListener("touchstart", start);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stop);

// Desktop devices
canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseout", stop);
canvas.addEventListener("mouseup", stop);

// Undo and Clear Buttons
undoButton.addEventListener("click", undoLastDrawing)
clearButton.addEventListener("click", clearCanvas)

// Color Select Buttons
colorSelectButtons.forEach((button) => {
  const color = button.style.backgroundColor;
  button.addEventListener("click", () => strokeColor = color)
})

// Color Input
colorPicker.addEventListener("input", (e) => {
  strokeColor = e.target.value;
})

// Range Inpue
strokeWidthSelector.addEventListener("input", (e) => {
  strokeWidth = e.target.value;
})