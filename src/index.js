// https://cesium.com/blog/2016/01/26/cesium-and-webpack/
window.CESIUM_BASE_URL = './';
var Cesium = require('cesium/Cesium');
var GoldenLayout = require('golden-layout');
var Chart = require('chart.js');

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
  container.getElement().html(`
    <div class="custom-control custom-checkbox">
      <input type="checkbox" class="custom-control-input" id="agiIsVisible" checked>
      <label class="custom-control-label" for="agiIsVisible">AGI</label>
    </div>
    <div class="custom-control custom-checkbox">
      <input type="checkbox" class="custom-control-input" id="issIsVisible" checked>
      <label class="custom-control-label" for="issIsVisible">ISS</label>
    </div>
    <div class="custom-control custom-checkbox">
      <input type="checkbox" class="custom-control-input" id="satelliteIsVisible" checked>
      <label class="custom-control-label" for="satelliteIsVisible">Satellite</label>
    </div>
    `);
});
myLayout.registerComponent('componentB', function (container, componentState) {
  container.getElement().html('<div id="cesiumContainer"></div>');
});
myLayout.registerComponent('componentC', function (container, componentState) {
  container.getElement().html('<canvas id="myChart" width="400" height="400"></canvas>');
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
  let dataSources = new Cesium.CzmlDataSource();
  dataSources.load('http://localhost:3000/czml');
  viewer.dataSources.add(dataSources);

  // custom button
  var element = document.createElement('button');
  element.type = 'button';
  element.className = 'cesium-button cesium-toolbar-button cesium-sample-button';
  element.setAttribute('data-toggle', 'modal');
  element.setAttribute('data-target', '#exampleModal');
  document.getElementsByClassName('cesium-viewer-toolbar')[0].appendChild(element);

  // true/false
  let agiIsVisible = document.getElementById("agiIsVisible");
  agiIsVisible.onchange = () => {
    ['Facility/AGI']
    .map(id => {
      let entity = dataSources.entities.getById(id);
      entity.show = agiIsVisible.checked;
      console.info(`${id} change to show:${entity.show}.`);
    });
  };

  let issIsVisible = document.getElementById("issIsVisible");
  issIsVisible.onchange = () => {
    ['Satellite/ISS']
    .map(id => {
      let entity = dataSources.entities.getById(id);
      entity.show = issIsVisible.checked;
      console.info(`${id} change to show:${entity.show}.`);
    });
  };

  let satelliteIsVisible = document.getElementById("satelliteIsVisible");
  satelliteIsVisible.onchange = () => {
    ['Satellite/ISS', 'Satellite/Geoeye1']
    .map(id => {
      let entity = dataSources.entities.getById(id);
      entity.show = satelliteIsVisible.checked;
      console.info(`${id} change to show:${entity.show}.`);
    });
  };

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var config = {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [
          1, 2, 5, 1, 3, 4, 6, 7, 4, 4
        ],
        fill: false,
      }, {
        label: 'My Second dataset',
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgb(54, 162, 235)',
        data: [
          1, 2, 5, 1, 3, 4, 6, 7, 4, 4
        ],
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Value'
          }
        }]
      }
    }
  };
  var myLineChart = new Chart('myChart', config);
});