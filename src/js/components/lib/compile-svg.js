// Adapted from: http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177

import { sigil, stringRenderer } from 'urbit-sigil-js'

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
	// svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
	// svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

	return svgString;
}

const contains = (str, arr) => {
  return arr.indexOf( str ) === -1 ? false : true;
}

const getCSSStyles = ( parentElement, map ) => {
  console.log(map);
  let extractedCSSText = '';
  const s = document.styleSheets[0];
  // console.log(s);
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

  // const svgString =
  // `<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
  //   <style>
  //     circle {
  //       fill: gold;
  //       stroke: maroon;
  //       stroke-width: 2px;
  //     }
  //   </style>
  //
  //   <circle cx="5" cy="5" r="4" />
  // </svg>`;

  // const svgString = sigil({
  //   patp: "~norsyr-torryn",
  //   renderer: stringRenderer,
  //   size: 30,
  //   colors: ['white', 'black'],
  // });
  // const svgDocument = new DOMParser().parseFromString(svgString, 'image/svg+xml')
  // svgDocument.documentElement.width.baseVal.valueAsString = `40px`
  // svgDocument.documentElement.height.baseVal.valueAsString = `40px`
  const svgNodePlusCSS = appendCSS(svgNode, getCSSStyles(svgNode, mapType));
  let serializedXML = new XMLSerializer().serializeToString(svgNode);
  // Fix root xlink without namespace
  serializedXML = serializedXML.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=');
  // Safari NS namespace fix
  serializedXML = serializedXML.replace(/NS\d+:href/g, 'xlink:href');
  return serializedXML;
}

export  { parseSVG, simpleParseSVG };
