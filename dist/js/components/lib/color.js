// From: https://bl.ocks.org/mbostock/debaad4fcce9bcee14cf
import * as d3 from "d3";


function createColorPicker(width) {

  var color = d3.scaleOrdinal().domain(d3.range(9)).range(["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"]),
      selectedColor = 0,
      dragColor;

  var components = color.domain().map(function() { return []; });

  var legend = d3.select(".legend")
      .attr("transform", "translate(" + ((width - color.domain().length * 24) / 2) + ",10)")
      .style("cursor", "pointer")
    .selectAll("rect")
      .data(color.domain())
    .enter().append("rect")
      .attr("x", function(d) { return d * 24; })
      .attr("width", 24 - 3)
      .attr("height", 24 - 3)
      .style("stroke", function(d) { return d ? null : "#000"; })
      .style("fill", color)
      .on("click", clicklegend);

    function clicklegend(d) {
      var legend = d3.select(".legend").selectAll("rect");
      var colors = legend.nodes();
      colors[selectedColor].style.stroke = null;
      colors[selectedColor = d].style.stroke = "#000";
    }

    return legend;

  // var white = d3.rgb("white"),
  //     black = d3.rgb("black"),
  //     width = d3.select("canvas").property("width");
  //
  // var channels = {
  //   h: {scale: d3.scaleLinear().domain([0, 360]).range([0, width]), x: width / 2},
  //   c: {scale: d3.scaleLinear().domain([0, 100]).range([0, width]), x: width / 2},
  //   l: {scale: d3.scaleLinear().domain([0, 150]).range([0, width]), x: width / 2}
  // };
  //
  // function dragged(d) {
  //   d.value.x = Math.max(0, Math.min(this.width - 1, d3.mouse(this)[0]));
  //   canvas.each(render);
  // }
  //
  // var channel = d3.selectAll(".channel")
  //     .data(d3.entries(channels));
  //
  // var canvas = channel.select("canvas")
  //     .call(d3.drag().on("drag", dragged))
  //     .each(render);
  //
  // function render(d) {
  //   var width = this.width,
  //         context = this.getContext("2d"),
  //         image = context.createImageData(width, 1),
  //         i = -1;
  //
  //   var current = d3.hsl(
  //     channels.h.scale.invert(channels.h.x),
  //     channels.c.scale.invert(channels.c.x),
  //     channels.l.scale.invert(channels.l.x)
  //   );
  //
  //   for (var x = 0, v, c; x < width; ++x) {
  //     if (x === d.value.x) {
  //       c = white;
  //     } else if (x === d.value.x - 1) {
  //       c = black;
  //     } else {
  //       current[d.key] = d.value.scale.invert(x);
  //       c = d3.rgb(current);
  //     }
  //     image.data[++i] = c.r;
  //     image.data[++i] = c.g;
  //     image.data[++i] = c.b;
  //     image.data[++i] = 255;
  //   }
  //
  //   context.putImageData(image, 0, 0);
  // }

}

export { createColorPicker };
