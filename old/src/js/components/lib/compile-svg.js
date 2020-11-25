// Adapted from: http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177


const hexClasses = {
  mesh: [".hexagon",
         ".hexagon path",
         ".hexagon :hover",
         ".hexagon .fill",
         ".border, .mesh",
         ".mesh",
         ".border"],
  map: [".background", ".foreground", ".background path", ".foreground path"]
};

const parseSVG = ( svgNode ) => {
	const compiledSVG = appendCSS( cssStyleText, svgNode );

	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(compiledSVG);

	return svgString;
}

const contains = (str, arr) => {
  return arr.indexOf( str ) === -1 ? false : true;
}

const getCSSStyles = ( parentElement, map ) => {
  let extractedCSSText = '';
  const s = document.styleSheets[0];
  var cssRules = s.cssRules;
  for (let r = 0; r < cssRules.length; r++) {
    if ( contains( cssRules[r].selectorText, hexClasses[map] ) )
      extractedCSSText += cssRules[r].cssText;
    }

  return extractedCSSText;
}

const appendCSS = ( element, css ) => {
  const styleElement = document.createElement("style");
  styleElement.setAttribute("type","text/css");
  styleElement.innerHTML = css;
  const refNode = element.hasChildNodes() ? element.children[0] : null;
  element.insertBefore( styleElement, refNode );
  return element;
}

const simpleParseSVG = (svgNode, mapType) => {
  const svgNodePlusCSS = appendCSS(svgNode, getCSSStyles(svgNode, mapType));
  let serializedXML = new XMLSerializer().serializeToString(svgNode);
  // Fix root xlink without namespace
  serializedXML = serializedXML.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=');
  // Safari NS namespace fix
  serializedXML = serializedXML.replace(/NS\d+:href/g, 'xlink:href');
  return serializedXML;
}

export  { parseSVG, simpleParseSVG };
