import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import MVT from "ol/format/MVT";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import { createDefaultStyle } from "ol/style/Style";
import { fromLonLat } from "ol/proj";

import { createVectorStyle } from "./createVectorStyle";

import stylefunction from 'ol-mapbox-style/dist/stylefunction';

import { _getFonts } from 'ol-mapbox-style';

import proj4 from 'proj4';
import {addProjection, getTransform, Projection} from 'ol/proj';
import {register} from 'ol/proj/proj4';

// Define 25833
proj4.defs("EPSG:25833", "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs");
register(proj4);
var extent = {
  'EPSG:25833': [-2500000, 3500000, 3045984, 9045984]
};
const projection25833 = new Projection({
  code: 'EPSG:25833',
  units: 'm',
  extent: extent['EPSG:25833']
});
addProjection(projection25833);

var kartdata = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    attributions: '© <a href="https://www.kartverket.no/">Kartverket</a>',
    format: new MVT(),
    //projection: projection25833, // not sure if this is needed here
    url: "https://cache.kartverket.no/test/vectortiles/landtopo/utm33/{z}/{x}/{y}.mvt"
  })
});

var map = new Map({
  //layers: [ kartdata],
  target: "map",
  view: new View({
    zoom: 13,
    projection: projection25833, // set 25833 as main projection
    center: fromLonLat([10.75, 59.91])
  })
});

/** Show some info, nice to have while developing */
map.on('pointermove', showInfo);
var info = document.getElementById('info');
function showInfo(event) {
  var features = map.getFeaturesAtPixel(event.pixel);
  if (features.length == 0) {
    info.innerText = '';
    info.style.opacity = 0;
    return;
  }
  var properties = features[0].getProperties();
  info.innerText = JSON.stringify(properties, null, 2);
  info.style.opacity = 1;
}

/** Init Fonts ? (this should not be nesessary, but it is) */
var fonts = ["Open Sans Regular"];
var test = _getFonts(fonts);

/** Get the mapbox style and add a layer to the map */
fetch('https://cache.kartverket.no/test/styles/landtopo.json')
 .then(r => r.json())
 .then((glStyle) => {
  var layers = glStyle.layers;
  layers.forEach(el => {
    if (el.id && el.source) {
      console.log(el.id); // print the layers from the style
      //stylefunction(kartdata, glStyle, el.id);
    }
  });
  //applyBackground(map, glStyle);
  //stylefunction(kartdata, glStyle, 'bygningsflate');  
  stylefunction(kartdata, glStyle, 'topo4_cache');
  if (map.getLayers().getArray().indexOf(kartdata) === -1) {    
    map.addLayer(kartdata);
  }
});
