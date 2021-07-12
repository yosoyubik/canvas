const parseSVG = (svgNode: SVGElement): string => {
  // const legend = document.getElementById('legend');
  // const border = document.getElementById('border');
  console.log(svgNode);
  const mesh = document.getElementById('mesh');
  // if (border) border.setAttribute('fill', 'white');
  if (mesh) mesh.setAttribute('fill', 'white');
  // svgNode.removeChild(legend);
  let serializedXML = new XMLSerializer().serializeToString(svgNode);
  // svgNode.appendChild(legend);
  // if (border) border.setAttribute('fill', '#fff0');
  if (mesh) mesh.setAttribute('fill', '#fff0');
  // // Fix root xlink without namespace
  serializedXML = serializedXML.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=');
  // // Safari NS namespace fix
  serializedXML = serializedXML.replace(/NS\d+:href/g, 'xlink:href');
  return serializedXML;
};

export default parseSVG;
