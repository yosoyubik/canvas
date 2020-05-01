// Forked of https://observablehq.com/@d3/draw-me
// stored in https://observablehq.com/@yosoyubik/draw-me
//
import * as d3 from "d3";

const width = 960,
      height = 960;

let context;
let curve;
let strokes;

const redo = [];

const initDrawCanvas = () => {
  const canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');
  context.lineJoin = "round";
  context.lineCap = "round";
  curve = d3.curveBasis(context);
}

const drawHexCanvas = (props, line, color) => {
  strokes = (props.canvas) ? props.canvas : [];
  context.canvas.value = strokes;

  d3.select("canvas").call(d3.drag()
      .container(context.canvas)
      .subject(dragsubject)
      .on("start drag", dragged)
      .on("start.render drag.render", render)
      .on("end.drag", mouseEnds));

  render();

  context.canvas.undo = () => {
    if (strokes.length === 0) return;
    redo.push(strokes.pop());
    render();
  };

  context.canvas.redo = stroke => {
    if (redo.length === 0) return;
    strokes.push(redo.pop());
    render();
  };

  function mouseEnds() {
    const stroke = strokes[strokes.length - 1];
    console.log("finished", stroke);
    const lineWidth = stroke.lineWidth;
    const strokeStyle = stroke.strokeStyle;
    props.api.canvas.paint({
      "canvas-name": props.name,
      "location": props.metadata.location,
      "strokes": [{
        draw: {
          coords: stroke,
          lineWidth: lineWidth,
          strokeStyle: strokeStyle
        }
      }]
    });
  }

  // Create a new empty stroke at the start of a drag gesture.
  function dragsubject() {
    const stroke = [];
    stroke.lineWidth = line;
    stroke.strokeStyle = color;
    strokes.push(stroke);
    redo.length = 0;
    return stroke;
  }

  // Add to the stroke when dragging.
  function dragged() {
    d3.event.subject.push([d3.event.x, d3.event.y]);
  }

}

// Render and report the new value.
const render = () => {
  context.clearRect(0, 0, width, height);
  for (const stroke of strokes) {
    context.beginPath();
    curve.lineStart();
    for (const point of stroke) {
      curve.point(...point);
    }
    if (stroke.length === 1) curve.point(...stroke[0]);
    curve.lineEnd();
    // context.lineWidth = line;
    // context.strokeStyle = color;
    context.lineWidth = stroke.lineWidth;
    context.strokeStyle = stroke.strokeStyle;
    context.stroke();
  }
  context.canvas.value = strokes;
  context.canvas.dispatchEvent(new CustomEvent("input"));
}

const updateDrawCanvas = () => {
  render();
}

export { initDrawCanvas, drawHexCanvas, updateDrawCanvas, width, height };
