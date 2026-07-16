import { apiKey } from "./env.js";

const placeAPI = `https://api.geoapify.com/v2/places?categories=commercial.supermarket&bias=proximity:10.7389701,59.9133301&limit=20&apiKey=${apiKey}`;

/// map api i se sjølv
const map = L.map("map").setView([59.9133301, 10.7389701], 12);
L.tileLayer(
  `https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=${apiKey}`,
  {
    attribution:
      'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
    maxZoom: 20,
    id: "osm-bright",
  },
).addTo(map);

async function loadPlace() {
  try {
    const response = await fetch(placeAPI);
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    const data = await response.json();
    markerToMap(data);

    console.log(data);
  } catch (error) {
    console.error("Failed to fetch", error);
  }
}

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

loadPlace();
