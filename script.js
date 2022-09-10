const colorSelectButtons = document.querySelectorAll(".color-select");
const strokeWidthSelector = document.getElementById("stroke-width-selector");
const undoButton = document.getElementById("undo-button");
const clearButton = document.getElementById("clear-button");
const colorPicker = document.getElementById("color-picker");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const defaultCanvasColor = "transparent";
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

function setLine(e) {
  let x = e?.clientX;
  let y = e?.clientY;

  if (e.type === "touchmove") {
    x = [...e.touches][0].clientX;
    y = [...e.touches][0].clientY;
  }

  context.lineTo(
    x - canvas.offsetLeft,
    y - canvas.offsetTop,
  );
}

function draw(e) {
  e.preventDefault();

  if (!isDrawing) return;
  
  setLine(e);
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

// Undo and Clear Buttons
undoButton.addEventListener("click", undoLastDrawing)
clearButton.addEventListener("click", clearCanvas)

// Color Select Buttons
colorSelectButtons.forEach((button) => {
  const color = button.style.backgroundColor;
  button.addEventListener("click", () => {
    strokeColor = color;
  })
})

// Color Input
colorPicker.addEventListener("input", (e) => {
  strokeColor = e.target.value;
})

// Range Inpue
strokeWidthSelector.addEventListener("input", (e) => {
  strokeWidth = e.target.value;
})

// Handle window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.fillStyle = defaultCanvasColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (index >= 0) context.putImageData(drawings[index], 0, 0);
})

const canvasListeners = [
  {
    events: ["touchstart", "mousedown"],
    handler: start,
  },
  {
    events: ["touchmove", "mousemove"],
    handler: draw,
  },
  {
    events: ["touchend", "touchcancel", "mouseout", "mouseup"],
    handler: stop,
  },
];

canvasListeners.forEach(({ events, handler }) => {
  events.forEach((event) => {
    canvas.addEventListener(event, handler);
  })
});
