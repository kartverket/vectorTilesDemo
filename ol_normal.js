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

var kartdata = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    attributions: '© <a href="https://www.kartverket.no/">Kartverket</a>',
    format: new MVT(),
    url:
      "http://dcriap511/mapcache/gmaps/kartdata_vt@googlemaps/{z}/{x}/{y}.mvt"

  })
});

var map = new Map({
  //layers: [ kartdata],
  target: "map",
  view: new View({
    zoom: 13,
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
fetch('http://nnriap587.statkart.no/static/styles/topo4/style_cm.json')
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
