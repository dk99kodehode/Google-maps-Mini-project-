// Hvordan vi fikk serveren til å ikke vise api keyen direkte til repoen

For å være sikker på at apiKeyen skal bli skjult MÅ du ha en BACKUP SERVER som er skjult, som Node/Vite eller noe for a hide den i en .env file som du da gitignorer.
Men det er ikke allt du trenger FORDI.. mappen vill jo ikke loadet uten keyen selv om du har importert den fra VITE til en js module.
Så du må ha en deploy.yml file som git hub sjekker etter secrets og bruker da keyen fra github secrets for å unngå å ha apiKeyen visen på github repo.
Problemet forsatt er KEYEN er visenes i devtools , for å unngå dette må vi hatt en

// Leaflet Good to knows
L.marker og alle de andre funskjonenen med L. er Leaflet funksjoner fra Leaflet library
(L.map, L.tileLayer, L.marker, L.popup)
