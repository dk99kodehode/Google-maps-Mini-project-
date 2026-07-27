import { apiKey } from "./env.js";

const searchBar = document.getElementById("search");

async function loadPlace(lat, lon) {
  const placeAPI = `https://api.geoapify.com/v2/places?categories=commercial.supermarket&bias=proximity:${lon},${lat}&limit=20&apiKey=${apiKey}`;

  const response = await fetch(placeAPI);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  markerToMap(data);
}

// spør om tillatelse for å bruke lokasjonen din
navigator.geolocation.getCurrentPosition(
  (position) => {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;

    map.setView([userLat, userLon], 14);

    loadPlace(userLat, userLon);
  },
  // visst den blir "kansellert" default map setview value 0 lat , 0 lon
  (error) => {
    map.setView([0, 0], 2);
  },
);

const map = L.map("map").setView([0, 0], 2);
L.tileLayer(
  `https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=${apiKey}`,
  {
    attribution:
      'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
    maxZoom: 20,
    id: "osm-bright",
  },
).addTo(map);

// Marker som tar lon,lat,names & adress //
function markerToMap(data) {
  data.features.forEach((feature) => {
    const name = feature.properties.name || "Unrecognized place";

    const [lon, lat] = feature.geometry.coordinates;

    const address = feature.properties.address_line2;

    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(name + "<br />" + address); // Liten popup som viser hvor du er
  });
}

///

loadPlace(userLat, userLon);
