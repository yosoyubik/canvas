//  Adapted from: https://bl.ocks.org/mbostock/5249328
//

import * as d3 from "d3";
import { select, selectAll } from "d3-selection";
import * as topojson from "topojson";

const radius = 10;

const projection = hexProjection(radius);
const path = d3.geoPath().projection(projection);

function coordinatesFromIndex(index, width) {
  return { x: Math.floor(index / width), y: index % width };
}

function indexFromCoordinates(x, y, width) {
  return width * x + y;
}

function transformIndex(index, oldWidth, newWidth) {
  const { x, y } = coordinatesFromIndex(index, oldWidth);
  return Math.floor(
    indexFromCoordinates(x, translate(y, 0), newWidth),
  );
}

function translate(coord, offset) {
  return coord + offset;
}

function hexProjection(radius) {
  var dx = radius * 2 * Math.sin(Math.PI / 3),
    dy = radius * 1.5;
  return {
    stream: function (stream) {
      return {
        point: function (x, y) {
          stream.point((x * dx) / 2, ((y - (2 - (y & 1)) / 3) * dy) / 2);
        },
        lineStart: function () {
          stream.lineStart();
        },
        lineEnd: function () {
          stream.lineEnd();
        },
        polygonStart: function () {
          stream.polygonStart();
        },
        polygonEnd: function () {
          stream.polygonEnd();
        },
      };
    },
  };
};

function selectedColor(colors)  {
  return colors.find((color) => {
    if (color.style.stroke) {
      return true;
    }
  });
};

function hexTopology(name, radius, width, height, hexagons, oldWidth) {
  
  const dx = radius * 2 * Math.sin(Math.PI / 3),
    dy = radius * 1.5,
    m = Math.ceil((height + radius) / dy) + 1,
    n = Math.ceil(width / dx) + 1,
    nOld = oldWidth ? Math.ceil(oldWidth / dx) + 1 : width,
    geometries = [],
    arcs = [];

  let total = 0;

  for (var j = -1; j <= m; ++j) {
    for (var i = -1; i <= n; ++i) {
      var y = j * 2,
        x = (i + (j & 1) / 2) * 2;
      arcs.push(
        [
          [x, y - 1],
          [1, 1],
        ],
        [
          [x + 1, y],
          [0, 1],
        ],
        [
          [x + 1, y + 1],
          [-1, 1],
        ],
      );
    }
  }

  const move = true;
  const hexKeys = d3.keys(hexagons);
  const indexMap = {};
  hexKeys.map((index) => {
    if (width !== oldWidth || move) {
      indexMap[transformIndex(index, nOld, n)] = index;
    } else {
      indexMap[index] = index;
    }
  });

  for (var j = 0, q = 3; j < m; ++j, q += 6) {
    for (var i = 0; i < n; ++i, q += 3) {
      geometries.push({
        id: total.toString(),
        name,
        type: 'Polygon',
        arcs: [
          [
            q,
            q + 1,
            q + 2,
            ~(q + (n + 2 - (j & 1)) * 3),
            ~(q - 2),
            ~(q - (n + 2 + (j & 1)) * 3 + 2),
          ],
        ],
        attr: (hexagons && hexagons[indexMap[total]]) || {},
      });

      ++total;
    }
  }

  return {
    transform: { translate: [0, 0], scale: [1, 1] },
    objects: {
      hexagons: { type: 'GeometryCollection', geometries },
    },
    arcs,
  };
};

const initHexMesh = (width, height) => {
  const topology = hexTopology('', radius, width, height, {}, '', undefined);
  console.log(topology);
  select('#mesh').select(".mesh-group")
    .append("path")
    .datum(topojson.mesh(topology, topology.objects.hexagons))
    .attr("class", "mesh")
    .attr("d", path);
};

const drawHexCanvas = (canvasData, metadata, width, height) => {
  const canvasName = metadata.name;
  const location = metadata.location;
  const template = metadata.template;
  const oldWidth = metadata.width;
  const topology = hexTopology(
    canvasName,
    radius,
    width,
    height,
    canvasData,
    oldWidth,
  );

  let mousing = 0;
  let apiCalls = {};

  const mousedown = function (d) {
    const colors = select('.legend').selectAll('rect').nodes();
    const color = d3.color(selectedColor(colors).style.fill).toString();
    console.log('color', color);
    mousing = d.attr.fill && d.attr.color === color ? -1 : +1;
    mousemove.apply(this, arguments);
  };

  const mousemove = function (d) {
    if (mousing) {
      const colors = select('.legend').selectAll('rect').nodes();
      const color = d3.color(selectedColor(colors).style.fill).toString();
      // Save stroke locally on browser
      canvasData[d.id] = {
        fill: mousing > 0,
        color: mousing > 0 ? color : undefined,
      };
      select(this).style('fill', () => {
        d.attr.fill = mousing > 0;
        if (d.attr.fill) {
          d.attr.color = color;
          return color;
        } else {
          return '#fff0';
        }
      });
      // removes (-1) or adds  (+1) color to an hexagon
      if (mousing !== 0 && template !== 'mesh-welcome') {
        // Save stroke remotely
        apiCalls[d.id] = {
          mesh: {
            id: d.id,
            filled: d.attr.fill,
            color: mousing > 0 ? color : '',
          },
        };
      }
    }
  };

  const mouseup = function () {
    mousemove.apply(this, arguments);
    const strokes = Object.values(apiCalls);

    if (strokes.length > 0 && metadata.name !== 'welcome') {
      // props.api.canvas.paint({
      //   'canvas-name': canvasName,
      //   location: location,
      //   strokes: strokes,
      // });
      apiCalls = {};
    }
    mousing = 0;
  };

  const addStyle = function (d) {
    return d.attr && d.attr.fill ? d.attr.color : undefined;
  };

  const g = select('.hexagon');

  // update
  const hexagons = g
    .selectAll('path')
    .data(topology.objects.hexagons.geometries)
    .style('fill', addStyle);

  // enter
  hexagons
    .enter()
    .append('path')
    .attr('d', function (d) {
      return path(topojson.feature(topology, d));
    })
    .attr('class', 'point')
    .style('fill', addStyle)
    .on('mousedown', mousedown)
    .on('mousemove', mousemove)
    .on('mouseup', mouseup);
};

const updateHexCanvas = (arc, canvas) => {
  selectAll(".point").style("fill", function (d) {
    if (arc.id === d.id && canvas === d.name) {
      d.attr.fill = arc.fill;
      d.attr.color = d.attr.fill ? arc.color : undefined;
    }
    if (d.attr.fill) {
      return d.attr.color;
    } else {
      return "#fff0";
    }
  });
};

export { initHexMesh, drawHexCanvas, updateHexCanvas };
