/**
 * This file is the main map script. The contents of this script gets executed sequentially
 * when it is imported.
 */

//Step 1: Add the OSM base map and the map object to the WebGIS
//Put here the OSM layer. 

console.log("map.js loaded");
let osm = new ol.layer.Tile({
    visible: true,
    source: new ol.source.OSM()
});
//Put here the main map object.
const initialZoom = 5;
const initialCoordinates = [-74, 4.6];
let map = new ol.Map({
    target: document.getElementById('map'),
    layers: [osm],
    view: new ol.View({
        center: ol.proj.fromLonLat(initialCoordinates), //We have to convert from EPSG:4326 to EPSG:3857 because openlayers uses it by default!
        zoom: initialZoom
    })
});

console.log("Creating Colombia boundary layer");
//Step 2: The Colombia Boundary layer definition. This is a WMS layer
var colombiaBoundary = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: {
            'LAYERS': 'gis:COL_adm0'
        },
        ratio: 1,
        serverType: 'geoserver'
    })
});
map.addLayer(colombiaBoundary);
console.log("Boundary layer added");

//Step 3: Add the other layers from the online geoserver
//The Colombia Departments layer definition. Here we use opacity to dim the layer
var colombiaDepartments = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_adm1' }
    }),
    opacity: 0.5
});
map.addLayer(colombiaDepartments);

//The Colombian roads layer definition. This is a WMS layer.
var colombiaRoads = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_roads' }
    }),
    visible: false //This layer will not be initially visible, but still will be added to the map!
});
map.addLayer(colombiaRoads);

//The Colombian rivers layer definition. This is a WMS layer.
var colombiaRivers = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_rivers' }
    }),
    minResolution: 1000, //Conditional rendering. It shows only when zoomed in, and disappears when zoomed out.
    maxResolution: 5000
});
map.addLayer(colombiaRivers);

var corine12 = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2018_WM/MapServer/WMSServer',
        params: {
            'LAYERS': '12,'
        }
    }),
    opacity: 0.5,
    visible: true
});

var corine13 = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2018_WM/MapServer/WMSServer',
        params: { 'LAYERS': '13' }
    }),
    opacity: 0.5,
    visible: true
});

map.addLayer(corine12);
map.addLayer(corine13);


var extent = ol.proj.transformExtent(
    [-3.39, 42.75, 21.31, 50.22],
    'EPSG:4326',
    'EPSG:3857'
);

map.getView().fit(extent, {
    padding: [20,20,20,20]
});

let layerState = 0;

// Initial state
corine12.setVisible(true);
corine13.setVisible(true);

const button = document.getElementById("toggleCorine");

button.addEventListener("click", function() {

    let visible = corine12.getVisible();

    corine12.setVisible(!visible);
    corine13.setVisible(!visible);

    if (visible) {
        button.innerHTML = "Show Corine Layers";
    } else {
        button.innerHTML = "Hide Corine Layers";
    }

});