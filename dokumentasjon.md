# ✍Dokumentasjon✍

## Hvordan vi fikk Prosjektet vårt til å ikke vise api keyen direkte til repoen

For å være sikker på at `apiKeyen` skal bli "skjult" må du ha en **Backend server** men dette er problematisk for github repo, så det vi kan gjøre er å lage en `.env` i ".gitignore" og importert nøkkelen fra vite modules slik at keyen ikke vises direkte men som et variabel.

Men det er ikke alt du trenger siden `apien` vill ikke loade uten keyen på `github pages` selv om du har importert `vite settings` til en `JS module`. Så for "workarounde" det problemet bruker vi `deploy.yml`-workflow i Github actions som henter nøkkelen fra Github Secrets.

**_Problemet enda er at keyen er fortsatt tilgjenglig gjennom devtools network_**

---

## 🌿Leaflet Good to knows

L.marker og alle de andre funskjonenen med L. er Leaflet funksjoner fra Leaflet library
(L.map, L.tileLayer, L.marker, L.popup)
