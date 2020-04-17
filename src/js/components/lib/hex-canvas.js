import * as d3 from "d3";
import * as topojson from "topojson";


const width = 960,
      height = 500,
      radius = 20;

const drawHexCanvas = (props) => {
  console.log("drawing", props);

  const topology = hexTopology(radius, width, height, props.hexagons);
  const projection = hexProjection(radius);
  const path = d3.geoPath().projection(projection);
  let mousing = 0;

  const mousedown = function(d) {
    // console.log("mousedown");
    mousing = d.fill ? -1 : +1;
    mousemove.apply(this, arguments);
  }

  const mousemove = function(d) {
    // console.log("mousemove");
    if (mousing) {
      if (d.fill !== mousing > 0)
        props.api.hexagons.paint('0', d.id, mousing > 0);
      d3.select(this).classed("fill", d.fill = mousing > 0);
      border.call(redraw);
    }
  }

  const mouseup = function() {
    // console.log("mouseup");
    mousemove.apply(this, arguments);
    mousing = 0;
  }

  const changeColor = function(d){
    return d.fill ? "fill" : null;
  }

  const redraw = (border) => {
    border.attr("d",
      path(topojson.mesh(topology, topology.objects.hexagons,
        function(a, b) { return a.fill ^ b.fill; })
      )
    );
  }

  // const svg = d3.select(this.refs.canvas).append("svg")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .append("g")
  //       .attr("class", "hexagon")

  const svg = d3.select(".hexagon");

  // update
  const hexagons = svg
    .selectAll(".point")
    .data(topology.objects.hexagons.geometries)
    .attr("class", changeColor);

  // enter
  hexagons
    .enter().append("path")
      .attr("d", function(d) { return path(topojson.feature(topology, d)); })
      .attr("class", "point")
      .attr("class", changeColor)
      .on("mousedown", mousedown)
      .on("mousemove", mousemove)
      .on("mouseup", mouseup);

  //const mesh = d3.select(".mesh");
  //  update

  //  enter

  svg.append("path")
      .datum(topojson.mesh(topology, topology.objects.hexagons))
      .attr("class", "mesh")
      .attr("d", path);

  const border = svg.append("path")
      .attr("class", "border")
      .call(redraw);

}

const hexTopology = (radius, width, height, hexagons) => {
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
        type: "Polygon",
        arcs: [[q, q + 1, q + 2, ~(q + (n + 2 - (j & 1)) * 3), ~(q - 2), ~(q - (n + 2 + (j & 1)) * 3 + 2)]],
        fill: (hexagons) ? hexagons.hasOwnProperty(total) : false
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

export { drawHexCanvas, width, height, radius };
