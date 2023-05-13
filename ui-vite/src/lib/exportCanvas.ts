const appendCSS = element => {
  const styleElement = document.createElement('style');
  styleElement.setAttribute('type', 'text/css');
  // TODO: if a theme is used (e.g. dark background) set background-color ≈
  styleElement.innerHTML =
    'svg { background-color: white;} path {shape-rendering: crispEdges;}';
  const refNode = element.hasChildNodes() ? element.children[0] : null;
  element.insertBefore(styleElement, refNode);
  return element;
};

const parseSVG = (svgNode: SVGElement): string => {
  const mesh = document.getElementById('mesh');
  let clone = svgNode.cloneNode(true) as SVGElement;
  const g = clone.children.namedItem('hexagons');
  if (mesh) g.removeChild(g.children.namedItem('mesh'));
  clone = appendCSS(clone);
  //  TODO: remove non-filled pixels from the svgNode
  //
  let serializedXML = new XMLSerializer().serializeToString(clone);
  serializedXML = serializedXML.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=');
  // // Safari NS namespace fix
  serializedXML = serializedXML.replace(/NS\d+:href/g, 'xlink:href');
  return serializedXML;
};

export default parseSVG;
