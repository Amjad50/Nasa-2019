function generateRandomParams() {
  return [
    /*DO*/ Math.random() * (92 - 80) + 80,
    /*BOD*/ Math.random() * (15 - 1) + 1,
    /*COD*/ Math.random() * (105 - 5) + 5,
    /*AN*/ Math.random() * (4 - 0.4) + 0.4,
    /*SS*/ Math.random() * (110 - 20) + 20,
    /*pH*/ Math.random() * (9 - 7) + 7,
  ];
}

/**
 * compute the Params for WQI SIDO, SIBOD, SICOD, SIAN, SISS, SIpH from 6 parameters
 * @param {Array<int>} data
 */
function computeWQIParams(data) {
  // TODO: remove this tester kid.
  let DO = data[0];
  let BOD = data[1];
  let COD = data[2];
  let AN = data[3];
  let SS = data[4];
  let pH = data[5];

  let SIDO, SIBOD, SICOD, SIAN, SISS, SIpH;

  // DO
  if (DO <= 8) SIDO = 0;
  else if (DO >= 92) SIDO = 100;
  else SIDO = -0.395 + 0.03 * Math.pow(DO, 2) - 0.0002 * Math.pow(DO, 3);

  // BOD
  if (BOD <= 5) SIBOD = 100.4 - 4.23 * BOD;
  else SIBOD = 108 * Math.exp(-0.055 * BOD) - 0.1 * BOD;

  // COD
  if (COD <= 20) SICOD = 99.1 - 1.33 * COD;
  else SICOD = 103 * Math.exp(-0.0157 * COD) - 0.04 * COD;

  // AN
  if (AN <= 0.3) SIAN = 100.5 - 105 * AN;
  else if (AN > 0.3 && AN < 4) SIAN = 94 * Math.exp(-0.573 * AN) - 5 * (AN - 2);
  else SIAN = 0;

  // SS
  if (SS <= 100) SISS = 97.5 * Math.exp(-0.00676 * SS) + 0.05 * SS;
  else if (SS > 100 && SS < 1000)
    SISS = 71 * Math.exp(-0.0016 * AN) - 0.015 * SS;
  else SISS = 0;

  // pH
  if (pH < 5.5) SIpH = 17.2 - 17.2 * pH + 5.02 * Math.pow(pH, 2);
  else if (pH >= 5.5 && pH < 7)
    SIpH = -242 + 95.5 * pH - 6.67 * Math.pow(pH, 2);
  else if (pH >= 7 && pH > 8.75)
    SIpH = -181 + 82.4 * pH - 6.05 * Math.pow(pH, 2);
  else SIpH = 536 - 77 * pH + 2.75 * Math.pow(pH, 2);

  SIDO *= 0.22;
  SIBOD *= 0.19;
  SICOD *= 0.16;
  SIAN *= 0.15;
  SISS *= 0.16;
  SIpH *= 0.12;

  return {
    SIDO,
    SIBOD,
    SICOD,
    SIAN,
    SISS,
    SIpH
  };
}

function computeWQI(data) {
  return (
    data.SIDO + data.SIBOD + data.SICOD + data.SIAN + data.SISS + data.SIpH
  );
}

// FIXME: did not work, either use it or remove it
function populateCanvas(chartId, data) {
  let chart = new CanvasJS.Chart(chartId, {
    animationEnabled: true,
    // title: {
    //   text: "Evening Sales in a Restaurant"
    // },
    // axisX: {
    //   valueFormatString: "DDD"
    // },
    axisY: {
      suffix: "%"
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: toggleDataSeries
    },
    data: [
      {
        type: "stackedBar",
        name: "Meals",
        showInLegend: "true",
        xValueFormatString: "DD, MMM",
        yValueFormatString: "$#,##0",
        dataPoints: [
          { x: new Date(2017, 0, 30), y: 56 },
          { x: new Date(2017, 0, 31), y: 45 },
          { x: new Date(2017, 1, 1), y: 71 },
          { x: new Date(2017, 1, 2), y: 41 },
          { x: new Date(2017, 1, 3), y: 60 },
          { x: new Date(2017, 1, 4), y: 75 },
          { x: new Date(2017, 1, 5), y: 98 }
        ]
      }
    ]
  });
  chart.render();
  console.log(chart);

  function toggleDataSeries(e) {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    chart.render();
  }
}

/**
 * Get colour and name of the danger, based on the legend
 * 
 * @param {double} WQI 
 */
function getDangerMode(WQI) {
  if (WQI > 90) return { colour: "#009966", string: "Very Clean" };
  else if (WQI > 75 && WQI <= 90) return { colour: "#5e9900", string: "Clean" };
  else if (WQI > 45 && WQI <= 75)
    return { colour: "#ffde33", string: "Moderate" };
  else if (WQI > 20 && WQI <= 45)
    return { colour: "#cc0033", string: "Polluted" };
  else return { colour: "#660099", string: "Very Polluted" };
}

/**
 * Create a custom Icon based on the WQI, and colour
 * 
 * @param {string_colour} colour 
 * @param {double} WQI 
 */
function getIcon(colour, WQI) {
  const markerHtmlStyles = `
  background-color: ${colour};`;

  return L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}" class="pin"></span><span class="defaultspan" style="color:${WQI > 45 && WQI <= 75 ? "black": "white"}">${WQI.toFixed()}</span>`
  });
}

/**
 * get and format the data from data.js
 *
 *
 * @param {Leaflet map} map
 */
function putPoints(map) {
  let counter = 0;
  data.points.forEach(point => {
    let chartId = "wqi" + counter++;
    let data;
    if (point.length == 2)
      data = generateRandomParams();
    else
      data = point[2];

    let params = computeWQIParams(data);
    let WQI = computeWQI(params);

    let SIDO = params.SIDO.toPrecision(3),
    SIBOD = params.SIBOD.toPrecision(3),
    SICOD = params.SICOD.toPrecision(3),
    SIAN = params.SIAN.toPrecision(3),
    SISS = params.SISS.toPrecision(3),
    SIpH = params.SIpH.toPrecision(3);

    const { colour, string } = getDangerMode(WQI);
    const icon = getIcon(colour, WQI);

    let pString = "";
    pString += `<h2>${point[0]}</h2>`;
    pString += `<h3>Water Quality Index: <span style="background-color:${colour};padding:4px;color:${WQI > 45 && WQI <= 75 ? "black": "white"}">${WQI.toPrecision(5)}<br>${string}</span></h3>`
    pString += `<table style="font-size:1.2em;">`;
    pString += `<tr><td><b>SIDO</b></td> <td>${SIDO}</td></tr>`;
    pString += `<tr><td><b>SIBOD</b></td> <td>${SIBOD}</td></tr>`;
    pString += `<tr><td><b>SICOD</b></td> <td>${SICOD}</td></tr>`;
    pString += `<tr><td><b>SIAN</b></td> <td>${SIAN}</td></tr>`;
    pString += `<tr><td><b>SISS</b></td> <td>${SISS}</td></tr>`;
    pString += `<tr><td><b>SIpH</b></td> <td>${SIpH}</td></tr>`;
    pString += `</table>`;
    pString += `<br>`
    pString += `<footer><strong>*</strong> ${getComment(WQI, params)}</footer>`

    let marker = L.marker(point[1], {
      icon: icon
    })
      .bindPopup(pString)
      .addTo(map);
    marker._params = params;
    marker._chartId = chartId;
  });

  map.on("popupopen", e => {
    let s = e.popup._source;
    // populateCanvas(s._chartId, s._params);
  });
}
