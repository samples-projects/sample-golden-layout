// https://cesium.com/blog/2016/01/26/cesium-and-webpack/
window.CESIUM_BASE_URL = './';
var Cesium = require('cesium/Cesium');
require('cesium/Widgets/widgets.css');
require('cesium/Widgets/lighter.css');
require('./css/main.css');
require('bootstrap-honoka/dist/js/bootstrap.bundle');
require('bootstrap-honoka/dist/css/bootstrap.min.css');

// オブジェクト生成
var clockViewModel = new Cesium.ClockViewModel();
var viewer = new Cesium.Viewer('cesiumContainer', {
  animation: true,
  baseLayerPicker: true,
  clockViewModel: clockViewModel,
  fullscreenButton: true,
  // geocoder: new CustomGeocoder(),
  homeButton: true,
  infoBox: true,
  navigationHelpButton: true,
  navigationInstructionsInitiallyVisible: false,
  sceneModePicker: true,
  selectionIndicator: true,
  timeline: true,
  vrButton: true
});

// シナリオ読込
viewer.dataSources.add(Cesium.CzmlDataSource.load('http://localhost:3000/czml'));