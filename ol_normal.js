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

import stylefunction from 'ol-mapbox-style/stylefunction';

import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

var colorStyle;

var kartdata500_vt = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    attributions: '© <a href="https://www.kartverket.no/">Kartverket</a>',
    format: new MVT(),
    url:
      "http://wms.geonorge.no/skwms1/wmstest.kartdata500_vt?mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=all&map.imagetype=mvt"    
  }),
  style: createDefaultStyle()
});

var kartdata2_vt = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    attributions: '© <a href="https://www.kartverket.no/">Kartverket</a>',
    format: new MVT(),
    url:
      "http://wms.geonorge.no/skwms1/wmstest.kartdata2_vt?mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=all&map.imagetype=mvt"
  })
});

/*
$.getJSON( "http://nnriap587/vt/mapserv/colour.json", function( json ) {
    kartdata2_vt.setStyle(createVectorStyle(Style, Fill, Stroke, Icon, Text, json));
 })
*/
 fetch('http://nnriap587/vt/mapserv/colour.json')
 .then(r => r.json())
 .then((glStyle) => {
  var layers = glStyle.layers;
  layers.forEach(el => {
    if (el.id && el.source) {
      console.log(el.id);
      // stylefunction(kartdata2_vt, glStyle, el.id);
    }
  });
  stylefunction(kartdata2_vt, glStyle, 'N50Hoydekurver');
  stylefunction(kartdata2_vt, glStyle, 'Skog');
  if (map.getLayers().getArray().indexOf(kartdata2_vt) === -1) {    
    map.addLayer(kartdata2_vt);
  }
});
var bgkLayer = new TileLayer({
  source: new TileWMS({
    url: "http://opencache.statkart.no/gatekeeper/gk/gk.open?",
    params: {
      LAYERS: "topo4graatone",
      VERSION: "1.1.1"
    }
  })
});
var map = new Map({
  //layers: [ //bgkLayer, //, kartdata500_vt kartdata2_vt
  //],
  target: "map",
  view: new View({
    zoom: 13,
    center: fromLonLat([10.746, 59.9])
  })
});
