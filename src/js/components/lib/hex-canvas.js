// Adapted from: https://bl.ocks.org/mbostock/5249328

import * as d3 from "d3";
import * as topojson from "topojson";


const width = 960,
      height = 500,
      radius = 20;

const hexProjection = (radius) => {
  var dx = radius * 2 * Math.sin(Math.PI / 3),
      dy = radius * 1.5;
  return {
    stream: function(stream) {
      return {
        point: function(x, y) { stream.point(x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2); },
        lineStart: function() { stream.lineStart(); },
        lineEnd: function() { stream.lineEnd(); },
        polygonStart: function() { stream.polygonStart(); },
        polygonEnd: function() { stream.polygonEnd(); }
      };
    }
  };
}

const projection = hexProjection(radius);
const path = d3.geoPath().projection(projection);


const selectedColor = (colors) => {
  // console.log(colors);
  let test= colors.find(color => {
    if (color.style.stroke) {
      return true;
    }
  });
  console.log(test);
  return test;
}


const initHexMesh = () => {
  const topology = hexTopology(radius, width, height);
  d3.select(".mesh-group").append("path")
      .datum(topojson.mesh(topology, topology.objects.hexagons))
      .attr("class", "mesh")
      .attr("d", path);
}

const drawHexCanvas = (props) => {
  console.log("drawing", props);
  const canvasName = props.name;
  const canvasData = props.canvas;
  const location = props.location;
  const topology = hexTopology(radius, width, height, canvasData, canvasName);
  console.log(canvasName);
  let mousing = 0;

  const mousedown = function(d) {
    // console.log("mousedown");
    mousing = d.fill ? -1 : +1;
    mousemove.apply(this, arguments);
  }

  const mousemove = function(d) {
    if (mousing) {
      const colors = d3.select(".legend").selectAll("rect").nodes();
      if (d.fill !== mousing > 0) {
        console.log(canvasName);
        // Save stroke remotely
        props.api.canvas.paint(canvasName, location,
          {"mesh": {"id": d.id, "filled": mousing > 0}}
        );
        // Save stroke locally on browser
        canvasData[d.id] = mousing > 0;
      }
      // d3.select(this).classed("point fill", d.fill = mousing > 0);
      d3.select(this).style('fill', () => {
        d.fill = mousing > 0;
        console.log(selectedColor(colors));
        console.log(d3.color(selectedColor(colors).style.fill).toString());
        if (d.fill) {
          return d3.color(selectedColor(colors).style.fill).toString();
        } else {
          return 'white'
        }
      });
      // border.call(redraw);
    }
  }

  const mouseup = function() {
    // console.log("mouseup");
    mousemove.apply(this, arguments);
    mousing = 0;
  }

  const changeColor = function(d){
    return d.fill ? "fill point" : "point";
  }

  // const redraw = (border) => {
  //   console.log("redrawing", border);
  //   border.attr("d",
  //     path(topojson.mesh(topology, topology.objects.hexagons,
  //       function(a, b) { return a.fill ^ b.fill; })
  //     )
  //   );
  // }
  const svg = d3.select("svg");
  const g = d3.select(".hexagon");

  // update
  const hexagons = g
    .selectAll("path")
    .data(topology.objects.hexagons.geometries)
    .attr("class", changeColor);

  // enter
  hexagons
    .enter().append("path")
      .attr("d", function(d) { return path(topojson.feature(topology, d)); })
      .attr("class", changeColor)
      .on("mousedown", mousedown)
      .on("mousemove", mousemove)
      .on("mouseup", mouseup);

  // const border = d3.select(".border-group")
  //   .append("path")
  //     .attr("class", "border")
  //     .call(redraw);
}

const hexTopology = (radius, width, height, hexagons, canvasName) => {
  console.log(hexagons);
  const dx = radius * 2 * Math.sin(Math.PI / 3),
      dy = radius * 1.5,
      m = Math.ceil((height + radius) / dy) + 1,
      n = Math.ceil(width / dx) + 1,
      geometries = [],
      arcs = [];
  let total = 0;
  for (var j = -1; j <= m; ++j) {
    for (var i = -1; i <= n; ++i) {
      var y = j * 2, x = (i + (j & 1) / 2) * 2;
      arcs.push([[x, y - 1], [1, 1]], [[x + 1, y], [0, 1]], [[x + 1, y + 1], [-1, 1]]);
    }
  }



  for (var j = 0, q = 3; j < m; ++j, q += 6) {
    for (var i = 0; i < n; ++i, q += 3) {
      geometries.push({
        id: total,
        name: canvasName,
        type: "Polygon",
        arcs: [[q, q + 1, q + 2, ~(q + (n + 2 - (j & 1)) * 3), ~(q - 2), ~(q - (n + 2 + (j & 1)) * 3 + 2)]],
        fill: (hexagons) ? hexagons[total] : false
        // fill: Math.random() > i / n * 2
      });
      ++total;
    }
  }
  console.log(geometries, (hexagons ? Object.keys(hexagons).length : 0));
  return {
    transform: {translate: [0, 0], scale: [1, 1]},
    objects: {hexagons: {type: "GeometryCollection", geometries: geometries}},
    arcs: arcs
  };
}

const updateCanvas = (arc) => {
  d3.selectAll(".point").attr("class", function (d) {
    if (arc.id === d.id) {
      console.log(d, arc);
    }
    if (arc.id === d.id && arc.name === d.name) {
      d.fill = arc.fill;
    }
    return d.fill ? "fill point" : "point"
   });
}

// function createColorPicker(width) {
//
//   var color = d3.scaleOrdinal()
//                 .domain(d3.range(9))
//                 .range([
//                   "#d53e4f",
//                   "#f46d43",
//                   "#fdae61",
//                   "#fee08b",
//                   "#ffffbf",
//                   "#e6f598",
//                   "#abdda4",
//                   "#66c2a5",
//                   "#3288bd"]),
//       dragColor;
//
//   var components = color.domain().map(function() { return []; });
//
//   var legend = d3.select(".legend")
//       .attr("transform", "translate(" + ((width - color.domain().length * 24) / 2) + ",10)")
//       .style("cursor", "pointer")
//     .selectAll("rect")
//       .data(color.domain())
//     .enter().append("rect")
//       .attr("x", function(d) { return d * 24; })
//       .attr("width", 24 - 3)
//       .attr("height", 24 - 3)
//       .style("stroke", function(d) { return d ? null : "#000"; })
//       .style("fill", color)
//       .on("click", clicklegend);
//
//     function clicklegend(d) {
//       var legend = d3.select(".legend");
//       legend[0][selectedColor].style.stroke = null;
//       legend[0][selectedColor = d].style.stroke = "#000";
//     }
// }

export { initHexMesh, drawHexCanvas, updateCanvas, width, height, radius };
