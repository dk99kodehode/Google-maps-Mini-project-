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

// Lagrer alle kartmarkører og navnene deres.
// Brukes av søkefunksjonen for å finne riktige steder når brukeren søker.
let allMarkers = [];

let userLat;
let userLon;

let category = "commercial.supermarket";

/*--------ELEMENTER FRA HTML---------*/
const searchBar = document.getElementById("search");
const closeBtn = document.getElementById("close-btn");
const sideBar = document.getElementById("sidebar");

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

/*-----HENTER STEDER FRA GEOAPIFY-----*/
async function loadPlace(lat, lon, category) {
    markerLayer.clearLayers();
    allMarkers = [];
    // inni keyen er det en justerbar max limit på steder som blir markert,
    //  den er satt til 20 som standard, men kan forandres om ønskelig.
    const placeAPI = `https://api.geoapify.com/v2/places?categories=${category}&bias=proximity:${lon},${lat}&limit=20&apiKey=${apiKey}`;

    console.log("Category:", category);

    const response = await fetch(placeAPI);

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    markerToMap(data);
}

/*
Denne funksjonen:
- tar stedene fra Geoapify
- lager Leaflet-markører
- lagrer dem i allMarkers slik at søk kan brukes
*/
function markerToMap(data) {
    data.features.forEach((feature) => {
        const {
            name = "Unknown place",
            address_line2: address = "No address",
            opening_hours: hours = "No opening hours",
        } = feature.properties;

        const contact = feature.properties.contact?.phone ?? "No phone number";

        const [lon, lat] = feature.geometry.coordinates;

        const marker = L.marker([lat, lon]).addTo(markerLayer);

        // lagrer markøren for søk
        allMarkers.push({
            marker: marker,
            name: name.toLowerCase(),
        });

        const stedsNavn = document.getElementById("steds-navn");
        const stedsAdresse = document.getElementById("steds-adresse");
        const kontakt = document.getElementById("kontakt");
        const åpningstid = document.getElementById("åpningstid");

        marker.on("click", (e) => {
            map.setView(e.target.getLatLng(), 15);

            stedsNavn.textContent = name;
            stedsAdresse.textContent = `📍${address}`;
            åpningstid.textContent = `🕒${hours}`;
            kontakt.textContent = `☎️${contact}`;

            sideBar.classList.remove("sidebar-hidden");

            const sideBarSearch = document.querySelector(".search-side");

            sideBarSearch.value = name;
        });
    });
}

// Finner brukerens posisjon
navigator.geolocation.getCurrentPosition(
    (position) => {
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;

        map.setView([userLat, userLon], 14);

        loadPlace(userLat, userLon, category);
    },

    () => {
        map.setView([0, 0], 2);
    },
);

// Lukker sidebar
closeBtn.addEventListener("click", () => {
    sideBar.classList.add("sidebar-hidden");
});

// Lukker sidebar når man trykker på kartet
map.addEventListener("click", () => {
    sideBar.classList.add("sidebar-hidden");
});

// SEARCHBAR is here!
searchBar.addEventListener("input", () => {
    const search = searchBar.value.toLowerCase().trim();

    markerLayer.clearLayers();

    allMarkers.forEach((item) => {
        if (search === "" || item.name.includes(search)) {
            markerLayer.addLayer(item.marker);
        }
    });
});
