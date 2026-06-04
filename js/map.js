/**
 * This file is the main map script. The contents of this script gets executed sequentially
 * when it is imported.
 */

//Step 1: Add the OSM base map and the map object to the WebGIS
//Put here the OSM layer. 

console.log("map.js loaded");
/*
let osm = new ol.layer.Tile({
    visible: true,
    source: new ol.source.OSM()
});
*/
//base map part
let osm = new ol.layer.Tile({
    title: "OpenStreetMap",
    source: new ol.source.OSM(),
    visible: true
});


let positron = new ol.layer.Tile({
    title: "CartoDB Positron",
    source: new ol.source.XYZ({
        url: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
    }),
    visible: false
});

let imagery = new ol.layer.Tile({
    title: "ESRI Gray Light",
    source: new ol.source.XYZ({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
    }),
    visible: false
});


//Put here the main map object.
const initialZoom = 7;
const initialCoordinates = [14.5, 47.6];
let map = new ol.Map({
    target: document.getElementById('map'),
    layers:[osm, positron, imagery],
    view: new ol.View({
        center: ol.proj.fromLonLat(initialCoordinates), //We have to convert from EPSG:4326 to EPSG:3857 because openlayers uses it by default!
        zoom: initialZoom
    })
});


var extent = ol.proj.transformExtent(
    [8.5, 45.5, 18.5, 49.8],
    'EPSG:4326',
    'EPSG:3857'
);

map.getView().fit(extent, {
    padding: [20,20,20,20]
});

let layerState = 0;

// control part 


function setBaseMap(layer) {
    osm.setVisible(false);
    positron.setVisible(false);
    imagery.setVisible(false);

    layer.setVisible(true);
}

document.getElementById("osmBase").addEventListener("change", function() {
    if(this.checked){
        setBaseMap(osm);
    }
});

document.getElementById("positronBase").addEventListener("change", function() {
    if(this.checked){
        setBaseMap(positron);
    }
});

document.getElementById("imageryBase").addEventListener("change", function() {
    if(this.checked){
        setBaseMap(imagery);
    }
});











// DECEMBER MAPS FROM DATA
var no2December = createWMSLayer("gisgeoserver_09:Austria_CAMS_no2_2023_12");
var pm10December = createWMSLayer("gisgeoserver_09:Austria_CAMS_pm10_2023_12");
var pm25December = createWMSLayer("gisgeoserver_09:Austria_CAMS_pm2p5_2023_12");

// AVERAGE MAPS FROM DATA
var no2Average = createWMSLayer("gisgeoserver_09:Austria_average_no2_2023");
var pm10Average = createWMSLayer("gisgeoserver_09:Austria_average_pm10_2023");
var pm25Average = createWMSLayer("gisgeoserver_09:Austria_average_pm2p5_2023");

// CONCENTRATION MAPS FROM DATA
var no2Concentration = createWMSLayer("gisgeoserver_09:Austria_no2_concentration_map_2023");
var pm10Concentration = createWMSLayer("gisgeoserver_09:Austria_pm10_concentration_map_2023");
var pm25Concentration = createWMSLayer("gisgeoserver_09:Austria_pm2p5_concentration_map_2023");


//  AMAC MAPS FROM DATA

var no2Amac = createWMSLayer("gisgeoserver_09:Austria_no2_2021_2023_AMAC_map");
var pm10Amac = createWMSLayer("gisgeoserver_09:Austria_pm10_2021_2023_AMAC_map");
var pm25Amac = createWMSLayer("gisgeoserver_09:Austria_pm2p5_2021_2023_AMAC_map");


// LAND COVER CHANGE MAP

var lccMap = createWMSLayer("gisgeoserver_09:Austria_LCC_2021_2023");

// BIVARIATE MAPS FROM DATA

var no2Bivariate = createWMSLayer("gisgeoserver_09:Austria_no2_2023_bivariate");
var pm10Bivariate = createWMSLayer("gisgeoserver_09:Austria_pm10_2023_bivariate");
var pm25Bivariate = createWMSLayer("gisgeoserver_09:Austria_pm2p5_2023_bivariate");

