const START_LOC = [3.119993,101.6543625];
const START_ZOOM = 17;

(function main() {
  let mymap = L.map("mapid").setView(START_LOC, START_ZOOM);
  let mymap = L.marker([3.119993,101.6543625]).addTo(mymap);;

  let tileLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19
    }
  );

  tileLayer.addTo(mymap);
})();
//Radwan Wlad Elhaj
// Github @radwanbj