import * as d3 from "d3";
import * as topojson from "topojson";

const width = 960,
      height = 960;

const selectedColor = (colors) => {
  return colors.find(color => {
    if (color.style.stroke) {
      return true;
    }
  });
}

const addStyle = function(d) {
  return d.attr ? d.attr.color : undefined;
}

const initMapCanvas = (map, metadata) => {
  console.log(map);
  const maps = metadata.type.split("-");
  if (maps[1] === 'us') {
    var projection = d3.geoAlbers()
      .scale(1280)
      .translate([width / 2, height / 2]);
  }else if (maps[1] === 'europe') {
    var projection = d3.geoMercator()
      .center([13, 52])
    	.translate([width / 2, (height / 2) + 20])
    	.scale([width / 1.6]);
    // var projection = d3.geoAlbers().center([11, 48.4])
    //   .rotate([11.4, 0])
    //   .scale(1280)
    //   .parallels([50, 60])
    //   .translate([width / 3, (height / 2) + 100]);
  }
  var path = d3.geoPath(projection);

  if (maps.length > 2) {
    var data = map.objects[maps[2]];
  } else {
    var data = map.objects;
  }
  d3.select(".background").append("path")
      .datum(topojson.mesh(map, data))
      .attr("class", "background")
      .attr("d", path);
  return path;
}

const drawMapCanvas = (map, props, path) => {
  const svg = d3.select("svg");
  let mousing = 0;
  let apiCalls = [];
  const canvasName = props.name;
  const canvasData = props.canvas;
  const location = props.metadata.location;

  const maps = props.metadata.type.split("-");
  const foreground = d3.select(".foreground");
  var bisectId = d3.bisector(function(d) { return d.id; }).left;

  if (maps.length > 2) {
    var features = topojson.feature(map, map.objects[maps[2]]).features;
  } else {
    var features = topojson.feature(map, map.objects).features;
  }

  features.forEach(function(item, index, array) {
    console.log(item);
    array[index].attr = (canvasData && canvasData[item.id]) ? canvasData[item.id] : {};
  });

  const mousedown = function(d) {
    const colors = d3.select(".legend").selectAll("rect").nodes();
    const color = d3.color(selectedColor(colors).style.fill).toString();
    // console.log(d);
    mousing = (d.attr.fill && d.attr.color === color) ? -1 : +1;
    mousemove.apply(this, arguments);
  }

  const mousemove = function(d) {
    if (mousing) {
      const colors = d3.select(".legend").selectAll("rect").nodes();
      const color = d3.color(selectedColor(colors).style.fill).toString();
      if ((d.attr.fill && d.attr.color === color) !== mousing > 0) {
        // Save stroke remotely
        apiCalls.push({mesh: {id: d.id, filled: mousing > 0, color: color}});
        // Save stroke locally on browser
        canvasData[d.id] = {fill: mousing > 0, color: color};
      }
      // d3.select(this).classed("point fill", d.fill = mousing > 0);
      d3.select(this).style('fill', () => {
        d.attr.fill = mousing > 0;
        if (d.attr.fill) {
          var color = d3.color(selectedColor(colors).style.fill).toString();
          d.attr.color = color;
          return color;
        } else {
          return 'white';
        }
      });
      // border.call(redraw);
    }
  }

  const mouseup = function() {
    mousemove.apply(this, arguments);
    if (apiCalls.length > 0) {
      props.api.canvas.paint({
        "canvas-name": canvasName,
        "location": location,
        "strokes": apiCalls
      });
      apiCalls = [];
    }
    mousing = 0;
  }

  // update
  const countries = foreground
    .selectAll("path")
      .data(features)
      .style('fill', addStyle);

  // enter
  countries.enter().append("path")
      .attr("d", function(d) { d.color = null; return path(d); })
      .style('fill', addStyle)
      .on("mouseover", function() { this.style.stroke = "black"; })
      .on("mouseout", function() { this.style.stroke = "none"; })
      .on("mousedown", mousedown)
      .on("mousemove", mousemove)
      .on("mouseup", mouseup);
}

export { initMapCanvas, drawMapCanvas, width, height };
