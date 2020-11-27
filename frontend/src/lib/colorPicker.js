//  Adapted from: https://bl.ocks.org/mbostock/debaad4fcce9bcee14cf
//
import * as d3 from 'd3';

export default function createColorPicker(width, legend) {
  let color = d3.scaleOrdinal()
                .domain(d3.range(9))
                .range(['#d53e4f',
                        '#f46d43',
                        '#fdae61',
                        '#fee08b',
                        '#ffffbf',
                        '#e6f598',
                        '#abdda4',
                        '#66c2a5',
                        '#3288bd']),
      grays = d3.scaleOrdinal()
                .domain(d3.range(9))
                .range((d3.schemeGreys[9])),
      selectedColor = 0;

  function clicklegend(d) {
    let legend = d3.select('.legend').selectAll('rect');
    let colors = legend.nodes();
    colors[selectedColor].style.stroke = null;
    colors[(selectedColor = d)].style.stroke = '#000';
  }

  legend
    .attr('transform', `translate(${(width / 2) - (18 * 24 / 2) - 3 }, 25)`)
    .style("cursor", "pointer");

  legend.selectAll('rect')
    .data(d3.range(18))
  .enter().append('rect')
    .attr('x', function(d) {
      if (d < 9) {
        return d * 24;
      } else {
        return (d + 1) * 24;
      }
    })
    .attr('width', 24 - 3)
    .attr('height', 24 - 3)
    .style('stroke', function(d) { return d ? null : '#000'; })
    .style('fill', function (d) {
      if (d < 9) {
        return color(d);
      }
      else {
        return grays(d);
      }
    })
    .on('click', clicklegend);
}