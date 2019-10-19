function generateRandomParams() {
  return [
    /*DO*/ Math.random() * (10 - 1) + 1,
    /*BOD*/ Math.random() * (15 - 1) + 1,
    /*COD*/ Math.random() * (105 - 5) + 5,
    /*AN*/ Math.random() * (3 - 0.1) + 0.1,
    /*SS*/ Math.random() * (310 - 20) + 20,
    /*pH*/ Math.random() * (9 - 4) + 4
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

/**
 * get and format the data from data.js
 *
 *
 * @param {Leaflet map} map
 */
function putPoints(map) {
  data.points.forEach(point => {
    let data = generateRandomParams();

    let params = computeWQIParams(data);
    let WQI = computeWQI(params);

    let pString = "";
    pString += `WQI = ${WQI}\n`;

    L.marker(point[1], {
      /* icon: default*/
    })
      .bindPopup(pString)
      .addTo(map);
  });
}
