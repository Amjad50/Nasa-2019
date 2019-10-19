

(function main() {
    let mymap = L.map('mapid').setView([51.505, -0.09], 13);

    let tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    });

    tileLayer.addTo(mymap);
})();