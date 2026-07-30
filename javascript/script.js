import { apiKey } from "./env.js";

const map = L.map("map").setView([0, 0], 2);
const markerLayer = L.layerGroup().addTo(map);

L.tileLayer(
  `https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=${apiKey}`,
  {
    attribution:
      'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
    maxZoom: 20,
    id: "osm-bright",
  },
).addTo(map);

let userLat;
let userLon;

let category = "commercial.supermarket";

/*--------ELEMENTER FRA HTML---------*/
const searchBar = document.getElementById("search");
const closeBtn = document.getElementById("close-btn");
const sideBar = document.getElementById("sidebar");
const sideBarContent = document.getElementById("sidebar-content");

/*-----categories-----*/
const categories = {
  "rest-btn": "catering.restaurant",
  "store-btn": "commercial.supermarket",
  "park-btn": "entertainment.theme_park",
  "hotel-btn": "accommodation.hotel",
  "transport-btn": "public_transport",
  "apotek-btn": "healthcare.pharmacy",
  "minibank-btn": "service.financial",
};

Object.entries(categories).forEach(([id, category]) => {
  document.getElementById(id).addEventListener("click", () => {
    loadPlace(userLat, userLon, category);
  });
});

/*-----LOADER KUN "SUPERMARKETS" I URL-----*/
async function loadPlace(lat, lon, category) {
  markerLayer.clearLayers();
  const placeAPI = `https://api.geoapify.com/v2/places?categories=${category}&bias=proximity:${lon},${lat}&limit=20&apiKey=${apiKey}`;

  const response = await fetch(placeAPI);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  markerToMap(data);
}

// spør om tillatelse for å bruke lokasjonen din og finner "butikker" i nærheten. "Sjå Loadplace API" for confirmation på at det er commercial supermarket
navigator.geolocation.getCurrentPosition(
  (position) => {
    userLat = position.coords.latitude;
    userLon = position.coords.longitude;

    map.setView([userLat, userLon], 14);

    loadPlace(userLat, userLon, category);
  },
  // visst den blir "kansellert" default map setview value 0 lat , 0 lon
  (error) => {
    map.setView([0, 0], 2);
  },
);

// Marker som tar lon,lat,names & adress //
function markerToMap(data) {
  data.features.forEach((feature) => {
    // alle attributes eg vill ha for sidebar contentet"
    const {
      name: name,
      address_line2: address,
      opening_hours: hours,
    } = feature.properties;

    const contact = feature.properties.contact.phone;
    const [lon, lat] = feature.geometry.coordinates;
    const marker = L.marker([lat, lon]).addTo(markerLayer);

    /*-----tilfelle du vill ha popup OVER marker som viser adress + name---*/
    /*marker.bindPopup(name + "<br />" + address);*/
    const stedsNavn = document.getElementById("steds-navn");
    const stedsAdresse = document.getElementById("steds-adresse");
    const kontakt = document.getElementById("kontakt");
    const åpningstid = document.getElementById("åpningstid");

    marker.on("click", (e) => {
      map.setView(e.target.getLatLng(), 15);
      stedsNavn.textContent = `${name}`;
      stedsAdresse.textContent = `📍${address}`;
      åpningstid.textContent = `🕒${hours}`;
      kontakt.textContent = `☎️${contact}`;

      sideBar.classList.remove("sidebar-hidden");
      const sideBarSearch = document.querySelector(".search-side");
      sideBarSearch.value = `${name}`;

      closeBtn.addEventListener("click", () => {
        sideBar.classList.add("sidebar-hidden");
      });
    });
  });
}

map.addEventListener("click", () => {
  sideBar.classList.add("sidebar-hidden");
});

///

loadPlace(userLat, userLon, category);
