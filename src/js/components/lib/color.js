// From: https://bl.ocks.org/mbostock/debaad4fcce9bcee14cf
//
import * as d3 from "d3";


function createColorPicker(width) {

  var color = d3.scaleOrdinal()
                .domain(d3.range(9))
                .range(["#d53e4f",
                        "#f46d43",
                        "#fdae61",
                        "#fee08b",
                        "#ffffbf",
                        "#e6f598",
                        "#abdda4",
                        "#66c2a5",
                        "#3288bd"]),
      grays = d3.scaleOrdinal(d3.schemeGreys[9]),
      selectedColor = 0,
      dragColor;
  // console.log(grays);
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

}

export { createColorPicker };
