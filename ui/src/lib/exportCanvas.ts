const parseSVG = (svgNode: SVGElement): string => {
  const mesh = document.getElementById('mesh');
  if (mesh) mesh.setAttribute('fill', 'white');
  //  TODO: remove non-filled pixels from the svgNode
  //
  let serializedXML = new XMLSerializer().serializeToString(svgNode);
  if (mesh) mesh.setAttribute('fill', '#fff0');
  serializedXML = serializedXML.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=');
  // // Safari NS namespace fix
  serializedXML = serializedXML.replace(/NS\d+:href/g, 'xlink:href');
  return serializedXML;
};

export default parseSVG;
