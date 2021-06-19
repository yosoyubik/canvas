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

export function hexProjection(radius) {
  const dx = radius * 2 * Math.sin(Math.PI / 3),
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

export default function hexTopology(name, radius, width, height, hexagons, oldWidth) {
  const dx = radius * 2 * Math.sin(Math.PI / 3),
    dy = radius * 1.5,
    m = Math.ceil((height + radius) / dy) + 1,
    n = Math.ceil(width / dx) + 1,
    nOld = oldWidth ? Math.ceil(oldWidth / dx) + 1 : width,
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

  const move = false;
  const hexKeys = Object.keys(hexagons);
  const indexMap = {};
  // console.log(width !== oldWidth, width, oldWidth);
  hexKeys.map((index) => {
    if ((oldWidth && width !== oldWidth) || move) {
      indexMap[transformIndex(index, nOld, n)] = index;
    } else {
      indexMap[index] = index;
    }
  });

  for (let j = 0, q = 3; j < m; ++j, q += 6) {
    for (let i = 0; i < n; ++i, q += 3) {
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
