const START_LOC = [40.2287, -96.9807];
const START_ZOOM = 15;

(function main() {
  let mymap = L.map("mapid").setView(START_LOC, START_ZOOM);
  
  putPoints(mymap);

  let tileLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19
    }
  );

  tileLayer.addTo(mymap);
})();