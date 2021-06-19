<script lang='ts'>
  import { writable } from 'svelte/store';
  import * as d3 from 'd3';
  import { select, selectAll } from 'd3-selection';
  import * as topojson from 'topojson';
  import { tick } from 'svelte';
  import type { Strokes, Metadata } from "../types/canvas";

  import Hexagon from './Hexagon.svelte';

  type CanvasData = {
    data: Strokes;
    metadata: Metadata;
  }

  export let width: number;
  export let height: number;
  export let canvas: CanvasData;

  const colors = d3.range(18);
  const color = d3
    .scaleOrdinal()
    .domain(d3.range(9))
    .range([
      '#d53e4f',
      '#f46d43',
      '#fdae61',
      '#fee08b',
      '#ffffbf',
      '#e6f598',
      '#abdda4',
      '#66c2a5',
      '#3288bd' ]);

  let geometries, topology
      , selectedColor = color('0')
      , apiCalls = {}
      , mousing = 0
      , currentColor = 0;

  const grays = d3.scaleOrdinal().domain(d3.range(9)).range(d3.schemeGreys[9]);
  const radius = 10;

  $: projection = hexProjection(radius);
  $: path = d3.geoPath().projection(projection);

  function clicklegend(d) {
    let legend = d3.select('.legend').selectAll('rect');
    let colors = legend.nodes();
    colors[currentColor].style.stroke = 'gray';
    colors[(currentColor = d)].style.stroke = '#000';
    selectedColor = (d < 9) ? color(d) : grays(d);
  }

  function coordinatesFromIndex(index, width) {
    return { x: Math.floor(index / width), y: index % width };
  }

  function indexFromCoordinates(x, y, width) {
    return width * x + y;
  }

  function transformIndex(index, oldWidth, newWidth) {
    const { x, y } = coordinatesFromIndex(index, oldWidth);
    return Math.floor(indexFromCoordinates(x, translate(y, 0), newWidth));
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
          }
        };
      }
    };
  }

  function hexTopology(name, radius, width, height, hexagons, oldWidth) {
    // console.log(name, radius, width, height, hexagons, oldWidth);
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
            [1, 1]
          ],
          [
            [x + 1, y],
            [0, 1]
          ],
          [
            [x + 1, y + 1],
            [-1, 1]
          ]
        );
      }
    }

    const move = true;
    const hexKeys = Object.keys(hexagons);
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
              ~(q - (n + 2 + (j & 1)) * 3 + 2)
            ]
          ],
          attr: (hexagons && hexagons[indexMap[total]]) || {}
        });

        ++total;
      }
    }

    return {
      transform: { translate: [0, 0], scale: [1, 1] },
      objects: {
        hexagons: { type: 'GeometryCollection', geometries }
      },
      arcs
    };
  }

  const initHexMesh = (width, height) => {
    const topology = hexTopology('', radius, width, height, {}, '', undefined);
    select('#mesh')
      .select('.mesh-group')
      .append('path')
      .datum(topojson.mesh(topology, topology.objects.hexagons))
      .attr('class', 'mesh')
      .attr('d', path);
  };

  function drawHexCanvas(hexagonsGroup, canvasData, metadata, width, height) {
    const canvasName = metadata.name;
    const location = metadata.location;
    const template = metadata.template;
    const oldWidth = metadata.width;
    const topology = hexTopology(canvasName, radius, width, height, canvasData, oldWidth);

    let apiCalls = {};

    // const g = select(hexagonsGroup);

    // update
    const hexagons = hexagonsGroup
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

    // exit
    hexagons.exit().remove();
  };

  function updateHexCanvas (arc, canvas) {
    selectAll('.point').style('fill', function (d) {
      if (arc.id === d.id && canvas === d.name) {
        d.attr.fill = arc.fill;
        d.attr.color = d.attr.fill ? arc.color : undefined;
      }
      if (d.attr.fill) {
        return d.attr.color;
      } else {
        return '#fff0';
      }
    });
  };

  const mousedown = function (e) {
    const color = d3.color(selectedColor).toString();
    console.log(e.currentTarget);
    // mousing = d.attr.fill && d.attr.color === color ? -1 : +1;
    // geometries[i] = {
    //   attr: {
    //     fill: true,
    //     color: true ? color : '#fff0'
    //   },
    //   ...d
    // };
    // geometries = geometries;
    // mousemove.apply(this, arguments);
    d3.select(e.currentTarget).attr.fill = true ? color : '#fff0'
  };

  const mousemove = function (d, i) {
    if (mousing) {
      const color = d3.color(selectedColor).toString();
      const fill = mousing > 0;
      // Save stroke locally on browser
      canvas.data[d.id] = {
        fill: fill,
        color: fill ? color : undefined
      };
      // d.attr.fill = fill;
      // d.attr.color = fill ? color : '#fff0';
      geometries[i] = {
        attr: {
          fill,
          color: fill ? color : '#fff0'
        },
        ...d
      };
      tick();
      //  d3.select(this).attr.fill = fill;
      //  d3.select(this).attr.color = fill ? color : '#fff0';
      // removes (-1) or adds  (+1) color to an hexagon
      // if (mousing !== 0 && canvas.metadata.template !== 'mesh-welcome') {
      //   // Save stroke remotely
      //   apiCalls[d.id] = {
      //     mesh: {
      //       id: d.id,
      //       filled: d.attr.fill,
      //       color: mousing > 0 ? color : ''
      //     }
      //   };
      // }
    }
  };

  const mouseup = function (d, i) {
    // console.log(canvas.metadata.name);
    mousemove.apply(this, arguments);
    // const strokes = Object.values(apiCalls);

    // if (strokes.length > 0 && canvas.metadata.name !== 'welcome') {
    //   // props.api.canvas.paint({
    //   //   'canvas-name': canvasName,
    //   //   location: location,
    //   //   strokes: strokes,
    //   // });
    //   apiCalls = {};
    // }
    mousing = 0;
  };


  console.log(width, height);
  //  $ allows to render hexagons on route change
  //
  $: if (canvas.data) {
    topology = hexTopology(
      canvas.metadata.name,
      radius,
      width,
      height,
      canvas.data,
      canvas.metadata.width
    );
    geometries = topology.objects.hexagons.geometries;
  }

  async function handleUpdate(event) {
    tick();
    // Update stroke
    canvas.data[event.detail.id] = event.detail.data;
    canvas.data = canvas.data;
	}

