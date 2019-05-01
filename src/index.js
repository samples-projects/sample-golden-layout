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

let config = {
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


// FIXME: ウィンドウポップアップが残る事象の暫定処置
localStorage.removeItem('savedState');

let savedState = localStorage.getItem('savedState');
if (savedState !== null) {
  config = JSON.parse(savedState);
}

console.dir(config);
let myLayout = new GoldenLayout(config);

myLayout.on('stateChanged', function () {
  let state = JSON.stringify(myLayout.toConfig());
  localStorage.setItem('savedState', state);
});

myLayout.registerComponent('componentA', function (container, state) {
  container.getElement().html(`
    <form name="myForm">
      <div class="form-group">
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
      </div>
      <div class="form-group">
        <input type="text" id="tick" value=""/>
      </div>
    </form>
    `);

  $(document).ready(function () {
    let checkbox = {
      agi: document.getElementById("agiIsVisible"),
      iss: document.getElementById("issIsVisible"),
      sat: document.getElementById("satelliteIsVisible")
    };

    myLayout.eventHub.on('tick', currentTime => {
      document.getElementById("tick").value = currentTime.toString();
    });

    for (let key in checkbox) {
      if (state[key] != null) {
        checkbox[key].checked = state[key].isVisible;
        myLayout.eventHub.emit(key, checkbox[key].checked);
        console.info(`${key} change to show:${checkbox[key].checked}.`);
      }

      checkbox[key].onchange = () => {
        let state = {};
        state[key] = {
          isVisible: checkbox[key].checked
        };
        container.extendState(state);
        myLayout.eventHub.emit(key, checkbox[key].checked);
        console.info(`${key} change to show:${checkbox[key].checked}.`);
      };
    }
  });
});
myLayout.registerComponent('componentB', function (container, componentState) {
  container.getElement().html('<div id="cesiumContainer"></div>');

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

    viewer.clockViewModel.clock.onTick.addEventListener(function () {
      myLayout.eventHub.emit('tick', viewer.clockViewModel.currentTime);
    });

    // setInterval(() => {
    //   console.log(viewer.clockViewModel.currentTime.toString());
    // }, 1000);

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

    let ids = {
      agi: ['Facility/AGI'],
      iss: ['Satellite/ISS'],
      sat: ['Satellite/ISS', 'Satellite/Geoeye1']
    };

    for (let key in ids) {
      myLayout.eventHub.on(key, isVisible => {
        ids[key].map(id => {
          let entity = dataSources.entities.getById(id);
          entity.show = isVisible;
          console.info(`${id} change to show:${entity.show}.`);
        });
      });
    }
  });
});

myLayout.registerComponent('componentC', function (container, componentState) {
  container.getElement().html('<canvas id="myChart" width="400" height="400"></canvas>');

  $(document).ready(function () {
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
});

myLayout.init();