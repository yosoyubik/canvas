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

let path;

const addStyle = function(d) {
  return (d.attr && d.attr.fill) ? d.attr.color : undefined;
}

const initMapCanvas = (map, metadata) => {
  if (metadata.type) {
    const maps = metadata.type.split("-");
    if (maps[1] === 'us') {
      var projection = d3.geoAlbers()
        .scale(1280)
        .translate([width / 2, height / 2.5]);
    }else if (maps[1] === 'europe') {
      var projection = d3.geoMercator()
        .center([13, 52])
      	.translate([width / 2, (height / 2) + 20])
      	.scale([width / 1.6]);
    }else if (maps[1] === 'africa') {
      var projection = d3.geoMercator()
        .center([23.1, 5.6])
      	.translate([width / 2, (height / 2.5)])
      	.scale([width / 2]);
    }
    path = d3.geoPath(projection);
    console.log(map, maps);
    if (maps.length > 2) {
      var data = map.objects[maps[2]];
    } else {
      var data = map.objects;
    }
    d3.select(".background").append("path")
        .datum(topojson.mesh(map, data))
        .attr("class", "background")
        .attr("d", path);
  }
}

const drawMapCanvas = (map, props) => {
  const svg = d3.select("svg");
  let mousing = 0;
  let apiCalls = {}};
  const canvasName = props.name;
  const canvasData = props.canvas;
  const location = props.metadata.location;

  const maps = props.metadata.type.split("-");
  const foreground = d3.select(".foreground");
  var bisectId = d3.bisector(function(d) { return d.id; }).left;

  if (maps.length > 2) {
    console.log(maps[2], maps, map.objects[maps[2]]);
    var features = topojson.feature(map, map.objects[maps[2]]).features;
  } else {
    var features = topojson.feature(map, map.objects).features;
  }

  features.forEach(function(item, index, array) {
    console.log(item);
    if (item.id) {
      item.id = (Number.isInteger(item.id)) ? item.id.toString() : item.id;
    } else {
      item.id = item.properties.geounit;
    }

    item.name = canvasName;
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
      if ( !(mousing > 0 && d.attr.color === color)) {
        // Save stroke remotely
        apiCalls[d.id] = {
          mesh: {
            id: d.id, filled: mousing > 0,
            color: (mousing > 0) ? color: ""}};
      }
      // Save stroke locally on browser
      canvasData[d.id] = {
        fill: mousing > 0, color: (mousing > 0) ? color: undefined
      };
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
    }
  }

  const mouseup = function() {
    mousemove.apply(this, arguments);
    const strokes = Object.values(apiCalls);
    if ((strokes.length > 0) && (type !== 'welcome')) {
      props.api.canvas.paint({
        "canvas-name": canvasName,
        "location": location,
        "strokes": strokes
      });
      apiCalls = {};
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
      .attr("d", function(d) {
        d.id = d.id.toString();
        d.color = null; return path(d);
      })
      .style('fill', addStyle)
      .attr("class", "point")
      .on("mouseover", function() { this.style.stroke = "black"; })
      .on("mouseout", function() { this.style.stroke = "none"; })
      .on("mousedown", mousedown)
      .on("mousemove", mousemove)
      .on("mouseup", mouseup);
}

const updateMapCanvas = (arc, canvas) => {
  d3.selectAll(".point")
    .style('fill', function (d) {
      if (arc.id === d.id && canvas === d.name) {
        d.attr.fill = arc.fill;
        d.attr.color = d.attr.fill ? arc.color : undefined;
      }
      if (d.attr.fill) {
        return d.attr.color;
      }
      else {
        return '#fff0';
      }
   });
}

export { initMapCanvas, drawMapCanvas, updateMapCanvas, width, height };