</script>

<svg
  class='db'
  id='canvas'
  viewBox={`0 0 ${width} ${height}`}
  preserveAspectRatio='xMinYMin meet'
>
  <g class='hexagon'>
    {#if geometries && topology}
      {#each geometries as d}
        <Hexagon
          bind:topology={topology}
          bind:d={d}
          bind:selectedColor={selectedColor}
          on:update={handleUpdate}
          bind:mousing={mousing}
        />
      {/each}
    {/if}
  </g>
  <g  class='legend'
      transform={`translate(${width / 2 - (18 * 24) / 2 - 3}, 25)`}
  >
    {#each colors as d}
      <rect
        x={(d < 9) ? d * 24 : (d + 1) * 24}
        width=21
        height=21
        stroke={d ? 'gray' : '#000'}
        fill={(d < 9) ? color(d) : grays(d)}
        on:click={() => clicklegend(d)}
      >
      </rect>
    {/each}
  </g>
</svg>

<style>
  svg {
    width: 100%;
    padding-bottom: 92%;
    height: 50px;
    overflow: visible;
  }

  .hexagon {
    fill: #fff0;
    pointer-events: all;
  }

  .hexagon :hover {
    fill: pink;
  }
/*
  .hexagon .fill {
    fill: red;
  } */

  .legend {
    cursor: pointer;
  }
</style>