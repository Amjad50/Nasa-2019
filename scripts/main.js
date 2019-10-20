const START_LOC = [40.2287, -96.9807];
const START_ZOOM = 15;

(function main() {
  let mymap = L.map("mapid").setView(START_LOC, START_ZOOM);

  putPoints(mymap);
  addLegend(mymap);

  let tileLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19
    }
  );

  tileLayer.addTo(mymap);
})();

function addLegend(map) {
  var legend = L.control({ position: "bottomleft" });
  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    labels = ["<strong>Categories</strong>"];

    const data = [
      { colour: "#009966", string: "Very Clean (90 - 100)" },
      { colour: "#5e9900", string: "Clean (75 - 90)" },
      { colour: "#ffde33", string: "Moderate (45 - 75)" },
      { colour: "#cc0033", string: "Polluted (20 - 45)" },
      { colour: "#660099", string: "Very Polluted (0 - 20)" }
    ];

    for (var i = 0; i < data.length; i++) {
      div.innerHTML += labels.push(
        '<i class="circle" style="background:' +
          data[i].colour +
          '"></i> ' +
          data[i].string
      );
    }
    div.innerHTML = labels.join("<br>");
    return div;
  };
  legend.addTo(map);
}