function createWMSLayer(layerName) {
  var layer = new ol.layer.Image({
    source: new ol.source.ImageWMS({
      url: "https://www.gis-geoserver.polimi.it/geoserver/gisgeoserver_09/wms",
      params: { "LAYERS": layerName },
      ratio: 1,
      serverType: "geoserver"
    }),
    visible: false
  });

  layer.setZIndex(10);
  map.addLayer(layer);
  return layer;
}
function updateGeneralLegend(title, imagePath) {
    const legendTitle = document.getElementById("legendTitle");
    const legendImage = document.getElementById("legendImage");
    const legendBox = document.querySelector(".map-legend");
  
    legendBox.style.display = "block";
    legendTitle.innerHTML = title;
    legendImage.src = imagePath;
  }

  function showLegend(title, imagePath) {
    const legendBox = document.querySelector(".map-legend");
    const legendTitle = document.getElementById("legendTitle");
    const legendImage = document.getElementById("legendImage");

    legendBox.style.display = "block";
    legendBox.style.visibility = "visible";
    legendBox.style.zIndex = "9999";

    legendTitle.innerHTML = title;
    legendImage.src = imagePath;
}

  
// DECEMBER MAPS FOR LEGAND

  document.getElementById("no2DecemberCheck").addEventListener("change", function () {
    if (this.checked) {
      no2December.setVisible(true);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      pm25Average.setVisible(false);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Concentration.setVisible(false);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Amac.setVisible(false);
      lccMap.setVisible(false);
      pm10Bivariate.setVisible(false);
      no2Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
  
  
      document.getElementById("pm10DecemberCheck").checked = false;
      document.getElementById("pm25DecemberCheck").checked = false;
  
      showLegend("NO₂", "images/Austria_NO2_December_2023_legend.png");
    } else {
      no2December.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });
  
  document.getElementById("pm10DecemberCheck").addEventListener("change", function () {
    if (this.checked) {
      pm10December.setVisible(true);
      no2December.setVisible(false);
      pm25December.setVisible(false);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      pm25Average.setVisible(false);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Concentration.setVisible(false);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Amac.setVisible(false);
      lccMap.setVisible(false);
      pm10Bivariate.setVisible(false);
      no2Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
  
  
      document.getElementById("no2DecemberCheck").checked = false;
      document.getElementById("pm25DecemberCheck").checked = false;
  
      showLegend("PM₁₀", "images/Austria_PM10_December_2023_legend.png");
    } else {
      pm10December.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });
  
  document.getElementById("pm25DecemberCheck").addEventListener("change", function () {
    if (this.checked) {
      pm25December.setVisible(true);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      pm25Average.setVisible(false);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Concentration.setVisible(false);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Amac.setVisible(false);
      lccMap.setVisible(false);
      pm10Bivariate.setVisible(false);
      no2Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
     
  
  
      document.getElementById("no2DecemberCheck").checked = false;
      document.getElementById("pm10DecemberCheck").checked = false;
  
      showLegend("PM₂.₅", "images/Austria_PM25_December_2023_legend.png");
    } else {
      pm25December.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });

// AVERAGE MAPS FOR LEGAND

  document.getElementById("no2AverageCheck").addEventListener("change", function () {
    if (this.checked) {
      no2Average.setVisible(true);
      pm10Average.setVisible(false);
      pm25Average.setVisible(false);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Concentration.setVisible(false);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Amac.setVisible(false);
      no2Bivariate.setVisible(false);
      pm10Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
      lccMap.setVisible(false);
  
      document.getElementById("pm10AverageCheck").checked = false;
      document.getElementById("pm25AverageCheck").checked = false;
  
      showLegend("NO₂", "images/Austria_Average_NO2_2023_legend.png");
    } else {
      no2Average.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });
  
  document.getElementById("pm10AverageCheck").addEventListener("change", function () {
    if (this.checked) {
      pm10Average.setVisible(true);
      no2Average.setVisible(false);
      pm25Average.setVisible(false);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Concentration.setVisible(false);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Amac.setVisible(false);
      no2Bivariate.setVisible(false);
      pm10Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
      lccMap.setVisible(false);
  
  
      document.getElementById("no2AverageCheck").checked = false;
      document.getElementById("pm25AverageCheck").checked = false;
  
      showLegend("PM₁₀", "images/Austria_Average_PM10_2023_legend.png");
    } else {
      pm10Average.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });
  
  document.getElementById("pm25AverageCheck").addEventListener("change", function () {
    if (this.checked) {
      pm25Average.setVisible(true);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Concentration.setVisible(false);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Amac.setVisible(false);
      no2Bivariate.setVisible(false);
      pm10Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
      lccMap.setVisible(false);
  
  
      document.getElementById("no2AverageCheck").checked = false;
      document.getElementById("pm10AverageCheck").checked = false;
  
      showLegend("PM₂.₅", "images/Austria_Average_PM25_2023_legend.png");
    } else {
      pm25Average.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });

  // CONCENTRATION MAPS FOR LEGEND

  document.getElementById("no2ConcentrationCheck").addEventListener("change", function () {
    if (this.checked) {
      no2Concentration.setVisible(true);
      pm10Concentration.setVisible(false);
      pm25Concentration.setVisible(false);
      pm25Average.setVisible(false);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Amac.setVisible(false);
      no2Bivariate.setVisible(false);
      pm10Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
      lccMap.setVisible(false);
  
  
      document.getElementById("pm10ConcentrationCheck").checked = false;
      document.getElementById("pm25ConcentrationCheck").checked = false;
  
      showLegend("NO₂", "images/Austria_NO2_Concentration_Map_legend.png");
    } else {
      no2Concentration.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });
  
  document.getElementById("pm10ConcentrationCheck").addEventListener("change", function () {
    if (this.checked) {
      pm10Concentration.setVisible(true);
      no2Concentration.setVisible(false);
      pm25Concentration.setVisible(false);
      pm25Average.setVisible(false);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Amac.setVisible(false);
      no2Bivariate.setVisible(false);
      pm10Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
      lccMap.setVisible(false);
  
  
      document.getElementById("no2ConcentrationCheck").checked = false;
      document.getElementById("pm25ConcentrationCheck").checked = false;
  
      showLegend("PM₁₀", "images/Austria_PM10_Concentration_Map_legend.png");
    } else {
      pm10Concentration.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });
  
  document.getElementById("pm25ConcentrationCheck").addEventListener("change", function () {
    if (this.checked) {
      pm25Concentration.setVisible(true);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Average.setVisible(false);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Amac.setVisible(false);
      no2Bivariate.setVisible(false);
      pm10Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
      lccMap.setVisible(false);
  
  
      document.getElementById("no2ConcentrationCheck").checked = false;
      document.getElementById("pm10ConcentrationCheck").checked = false;
  
      showLegend("PM₂.₅", "images/Austria_PM25_Concentration_Map_legend.png");
    } else {
      pm25Concentration.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });





// AMAC MAPS FOR LEGEND

  document.getElementById("no2AmacCheck").addEventListener("change", function () {
    if (this.checked) {
      no2Amac.setVisible(true);
      pm10Amac.setVisible(false);
      pm25Amac.setVisible(false);
      pm25Concentration.setVisible(false);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Average.setVisible(false);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      no2Bivariate.setVisible(false);
      pm10Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
      lccMap.setVisible(false);
  
      document.getElementById("pm10AmacCheck").checked = false;
      document.getElementById("pm25AmacCheck").checked = false;
  
      showLegend("NO₂ AMAC", "images/no2_amac_map_legend.png");
    } else {
      no2Amac.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });
  
  document.getElementById("pm10AmacCheck").addEventListener("change", function () {
    if (this.checked) {
      pm10Amac.setVisible(true);
      no2Amac.setVisible(false);
      pm25Amac.setVisible(false);
      pm25Concentration.setVisible(false);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Average.setVisible(false);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      no2Bivariate.setVisible(false);
      pm10Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
      lccMap.setVisible(false);
  
      document.getElementById("no2AmacCheck").checked = false;
      document.getElementById("pm25AmacCheck").checked = false;
  
      showLegend("PM₁₀ AMAC", "images/pm10_amac_map_legend.png");
    } else {
      pm10Amac.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });
  
  document.getElementById("pm25AmacCheck").addEventListener("change", function () {
    if (this.checked) {
      pm25Amac.setVisible(true);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Concentration.setVisible(false);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Average.setVisible(false);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      no2Bivariate.setVisible(false);
      pm10Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
      lccMap.setVisible(false);
  
      document.getElementById("no2AmacCheck").checked = false;
      document.getElementById("pm10AmacCheck").checked = false;
  
      showLegend("PM₂.₅ AMAC", "images/pm25_amac_map_legend.png");
    } else {
      pm25Amac.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });

  // LCC FOR LEGEND

  document.getElementById("lccCheck").addEventListener("change", function () {

    if (this.checked) {
  
      lccMap.setVisible(true);
      pm25Amac.setVisible(false);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Concentration.setVisible(false);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Average.setVisible(false);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      no2Bivariate.setVisible(false);
      pm10Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
      
  
      document.querySelector(".map-legend").style.display = "block";
  
      document.getElementById("legendTitle").innerHTML =
        "Land Cover Change";
  
      document.getElementById("legendImage").src =
        "images/legand_1.png";
  
    } else {
  
      lccMap.setVisible(false);
      hideLegendIfNoLayerSelected();
      
  
    }
  });


// BIVARIATE MAPS FOR LEGEND


  document.getElementById("no2BivariateCheck").addEventListener("change", function () {
    if (this.checked) {
      no2Bivariate.setVisible(true);
      pm10Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
      pm25Amac.setVisible(false);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Concentration.setVisible(false);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Average.setVisible(false);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      lccMap.setVisible(false);
  
      document.getElementById("pm10BivariateCheck").checked = false;
      document.getElementById("pm25BivariateCheck").checked = false;
  
      showLegend("NO₂", "images/no2_zonal_statistic_legend.png");
    } else {
      no2Bivariate.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });
  
  document.getElementById("pm10BivariateCheck").addEventListener("change", function () {
    if (this.checked) {
      pm10Bivariate.setVisible(true);
      no2Bivariate.setVisible(false);
      pm25Bivariate.setVisible(false);
      pm25Amac.setVisible(false);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Concentration.setVisible(false);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Average.setVisible(false);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      lccMap.setVisible(false);
  
      document.getElementById("no2BivariateCheck").checked = false;
      document.getElementById("pm25BivariateCheck").checked = false;
  
      showLegend("PM₁₀", "images/pm10_zonal_statistic_legend.png");
    } else {
      pm10Bivariate.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });
  
  document.getElementById("pm25BivariateCheck").addEventListener("change", function () {
    if (this.checked) {
      pm25Bivariate.setVisible(true);
      no2Bivariate.setVisible(false);
      pm10Bivariate.setVisible(false);
      pm25Amac.setVisible(false);
      no2Amac.setVisible(false);
      pm10Amac.setVisible(false);
      pm25Concentration.setVisible(false);
      no2Concentration.setVisible(false);
      pm10Concentration.setVisible(false);
      pm25Average.setVisible(false);
      no2Average.setVisible(false);
      pm10Average.setVisible(false);
      no2December.setVisible(false);
      pm10December.setVisible(false);
      pm25December.setVisible(false);
      lccMap.setVisible(false);
  
      document.getElementById("no2BivariateCheck").checked = false;
      document.getElementById("pm10BivariateCheck").checked = false;
  
      showLegend("PM₂.₅", "images/pm25_zonal_statistic_legend.png");
    } else {
      pm25Bivariate.setVisible(false);
      hideLegendIfNoLayerSelected();
    }
  });


 //default 

  function hideLegendIfNoLayerSelected() {

    const anyLayerVisible =
      no2December.getVisible() ||
      pm10December.getVisible() ||
      pm25December.getVisible() ||
  
      no2Average.getVisible() ||
      pm10Average.getVisible() ||
      pm25Average.getVisible() ||
  
      no2Concentration.getVisible() ||
      pm10Concentration.getVisible() ||
      pm25Concentration.getVisible() ||
  
      no2Amac.getVisible() ||
      pm10Amac.getVisible() ||
      pm25Amac.getVisible() ||
  
      no2Bivariate.getVisible() ||
      pm10Bivariate.getVisible() ||
      pm25Bivariate.getVisible() ||
  
      lccMap.getVisible();
  
    document.querySelector(".map-legend").style.display =
      anyLayerVisible ? "block" : "none";
  }












































