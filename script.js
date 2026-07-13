import { apiKey } from "./env.js";

const placeAPI = `https://api.geoapify.com/v2/places?categories=commercial.supermarket&bias=proximity:10.7389701,59.9133301&limit=20&apiKey=${apiKey}`;

/*-------------------------------LAT --------LON------ ZOOM LEVEL ---*/
const map = L.map("map").setView([48.1500327, 11.5753989], 10);

L.tileLayer(
  `https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=${apiKey}`,
  {
    attribution:
      'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
    maxZoom: 20,
    id: "osm-bright",
  },
).addTo(map);
