import type { CanvasStroke, CanvasTopology } from 'src/types/canvas';

function coordinatesFromIndex(index, n) {
  return { x: Math.floor(index / n), y: index % n };
}

function indexFromCoordinates(x, y, n) {
  return n * x + y;
}

export function transformIndex(index, oldN, newN) {
  const { x, y } = coordinatesFromIndex(index, oldN);
  return Math.floor(indexFromCoordinates(x, translate(y, 0), newN));
}

function translate(coord, offset) {
  return coord + offset;
}

export function topology(type) {
  return type === 'hexa' ? hexTopology : squareTopology;
}

export function columns(width, radius, type) {
  const dx =
    type === 'hexa' ? radius * 2 * Math.sin(Math.PI / 3) : radius * 1.5;
  return Math.ceil(width / dx) + 1;
}

export function getAdjacent(totalColumns, type, id) {
  let row = Math.floor(id / totalColumns);
  let column = id % totalColumns;
  let ids = [];
  let hexa = type == 'hexa';
  let rowEven = row % 2 == 0;
  let hexOffset = rowEven ? 1 : -1;

  // Don't wrap
  if (column >= 1) {
    ids.push(id - 1);
  }
  if (column + 1 < totalColumns) {
    ids.push(id + 1);
  }
  if (hexa) {
    let aboveAndBelowPixels = [
      id - totalColumns,
      id - totalColumns + hexOffset,
      id + totalColumns,
      id + totalColumns + hexOffset
    ];

    // Going out of bounds is fine, just don't wrap
    for (let pixel of aboveAndBelowPixels) {
      let pixelRow = Math.floor(pixel / totalColumns);
      if (Math.abs(pixelRow - row) == 1) {
        ids.push(pixel);
      }
    }
  } else {
    ids.push(id - totalColumns);
    ids.push(id + totalColumns);
  }

  return ids;
}

export function projection(radius, type) {
  const dx =
      type === 'hexa' ? radius * 2 * Math.sin(Math.PI / 3) : radius * 1.5,
    dy = type === 'hexa' ? radius * 1.5 : radius * 1.5;
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

function squareTopology(
  name,
  radius,
  width,
  height,
  squares: CanvasTopology,
  oldN
) {
  const dx = radius * 1.5,
    dy = radius * 1.5,
    m = Math.ceil((height + radius) / dy) + 1,
    n = Math.ceil(width / dx) + 1,
    // nOld = Math.ceil(width / oldDx) + 1,
    geometries = [],
    arcs = [];

  for (let j = -1; j <= m; ++j) {
    for (let i = -1; i <= n; ++i) {
      const y = j * 2,
        x = i * 2;
      arcs.push(
        [
          [x, y - 1],
          [2, 0]
        ],
        [
          [x + 2, y - 1],
          [0, 2]
        ]
      );
    }
  }

  squares.arcs = arcs;

  const indexMap = new Map();

  squares.objects.pixels.geometries.map((data, i) => {
    //  FIXME: turn off reindex of pixels
    if (n !== oldN && false) {
      indexMap.set(transformIndex(data.id, oldN, n), i);
    } else {
      indexMap.set(data.id, i);
    }
  });
  let total = 0;

  for (let j = 0, q = 2; j < m; ++j, q += 4) {
    for (let i = 0; i < n; ++i, q += 2) {
      const arcs = [[q, q + 1, ~(q + (n + 2) * 2), ~(q - 1)]];
      const polygon: CanvasStroke = indexMap.has(total)
        ? {
            ...squares.objects.pixels.geometries[indexMap.get(total)],
            arcs
          }
        : {
            id: total,
            type: 'Polygon',
            arcs
          };

      geometries.push(polygon);

      ++total;
    }
  }

  squares.objects.pixels.geometries = geometries;

  return squares;
}

function hexTopology(
  name,
  radius,
  width,
  height,
  hexagons: CanvasTopology,
  oldN
) {
  const dx = radius * 2 * Math.sin(Math.PI / 3),
    dy = radius * 1.5,
    m = Math.ceil((height + radius) / dy) + 1,
    n = Math.ceil(width / dx) + 1,
    // nOld = oldWidth ? Math.ceil(oldWidth / dx) + 1 : width,
    geometries = [],
    arcs = [];

  let total = 0;

  for (let j = -1; j <= m; ++j) {
    for (let i = -1; i <= n; ++i) {
      const y = j * 2,
        x = (i + (j & 1) / 2) * 2;
      arcs.push(
        [
          [x, y - 1],
          [1, 1] // /
        ],
        [
          [x + 1, y],
          [0, 1] // |
        ],
        [
          [x + 1, y + 1],
          [-1, 1] // \
        ]
      );
    }
  }

  // const move = false;

  const indexMap = new Map();
  hexagons.objects.pixels.geometries.map(({ id }, i) => {
    // if ((oldWidth && width !== oldWidth) || move) {
    if (oldN !== n) {
      indexMap.set(transformIndex(id, oldN, n), id);
    } else {
      indexMap.set(id, i);
    }
  });

  for (let j = 0, q = 3; j < m; ++j, q += 6) {
    for (let i = 0; i < n; ++i, q += 3) {
      const arcs = [
        [
          q,
          q + 1,
          q + 2,
          ~(q + (n + 2 - (j & 1)) * 3),
          ~(q - 2),
          ~(q - (n + 2 + (j & 1)) * 3 + 2)
        ]
      ];
      const polygon: CanvasStroke = indexMap.has(total)
        ? {
            ...hexagons.objects.pixels.geometries[indexMap.get(total)],
            arcs
          }
        : {
            id: total,
            type: 'Polygon',
            arcs
          };

      geometries.push(polygon);

      ++total;
    }
  }

  hexagons.objects.pixels.geometries = geometries;

  return { ...hexagons, arcs };
}
