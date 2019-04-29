// https://cesium.com/blog/2016/01/26/cesium-and-webpack/
window.CESIUM_BASE_URL = './';
var Cesium = require('cesium/Cesium');
var GoldenLayout = require('golden-layout');

require('cesium/Widgets/widgets.css');
require('cesium/Widgets/lighter.css');
require('bootstrap-honoka/dist/js/bootstrap.bundle');
require('bootstrap-honoka/dist/css/bootstrap.min.css');
require('golden-layout/src/css/goldenlayout-base.css');
// require('golden-layout/src/css/goldenlayout-light-theme.css');
require('golden-layout/src/css/goldenlayout-dark-theme.css');
// require('golden-layout/src/css/goldenlayout-soda-theme.css');
// require('golden-layout/src/css/goldenlayout-translucent-theme.css');
require('./css/main.css');

var config = {
  content: [{
    type: 'row',
    content: [{
      type: 'component',
      componentName: 'componentA',
      width: 20,
      componentState: {
        label: 'A'
      }
    }, {
      type: 'column',
      content: [{
        type: 'component',
        componentName: 'componentB',
        componentState: {
          label: 'B'
        }
      }, {
        type: 'component',
        componentName: 'componentC',
        height: 20,
        componentState: {
          label: 'C'
        }
      }]
    }]
  }]
};
var myLayout = new GoldenLayout(config);
myLayout.registerComponent('componentA', function (container, componentState) {
  container.getElement().html('<h2>' + componentState.label + '</h2>');
});
myLayout.registerComponent('componentB', function (container, componentState) {
  container.getElement().html('<div id="cesiumContainer"></div>');
});
myLayout.registerComponent('componentC', function (container, componentState) {
  container.getElement().html('<h2>' + componentState.label + '</h2>');
});
myLayout.init();

$(document).ready(function () {
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
});