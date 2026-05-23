// Marathon Éclair MTL — app.js
// Static, mobile-first. No server. localStorage only.

// =============================================================================
// DATA
// =============================================================================
const PATISSERIES = [
  {
    order: 1,
    id: "la_bete_a_pain",
    name: "La Bête à Pain",
    address: "114 Rue Fleury O, Montréal",
    neighborhood: "Ahuntsic-Cartierville",
    rating: 4.4,
    reviewCount: 724,
    eclairFlavors: ["chocolat", "vanille", "café", "érable", "crème", "fraise", "bleuets"],
    openSat: "08:00–18:00",
    arrivalTime: "11:30",
    transitFromPrev: null,
    websiteUrl: "https://labeteapain.com",
    notes: "Départ — 6+ saveurs, arriver avant 12h.",
  },
  {
    order: 2,
    id: "de_froment_seve",
    name: "De Froment et de Sève",
    address: "2355 Rue Beaubien E, Montréal",
    neighborhood: "Rosemont",
    rating: 4.3,
    reviewCount: 33,
    eclairFlavors: ["chocolat"],
    openSat: "07:30–18:30",
    arrivalTime: "12:15",
    transitFromPrev: { mode: "transit", duration: 25, detail: "Métro Sauvé → Beaubien (ligne orange)" },
    websiteUrl: "https://chezfroment.com",
    notes: "Meilleur croissant MTL 2023. Arriver tôt — petite prod, risque rupture.",
  },
  {
    order: 3,
    id: "alex_platel_rosemont",
    name: "Pâtisserie Alex Platel",
    address: "3444 Rue Masson, Montréal",
    neighborhood: "Rosemont",
    rating: 4.8,
    reviewCount: 91,
    eclairFlavors: ["chocolat", "vanille", "café"],
    openSat: "08:00–18:00",
    arrivalTime: "12:45",
    transitFromPrev: {
      mode: "bicycling",
      duration: 8,
      detail: "BIXI · 1.5 km axe Masson",
      bixiPickup: { name: "8e av / Rosemont (Bibliothèque)", lat: 45.55157, lng: -73.58225, walkMin: 2 },
      bixiDrop:   { name: "10e av / Masson",                  lat: 45.55039, lng: -73.57376, walkMin: 1 },
    },
    websiteUrl: "https://patisseriealexplatel.ca",
    notes: "4.8/5 · chef réputé, pâtisseries raffinées.",
  },
  {
    order: 4,
    id: "mamie_clafoutis",
    name: "Mamie Clafoutis",
    address: "3660 Rue Saint-Denis, Montréal",
    neighborhood: "Plateau-Mont-Royal",
    rating: 4.6,
    reviewCount: 338,
    eclairFlavors: ["chocolat", "vanille", "café", "saisonnier"],
    openSat: "07:00–19:00",
    arrivalTime: "13:20",
    transitFromPrev: {
      mode: "bicycling",
      duration: 15,
      detail: "BIXI · 3 km St-Joseph → St-Denis",
      bixiPickup: { name: "10e av / Masson",  lat: 45.55039, lng: -73.57376, walkMin: 1 },
      bixiDrop:   { name: "Berri / Rachel",   lat: 45.52275, lng: -73.57725, walkMin: 1 },
    },
    websiteUrl: "https://www.mamieclafoutis.com",
    notes: "Artisan depuis 2008, zéro ingrédients synthétiques.",
  },
  {
    order: 5,
    id: "mont_eclair",
    name: "Mont Éclair",
    address: "33 Avenue du Mont-Royal E, Montréal",
    neighborhood: "Plateau-Mont-Royal",
    rating: 4.6,
    reviewCount: 300,
    eclairFlavors: ["chocolat", "vanille Madagascar", "caramel beurre salé", "citron tarte", "framboise rose", "pistache", "passion"],
    openSat: "10:00–20:00",
    arrivalTime: "13:55",
    transitFromPrev: { mode: "walking", duration: 10, detail: "800 m · St-Denis → Mont-Royal" },
    websiteUrl: "https://www.mont-eclair.ca",
    notes: "Spécialiste éclair — 7+ saveurs créatives. Clou du spectacle.",
  },
  {
    order: 6,
    id: "fous_desserts",
    name: "Fous Desserts",
    address: "809 Avenue Laurier E, Montréal",
    neighborhood: "Plateau-Mont-Royal",
    rating: 4.6,
    reviewCount: 581,
    eclairFlavors: ["chocolat", "praliné"],
    openSat: "08:00–18:00",
    arrivalTime: "14:30",
    transitFromPrev: { mode: "walking", duration: 8, detail: "700 m · Mont-Royal → Laurier" },
    websiteUrl: "https://fousdesserts.com",
    notes: "FIN — institution depuis 1995, fusion franco-japonaise. Métro Laurier + parc pour débrief.",
  },
];

// =============================================================================
// BACKUPS — pâtisseries de secours faisant des éclairs, proches de chaque stop
// =============================================================================
const BACKUPS = {
  la_bete_a_pain: [
    {
      name: "Fabrique Caramel",
      address: "1308 Rue Fleury Est, Montréal",
      neighborhood: "Ahuntsic",
      website: "https://www.fabriquecaramel.com/",
      eclairConfirmed: true,
      note: "Éclairs cerise + signature caramel salé. Même rue Fleury, à pied.",
    },
    {
      name: "La Petite Boulangerie",
      address: "Rue Fleury, Montréal",
      neighborhood: "Ahuntsic",
      website: null,
      eclairConfirmed: false,
      note: "20+ ans sur Fleury. Classiques FR, vérifier dispo éclair sur place.",
    },
    {
      name: "Le Pain dans les Voiles",
      address: "357 Rue de Castelnau E, Montréal",
      neighborhood: "Villeray",
      website: "https://lepaindanslesvoiles.com",
      eclairConfirmed: false,
      note: "Pâtisseries saisonnières. Vérifier dispo éclair sur place.",
    },
    {
      name: "Première Moisson",
      address: "1271 Rue Fleury E, Montréal",
      neighborhood: "Ahuntsic",
      website: "https://premieremoisson.com",
      eclairConfirmed: true,
      note: "Chaîne fiable, éclair classique chocolat. Filet de sécurité.",
    },
  ],
  de_froment_seve: [
    {
      name: "Pâtisserie Madeleine",
      address: "2105 Rue Beaubien E, Montréal",
      neighborhood: "Rosemont",
      website: "https://patisseriemadeleine.ca/",
      eclairConfirmed: true,
      note: "Même rue Beaubien — couple FR Champagne. Éclair chocolat glaçage + Paris-Brest.",
    },
    {
      name: "Pâtisserie L'Éclaircie",
      address: "6600 Rue Saint-Hubert, Montréal",
      neighborhood: "Rosemont-La-Petite-Patrie",
      website: "https://patisserieleclaircie.com/",
      eclairConfirmed: true,
      note: "Spécialiste éclairs (\"Les meilleurs éclairs en ville\"). Café 2e étage.",
    },
    {
      name: "Pâtisserie Rosário",
      address: "Rosemont-La-Petite-Patrie, Montréal",
      neighborhood: "Rosemont",
      website: null,
      eclairConfirmed: false,
      note: "Top liste cake shops Rosemont. Vérifier sur place.",
    },
    {
      name: "Automne Boulangerie",
      address: "6500 Rue Saint-Hubert, Montréal",
      neighborhood: "Petite-Patrie",
      website: "https://automneboulangerie.com",
      eclairConfirmed: false,
      note: "Inspiration scandinave. Pain + pâtisseries.",
    },
  ],
  alex_platel_rosemont: [
    {
      name: "Pâtisserie Madeleine",
      address: "2105 Rue Beaubien E, Montréal",
      neighborhood: "Rosemont",
      website: "https://patisseriemadeleine.ca/",
      eclairConfirmed: true,
      note: "~10 min marche depuis Masson. Éclair chocolat classique FR.",
    },
    {
      name: "Pâtisserie L'Éclaircie",
      address: "6600 Rue Saint-Hubert, Montréal",
      neighborhood: "Rosemont-La-Petite-Patrie",
      website: "https://patisserieleclaircie.com/",
      eclairConfirmed: true,
      note: "Spécialiste éclairs. Métro Rosemont.",
    },
    {
      name: "Café Dei Campi",
      address: "41 Rue Beaubien E, Montréal",
      neighborhood: "Petite-Patrie",
      website: null,
      eclairConfirmed: false,
      note: "Italien, pâtisseries maison. Backup atypique.",
    },
  ],
  mamie_clafoutis: [
    {
      name: "Pâtisserie Rhubarbe",
      address: "1479 Avenue Laurier E, Montréal",
      neighborhood: "Plateau-Mont-Royal",
      website: null,
      eclairConfirmed: false,
      note: "Top-tier Plateau. Signatures = tarte citron, millefeuille. Classiques FR possibles.",
    },
    {
      name: "Boulangerie Guillaume",
      address: "5134 Boulevard Saint-Laurent, Montréal",
      neighborhood: "Mile-End",
      website: "https://guillau.me/en",
      eclairConfirmed: false,
      note: "Tradition FR + pâtisseries. Plus loin (Mile-End).",
    },
    {
      name: "Pâtisserie Zébulon",
      address: "5325 Avenue du Parc, Montréal",
      neighborhood: "Plateau",
      website: null,
      eclairConfirmed: false,
      note: "100% vegan. Éclair vegan possible. Niche.",
    },
  ],
  mont_eclair: [
    {
      name: "Pâtisserie Rhubarbe",
      address: "1479 Avenue Laurier E, Montréal",
      neighborhood: "Plateau-Mont-Royal",
      website: null,
      eclairConfirmed: false,
      note: "~10 min à pied. Top-tier Plateau, classiques FR.",
    },
    {
      name: "Les Co'Pains d'abord",
      address: "418 Rue Rachel E, Montréal",
      neighborhood: "Plateau-Mont-Royal",
      website: null,
      eclairConfirmed: false,
      note: "Top liste boulangeries Plateau. Vérifier dispo éclair.",
    },
  ],
  fous_desserts: [
    {
      name: "Pâtisserie Rhubarbe",
      address: "1479 Avenue Laurier E, Montréal",
      neighborhood: "Plateau-Mont-Royal",
      website: null,
      eclairConfirmed: false,
      note: "MÊME RUE Laurier E, ~700m à pied. Backup #1 géographique.",
    },
    {
      name: "Hof Kelsten",
      address: "4524 Boulevard Saint-Laurent, Montréal",
      neighborhood: "Plateau",
      website: "https://hofkelsten.com/",
      eclairConfirmed: false,
      note: "Boulangerie gastronomique. Croissants top MTL + pâtisseries FR/Juives.",
    },
  ],
};

// =============================================================================
// CONFIG
// =============================================================================
const EVENT_DATE = new Date("2026-05-23T11:15:00-04:00");
const KEY_CHECKINS = "eclairs_mtl_checkins";
const KEY_PHOTOS   = "eclairs_mtl_photos";
const KEY_RATINGS  = "eclairs_mtl_ratings";

const SITE_URL  = "https://naseradd.github.io/bakery-trail/";
const FB_APP_ID = "966242223397117";

const RATING_CRITERIA = [
  { id: "pate",         label: "Pâte" },
  { id: "ganache",      label: "Ganache" },
  { id: "qualite_prix", label: "Qualité/prix" },
  { id: "visuel",       label: "Visuel" },
  { id: "fraicheur",    label: "Fraîcheur" },
  { id: "glacage",      label: "Glaçage" },
  { id: "globale",      label: "Note globale" },
];

// =============================================================================
// STORAGE
// =============================================================================
function getCheckins() {
  try { return JSON.parse(localStorage.getItem(KEY_CHECKINS) || "{}"); } catch { return {}; }
}
function saveCheckins(data) {
  localStorage.setItem(KEY_CHECKINS, JSON.stringify(data));
}

function getPhotos() {
  try { return JSON.parse(localStorage.getItem(KEY_PHOTOS) || "{}"); } catch { return {}; }
}
function savePhotos(data) {
  localStorage.setItem(KEY_PHOTOS, JSON.stringify(data));
}

function getRatings() {
  try { return JSON.parse(localStorage.getItem(KEY_RATINGS) || "{}"); } catch { return {}; }
}
function saveRatings(data) {
  localStorage.setItem(KEY_RATINGS, JSON.stringify(data));
}

// =============================================================================
// IMAGE RESIZE (canvas → base64 JPEG ~75%)
// =============================================================================
function resizeImage(file, maxPx = 900, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (evt) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// =============================================================================
// GOOGLE MAPS URL BUILDERS
// =============================================================================
function buildTrajetUrl(fromStop, toStop) {
  const origin = fromStop ? fromStop.address : "Métro Sauvé, Montréal";
  const mode   = toStop.transitFromPrev ? toStop.transitFromPrev.mode : "transit";
  const params = new URLSearchParams({
    api:         "1",
    origin:      origin,
    destination: toStop.address,
    travelmode:  mode,
  });
  return `https://www.google.com/maps/dir/?${params}`;
}

function buildPlaceUrl(stop) {
  const q = encodeURIComponent(`${stop.name}, ${stop.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function buildBixiUrl(station) {
  return `https://secure.bixi.com/map/?lat=${station.lat}&lng=${station.lng}&zoom=17`;
}

// =============================================================================
// TRANSIT HELPERS
// =============================================================================
const TRANSIT_LABELS = { transit: "Métro", bicycling: "BIXI", walking: "Marche" };

function transitLabel(mode) { return TRANSIT_LABELS[mode] || mode; }

// SVG icons as strings
const ICON_MAP = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const ICON_GLOBE = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
const ICON_NAV = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`;
const ICON_CHECK = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const ICON_PIN = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const ICON_CAMERA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
const ICON_STAR = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const ICON_SHARE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`;
const ICON_DOWNLOAD = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
const ICON_MESSENGER = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.34.27.55l.05 1.78a.8.8 0 0 0 1.12.71l1.99-.88c.16-.07.34-.08.5-.04.91.25 1.88.38 2.93.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 7.46-2.93 4.65a1.5 1.5 0 0 1-2.17.4l-2.33-1.75a.6.6 0 0 0-.72 0l-3.15 2.39c-.42.32-.97-.18-.69-.63L9.93 9.87a1.5 1.5 0 0 1 2.17-.4l2.33 1.75c.21.16.51.16.72 0l3.15-2.39c.42-.32.97.18.7.63z"/></svg>`;

// =============================================================================
// SHARE / EXPORT HELPERS
// =============================================================================
function buildMessengerWebFallback(link) {
  const p = new URLSearchParams({
    link,
    redirect_uri: link,
    app_id: FB_APP_ID,
  });
  return `https://www.facebook.com/dialog/send?${p.toString()}`;
}

function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Open Messenger share. On mobile try the native app deep link first,
// fall back to the web dialog if nothing handles the URL within 1.5s.
function openMessengerShare(link) {
  const fallback = buildMessengerWebFallback(link);

  if (!isMobileDevice()) {
    window.open(fallback, "_blank", "noopener");
    return;
  }

  const deepLink = `fb-messenger://share/?link=${encodeURIComponent(link)}`;
  let cancelled = false;

  const onVisibility = () => {
    if (document.hidden) cancelled = true;
  };
  document.addEventListener("visibilitychange", onVisibility, { once: true });

  window.location.href = deepLink;

  setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibility);
    if (!cancelled) window.location.href = fallback;
  }, 1500);
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(text); return true; } catch {}
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch {}
  document.body.removeChild(ta);
  return ok;
}

function buildNotesShareText(stop, ratings) {
  const r = ratings[stop.id] || {};
  const lines = [`🥐 BakeryTrail · ${stop.name}`];
  RATING_CRITERIA.forEach(c => {
    const v = r[c.id];
    if (v) lines.push(`⭐ ${c.label}: ${v}/5`);
  });
  if (lines.length === 1) lines.push("(aucune note saisie)");
  lines.push("", SITE_URL);
  return lines.join("\n");
}

function extFromDataUrl(dataUrl) {
  const m = /^data:(image\/[a-zA-Z+]+);base64,/.exec(dataUrl);
  if (!m) return "jpg";
  if (m[1].includes("png"))  return "png";
  if (m[1].includes("webp")) return "webp";
  return "jpg";
}

async function downloadAllPhotos() {
  const photos = getPhotos();
  const total  = Object.values(photos).reduce((acc, arr) => acc + (arr ? arr.length : 0), 0);
  if (total === 0) {
    alert("Aucune photo à télécharger pour l'instant.");
    return;
  }
  if (total > 5 && !confirm(`Télécharger ${total} photos individuellement ? Ton navigateur va peut-être demander d'autoriser plusieurs téléchargements.`)) {
    return;
  }

  for (const stop of PATISSERIES) {
    const arr = photos[stop.id];
    if (!arr || arr.length === 0) continue;
    for (let i = 0; i < arr.length; i++) {
      const dataUrl = arr[i];
      const ext = extFromDataUrl(dataUrl);
      const name = `eclair-${String(stop.order).padStart(2, "0")}-${stop.id}-${String(i + 1).padStart(2, "0")}.${ext}`;
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Stagger to give the browser room — many browsers throttle rapid
      // synchronous downloads triggered from a single user gesture.
      await new Promise(r => setTimeout(r, 250));
    }
  }
}

async function downloadStopPhotos(stopId) {
  const stop = PATISSERIES.find(p => p.id === stopId);
  if (!stop) return;
  const arr = getPhotos()[stopId] || [];
  if (arr.length === 0) {
    alert("Aucune photo pour ce lieu.");
    return;
  }
  for (let i = 0; i < arr.length; i++) {
    const dataUrl = arr[i];
    const ext = extFromDataUrl(dataUrl);
    const name = `eclair-${String(stop.order).padStart(2, "0")}-${stop.id}-${String(i + 1).padStart(2, "0")}.${ext}`;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    await new Promise(r => setTimeout(r, 250));
  }
}

async function shareNotesOnMessenger(stopId) {
  const stop = PATISSERIES.find(p => p.id === stopId);
  if (!stop) return;
  const text = buildNotesShareText(stop, getRatings());
  await copyToClipboard(text);
  alert("Notes copiées dans le presse-papier. Colle-les dans Messenger après l'envoi du lien.");
  openMessengerShare(SITE_URL);
}

// =============================================================================
// SHARE DRAWER (per-stop bottom sheet)
// =============================================================================
let _drawerStopId = null;

function openShareDrawer(stopId) {
  const stop = PATISSERIES.find(p => p.id === stopId);
  if (!stop) return;
  _drawerStopId = stopId;

  const overlay = document.getElementById("drawerOverlay");
  const title   = document.getElementById("drawerTitle");
  if (!overlay || !title) return;

  title.textContent = `Partager · ${stop.name}`;
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
  // Force reflow then animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.add("open"));
  });
}

function closeShareDrawer() {
  const overlay = document.getElementById("drawerOverlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  setTimeout(() => {
    overlay.hidden = true;
    document.body.style.overflow = "";
    _drawerStopId = null;
  }, 280);
}

async function handleDrawerAction(action) {
  if (!_drawerStopId) return;
  const stopId = _drawerStopId;
  const stop = PATISSERIES.find(p => p.id === stopId);
  if (!stop) return;

  if (action === "copy") {
    const text = buildNotesShareText(stop, getRatings());
    closeShareDrawer();
    const ok = await copyToClipboard(text);
    alert(ok ? "Notes copiées dans le presse-papier." : "Impossible de copier les notes.");
    return;
  }

  if (action === "photos") {
    closeShareDrawer();
    await downloadStopPhotos(stopId);
    return;
  }

  if (action === "messenger") {
    closeShareDrawer();
    await shareNotesOnMessenger(stopId);
    return;
  }
}

// =============================================================================
// RATING FORM
// =============================================================================
function renderStars(stopId, critId, currentValue) {
  return [1, 2, 3, 4, 5].map(v => `
    <button type="button"
            class="star-btn${v <= currentValue ? " filled" : ""}"
            data-stop-id="${stopId}"
            data-crit="${critId}"
            data-val="${v}"
            aria-label="${v}/5">
      ${ICON_STAR}
    </button>`).join("");
}

function renderRatingForm(stopId, ratings) {
  const stopRatings = ratings[stopId] || {};
  const rowsHtml = RATING_CRITERIA.map(c => `
    <div class="rating-row${c.id === "globale" ? " rating-row--overall" : ""}">
      <div class="rating-label">${c.label}</div>
      <div class="stars">${renderStars(stopId, c.id, stopRatings[c.id] || 0)}</div>
    </div>`).join("");
  return `
    <div class="rating-section">
      <div class="rating-title f-mono">Notation éclair</div>
      ${rowsHtml}
    </div>`;
}

// =============================================================================
// COUNTDOWN
// =============================================================================
function updateCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;
  const diff = EVENT_DATE - new Date();
  if (diff > 0) {
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    el.textContent = days >= 1 ? `J-${days}` : `H-${hours}`;
    el.classList.remove("countdown--live", "countdown--done");
    return;
  }
  const nextIdx = getNextIdx();
  if (nextIdx < 0) {
    el.textContent = "TOURNÉE COMPLÈTE 🎉";
    el.classList.add("countdown--done");
    el.classList.remove("countdown--live");
    return;
  }
  const next = PATISSERIES[nextIdx];
  el.textContent = `EN ROUTE → ${String(next.order).padStart(2, "0")} · ${next.arrivalTime}`;
  el.classList.add("countdown--live");
  el.classList.remove("countdown--done");
}

// =============================================================================
// NEXT UNVISITED STOP
// =============================================================================
function getNextIdx() {
  const checkins = getCheckins();
  return PATISSERIES.findIndex(p => !checkins[p.id]);
}

// =============================================================================
// RENDER STOPS
// =============================================================================
function renderStops() {
  const container = document.getElementById("stopsList");
  if (!container) return;

  const checkins = getCheckins();
  const photos   = getPhotos();
  const ratings  = getRatings();
  const nextIdx  = getNextIdx();

  container.innerHTML = PATISSERIES.map((stop, idx) => {
    const isVisited = !!checkins[stop.id];
    const isNext    = idx === nextIdx;
    const stopPhotos = photos[stop.id] || [];
    const prevStop   = idx === 0 ? null : PATISSERIES[idx - 1];

    const trajetUrl = buildTrajetUrl(prevStop, stop);
    const placeUrl  = buildPlaceUrl(stop);

    const checkinTime = isVisited
      ? new Date(checkins[stop.id]).toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" })
      : null;

    const flavorsHtml = stop.eclairFlavors
      .map(f => `<span class="flavor-tag">${f}</span>`)
      .join("");

    const photosHtml = stopPhotos
      .map((src, i) => `<img class="photo-thumb" src="${src}" alt="Photo ${i + 1}" data-stop-id="${stop.id}" data-idx="${i}" />`)
      .join("");

    const badgeHtml = isVisited
      ? `<span class="stop-badge badge-visited">${ICON_CHECK} ${checkinTime}</span>`
      : isNext
        ? `<span class="stop-badge badge-next">Prochain arrêt</span>`
        : "";

    const transitHtml = stop.transitFromPrev
      ? `<div class="transit-pill">
           <span class="transit-mode">${transitLabel(stop.transitFromPrev.mode)}</span>
           <span>·</span>
           <span>${stop.transitFromPrev.duration} min</span>
           <span>·</span>
           <span>${stop.transitFromPrev.detail}</span>
         </div>`
      : "";

    const t = stop.transitFromPrev;
    const bixiHtml = (t && t.mode === "bicycling" && t.bixiPickup && t.bixiDrop)
      ? `<div class="bixi-row">
           <a href="${buildBixiUrl(t.bixiPickup)}" target="_blank" rel="noopener" class="btn-bixi">
             <span class="bixi-icon">🚲</span>
             <span class="bixi-label">
               <span class="bixi-action">Prendre BIXI</span>
               <span class="bixi-station">${t.bixiPickup.name} · ${t.bixiPickup.walkMin} min</span>
             </span>
           </a>
           <a href="${buildBixiUrl(t.bixiDrop)}" target="_blank" rel="noopener" class="btn-bixi">
             <span class="bixi-icon">🅿️</span>
             <span class="bixi-label">
               <span class="bixi-action">Déposer BIXI</span>
               <span class="bixi-station">${t.bixiDrop.name} · ${t.bixiDrop.walkMin} min</span>
             </span>
           </a>
         </div>`
      : "";

    const checkinHtml = isVisited
      ? `<button class="checkin-btn done" data-stop-id="${stop.id}" disabled>
           ${ICON_CHECK} Visité · ${checkinTime}
         </button>`
      : `<button class="checkin-btn" data-stop-id="${stop.id}">
           ${ICON_PIN} Check-in
         </button>`;

    const websiteHtml = stop.websiteUrl
      ? `<a href="${stop.websiteUrl}" target="_blank" rel="noopener" class="btn-icon" title="Site web">
           ${ICON_GLOBE}
           <span>Site</span>
         </a>`
      : `<div class="btn-icon disabled" aria-hidden="true">
           ${ICON_GLOBE}
           <span>—</span>
         </div>`;

    return `
<article class="stop-card${isVisited ? " is-visited" : ""}${isNext ? " is-next" : ""}" id="stop-${stop.id}">
  <div class="card-header">
    <div class="stop-num f-display">${String(stop.order).padStart(2, "0")}</div>
    <div class="stop-info">
      <div class="stop-name f-display">${stop.name}</div>
      <div class="stop-details">
        <span class="stop-detail">${stop.arrivalTime}</span>
        <span class="stop-detail">${stop.neighborhood}</span>
        <span class="stop-detail">${stop.rating}/5 (${stop.reviewCount})</span>
        <span class="stop-detail">${stop.openSat}</span>
      </div>
      ${badgeHtml}
    </div>
  </div>
  <div class="card-body">
    ${transitHtml}
    ${bixiHtml}
    <div class="flavors">${flavorsHtml}</div>
    <div class="action-row">
      <a href="${trajetUrl}" target="_blank" rel="noopener" class="btn-maps">
        ${ICON_NAV}
        ${idx === 0 ? "Départ" : "Trajet"}
      </a>
      <a href="${placeUrl}" target="_blank" rel="noopener" class="btn-icon" title="Voir sur Maps">
        ${ICON_MAP}
        <span>Lieu</span>
      </a>
      ${websiteHtml}
    </div>
    ${checkinHtml}
    ${renderRatingForm(stop.id, ratings)}
    <button class="share-trigger-btn" data-share-stop="${stop.id}" type="button">
      ${ICON_SHARE}
      <span>Partager</span>
    </button>
    <div class="photos-section">
      <div class="photos-label f-mono">Photos souvenir</div>
      <div class="photos-strip" id="photos-${stop.id}">
        <button class="add-photo-btn" data-stop-id="${stop.id}" aria-label="Ajouter une photo">
          ${ICON_CAMERA}
          <span>Photo</span>
        </button>
        ${photosHtml}
      </div>
    </div>
    ${stop.notes ? `<p class="stop-note">${stop.notes}</p>` : ""}
  </div>
</article>`;
  }).join("");
}

// =============================================================================
// RENDER BACKUPS
// =============================================================================
function buildBackupMapsUrl(backup) {
  const q = encodeURIComponent(`${backup.name}, ${backup.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function renderBackups() {
  const container = document.getElementById("backupsList");
  if (!container) return;

  container.innerHTML = PATISSERIES.map(stop => {
    const backups = BACKUPS[stop.id] || [];
    if (backups.length === 0) return "";

    const backupsHtml = backups.map(b => {
      const mapsUrl = buildBackupMapsUrl(b);
      const websiteHtml = b.website
        ? `<a href="${b.website}" target="_blank" rel="noopener" class="btn-icon" title="Site web">
             ${ICON_GLOBE}
             <span>Site</span>
           </a>`
        : `<div class="btn-icon disabled" aria-hidden="true">
             ${ICON_GLOBE}
             <span>—</span>
           </div>`;
      const badgeClass = b.eclairConfirmed ? "eclair-badge-yes" : "eclair-badge-maybe";
      const badgeText  = b.eclairConfirmed ? "Éclair ✓"        : "À vérifier";

      return `
<article class="backup-card">
  <div class="backup-card-header">
    <div class="backup-name f-display">${b.name}</div>
    <span class="eclair-badge ${badgeClass}">${badgeText}</span>
  </div>
  <div class="backup-details">
    <span class="stop-detail">${b.neighborhood}</span>
    <span class="stop-detail">${b.address}</span>
  </div>
  ${b.note ? `<p class="stop-note">${b.note}</p>` : ""}
  <div class="action-row">
    <a href="${mapsUrl}" target="_blank" rel="noopener" class="btn-maps">
      ${ICON_NAV}
      Maps
    </a>
    ${websiteHtml}
  </div>
</article>`;
    }).join("");

    return `
<div class="backup-group">
  <div class="backup-group-header">
    <div class="stop-num f-display">${String(stop.order).padStart(2, "0")}</div>
    <div class="backup-group-info">
      <div class="backup-group-title f-display">Plan B · ${stop.name}</div>
      <div class="stop-detail">${stop.neighborhood} · ${stop.address}</div>
    </div>
  </div>
  ${backupsHtml}
</div>`;
  }).join("");
}

// =============================================================================
// EVENT DELEGATION (single listener — avoids stale handlers after re-render)
// =============================================================================
let currentPhotoStopId = null;

function initEventDelegation() {
  const photoInput = document.getElementById("photoInput");

  document.addEventListener("click", (e) => {
    // Check-in
    const checkinBtn = e.target.closest(".checkin-btn:not(.done)");
    if (checkinBtn) {
      handleCheckin(checkinBtn.dataset.stopId);
      return;
    }

    // Star rating
    const starBtn = e.target.closest(".star-btn");
    if (starBtn) {
      handleStarClick(starBtn);
      return;
    }

    // Per-stop drawer trigger
    const shareStopBtn = e.target.closest("[data-share-stop]");
    if (shareStopBtn) {
      openShareDrawer(shareStopBtn.dataset.shareStop);
      return;
    }

    // Drawer action buttons
    const drawerBtn = e.target.closest("[data-drawer-action]");
    if (drawerBtn) {
      handleDrawerAction(drawerBtn.dataset.drawerAction);
      return;
    }

    // Drawer overlay or close button → dismiss
    if (e.target.id === "drawerOverlay" || e.target.closest("#drawerClose")) {
      closeShareDrawer();
      return;
    }

    // Global download FAB
    if (e.target.closest("#downloadAllFab")) {
      downloadAllPhotos();
      return;
    }

    // PDF report trigger (header)
    if (e.target.closest("#pdfReportBtn")) {
      generatePDF();
      return;
    }

    // PDF modal actions
    const pdfActionBtn = e.target.closest("[data-pdf-action]");
    if (pdfActionBtn) {
      const act = pdfActionBtn.dataset.pdfAction;
      if (act === "download")  downloadPdf();
      if (act === "messenger") sharePdfMessenger();
      if (act === "close")     closePdfModal();
      return;
    }

    // PDF modal overlay tap → dismiss
    if (e.target.id === "pdfModalOverlay") {
      closePdfModal();
      return;
    }

    // Add photo
    const addPhotoBtn = e.target.closest(".add-photo-btn");
    if (addPhotoBtn) {
      currentPhotoStopId = addPhotoBtn.dataset.stopId;
      photoInput.value = "";
      photoInput.click();
      return;
    }

    // Photo thumbnail → lightbox
    if (e.target.matches(".photo-thumb")) {
      openLightbox(e.target.src);
      return;
    }

    // Lightbox close (backdrop or button)
    if (e.target.id === "lightbox" || e.target.id === "lightboxClose") {
      closeLightbox();
    }
  });

  if (!photoInput) return;

  // Camera capture handler
  photoInput.addEventListener("change", async (evt) => {
    const file = evt.target.files[0];
    if (!file || !currentPhotoStopId) return;

    let base64;
    try {
      base64 = await resizeImage(file);
    } catch {
      return;
    }

    const photos = getPhotos();
    if (!photos[currentPhotoStopId]) photos[currentPhotoStopId] = [];
    photos[currentPhotoStopId].push(base64);

    try {
      savePhotos(photos);
    } catch {
      // localStorage quota exceeded
      alert("Stockage plein — supprime d'anciennes photos dans le récap.");
      return;
    }

    // Append thumbnail without full re-render
    const strip = document.getElementById(`photos-${currentPhotoStopId}`);
    if (strip) {
      const img = document.createElement("img");
      img.className = "photo-thumb";
      img.src = base64;
      img.alt = `Photo ${photos[currentPhotoStopId].length}`;
      img.dataset.stopId = currentPhotoStopId;
      img.dataset.idx = String(photos[currentPhotoStopId].length - 1);
      strip.appendChild(img);
    }
  });
}

// =============================================================================
// CHECK-IN
// =============================================================================
function handleCheckin(stopId) {
  const checkins = getCheckins();
  if (checkins[stopId]) return;
  checkins[stopId] = new Date().toISOString();
  saveCheckins(checkins);
  renderStops();
  updateCountdown();

  // Scroll to next unvisited stop
  const nextIdx = getNextIdx();
  if (nextIdx >= 0) {
    const nextEl = document.getElementById(`stop-${PATISSERIES[nextIdx].id}`);
    if (nextEl) {
      setTimeout(() => nextEl.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }
}

// =============================================================================
// STAR RATING
// =============================================================================
function handleStarClick(btn) {
  const stopId = btn.dataset.stopId;
  const crit   = btn.dataset.crit;
  const val    = parseInt(btn.dataset.val, 10);
  if (!stopId || !crit || isNaN(val)) return;

  const ratings = getRatings();
  if (!ratings[stopId]) ratings[stopId] = {};

  const newVal = ratings[stopId][crit] === val ? 0 : val;
  if (newVal === 0) {
    delete ratings[stopId][crit];
  } else {
    ratings[stopId][crit] = newVal;
  }
  saveRatings(ratings);

  btn.parentElement.querySelectorAll(".star-btn").forEach(b => {
    const v = parseInt(b.dataset.val, 10);
    b.classList.toggle("filled", v <= newVal);
  });
}

// =============================================================================
// LIGHTBOX
// =============================================================================
function openLightbox(src) {
  document.getElementById("lightboxImg").src = src;
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.getElementById("lightboxImg").src = "";
  document.body.style.overflow = "";
}

// Close lightbox / drawer on Escape
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  closeLightbox();
  closeShareDrawer();
  closePdfModal();
});

// =============================================================================
// EN ROUTE — scroll to next unvisited stop on load
// =============================================================================
function scrollToNextStop() {
  const nextIdx = getNextIdx();
  if (nextIdx <= 0) return;
  const nextEl = document.getElementById(`stop-${PATISSERIES[nextIdx].id}`);
  if (nextEl) {
    setTimeout(() => nextEl.scrollIntoView({ behavior: "smooth", block: "start" }), 500);
  }
}

// =============================================================================
// INIT
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  updateCountdown();
  setInterval(updateCountdown, 60000);
  renderStops();
  renderBackups();
  initEventDelegation();
  scrollToNextStop();
});

// =============================================================================
// PDF REPORT — "Top Éclairs"
// =============================================================================
const PDF_CDN = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
let _jspdfPromise = null;

function loadJsPdf() {
  if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
  if (_jspdfPromise) return _jspdfPromise;
  _jspdfPromise = new Promise((resolve, reject) => {
    const existing = Array.from(document.scripts).find(s => s.src === PDF_CDN);
    const onReady = () => {
      if (window.jspdf && window.jspdf.jsPDF) resolve(window.jspdf.jsPDF);
      else reject(new Error("jsPDF non disponible après chargement"));
    };
    if (existing) { existing.addEventListener("load", onReady, { once: true }); return; }
    const s = document.createElement("script");
    s.src = PDF_CDN;
    s.async = true;
    s.onload = onReady;
    s.onerror = () => { _jspdfPromise = null; reject(new Error("Impossible de charger jsPDF")); };
    document.head.appendChild(s);
  });
  return _jspdfPromise;
}

function avgRating(r) {
  const vals = Object.values(r).filter(v => typeof v === "number" && v > 0);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function buildRatedStops() {
  const ratings = getRatings();
  const entries = PATISSERIES
    .map(s => ({ stop: s, ratings: ratings[s.id] || {} }))
    .filter(x => Object.values(x.ratings).some(v => typeof v === "number" && v > 0));
  entries.sort((a, b) => {
    const ag = a.ratings.globale || avgRating(a.ratings);
    const bg = b.ratings.globale || avgRating(b.ratings);
    return bg - ag;
  });
  return entries;
}

function resizePhotoForPdf(dataUrl, maxW = 900) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(maxW / img.width, 1);
      const c = document.createElement("canvas");
      c.width  = Math.max(1, Math.round(img.width  * scale));
      c.height = Math.max(1, Math.round(img.height * scale));
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      resolve({ data: c.toDataURL("image/jpeg", 0.82), w: c.width, h: c.height });
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

function drawStarsPdf(pdf, x, y, value, max = 5, size = 2.2, gap = 2.6) {
  for (let i = 0; i < max; i++) {
    const cx = x + i * (size * 2 + gap);
    if (i < value) {
      pdf.setFillColor(245, 197, 24);
      pdf.circle(cx, y, size, "F");
    } else {
      pdf.setDrawColor(212, 196, 168);
      pdf.setLineWidth(0.35);
      pdf.circle(cx, y, size, "S");
    }
  }
}

let _pdfBlob = null;

async function generatePDF() {
  const entries = buildRatedStops();
  if (!entries.length) {
    alert("Aucune note saisie. Note au moins une pâtisserie pour générer le rapport.");
    return;
  }
  const btn = document.getElementById("pdfReportBtn");
  if (btn) { btn.disabled = true; btn.classList.add("is-loading"); }
  try {
    const JsPDF = await loadJsPdf();
    const pdf = new JsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const W = pdf.internal.pageSize.getWidth();
    const H = pdf.internal.pageSize.getHeight();

    // ── Cover ──────────────────────────────────────────────
    pdf.setFillColor(253, 246, 236);
    pdf.rect(0, 0, W, H, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(54);
    pdf.setTextColor(245, 197, 24);
    pdf.text("BakeryTrail", W / 2, H / 2 - 24, { align: "center" });

    pdf.setFillColor(245, 197, 24);
    pdf.rect(W / 2 - 18, H / 2 - 14, 36, 0.8, "F");

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(28);
    pdf.setTextColor(42, 29, 16);
    pdf.text("Top Éclairs", W / 2, H / 2 - 2, { align: "center" });

    const dateStr = new Date().toLocaleDateString("fr-CA", {
      year: "numeric", month: "long", day: "numeric",
    });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(13);
    pdf.setTextColor(107, 85, 54);
    pdf.text(dateStr, W / 2, H / 2 + 18, { align: "center" });
    pdf.text(
      `${entries.length} lieu${entries.length > 1 ? "x" : ""} évalué${entries.length > 1 ? "s" : ""}`,
      W / 2, H / 2 + 27, { align: "center" }
    );

    pdf.setFontSize(9);
    pdf.setTextColor(179, 152, 115);
    pdf.text("Marathon Éclair · Montréal · 23 mai 2026", W / 2, H - 18, { align: "center" });

    // ── Per-stop pages ─────────────────────────────────────
    const photosMap = getPhotos();
    const critOrder = ["pate", "ganache", "qualite_prix", "visuel", "fraicheur", "glacage"];

    for (let i = 0; i < entries.length; i++) {
      pdf.addPage();
      pdf.setFillColor(253, 246, 236);
      pdf.rect(0, 0, W, H, "F");

      const { stop, ratings } = entries[i];
      const globale = ratings.globale || Math.round(avgRating(ratings));
      const M = 18;
      let y = M + 6;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(245, 197, 24);
      pdf.text(`#${i + 1} SUR ${entries.length}`, M, y);
      y += 9;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(26);
      pdf.setTextColor(42, 29, 16);
      pdf.text(stop.name, M, y);
      y += 7;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(107, 85, 54);
      pdf.text(`${stop.neighborhood} · ${stop.address}`, M, y);
      y += 10;

      // Globale highlight box
      const boxH = 18;
      pdf.setFillColor(255, 248, 231);
      pdf.setDrawColor(245, 197, 24);
      pdf.setLineWidth(0.4);
      pdf.roundedRect(M, y, W - M * 2, boxH, 3, 3, "FD");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(107, 85, 54);
      pdf.text("NOTE GLOBALE", M + 6, y + 6.5);
      drawStarsPdf(pdf, M + 9, y + 13, globale);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(15);
      pdf.setTextColor(42, 29, 16);
      pdf.text(globale > 0 ? `${globale}/5` : "—", W - M - 6, y + 11.5, { align: "right" });
      y += boxH + 8;

      // Criteria rows
      for (const cid of critOrder) {
        const c = RATING_CRITERIA.find(x => x.id === cid);
        if (!c) continue;
        const v = ratings[cid] || 0;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.setTextColor(42, 29, 16);
        pdf.text(c.label, M, y);
        drawStarsPdf(pdf, M + 62, y - 1.2, v);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(107, 85, 54);
        pdf.text(v > 0 ? `${v}/5` : "—", W - M, y, { align: "right" });
        y += 3;
        pdf.setDrawColor(239, 226, 197);
        pdf.setLineWidth(0.2);
        pdf.line(M, y, W - M, y);
        y += 6;
      }
      y += 4;

      // Photos (max 2)
      const stopPhotos = (photosMap[stop.id] || []).slice(0, 2);
      if (stopPhotos.length) {
        const photoW = (W - M * 2 - 8) / 2;
        const photoH = photoW * 0.72;
        if (y + photoH <= H - M) {
          for (let p = 0; p < stopPhotos.length; p++) {
            const resized = await resizePhotoForPdf(stopPhotos[p]);
            if (!resized) continue;
            const px = M + p * (photoW + 8);
            try {
              pdf.addImage(resized.data, "JPEG", px, y, photoW, photoH, undefined, "FAST");
            } catch (err) {
              console.warn("addImage failed", err);
            }
          }
        }
      }
    }

    _pdfBlob = pdf.output("blob");
    openPdfModal();
  } catch (e) {
    console.error(e);
    alert("Erreur PDF : " + (e && e.message ? e.message : "inconnue"));
  } finally {
    if (btn) { btn.disabled = false; btn.classList.remove("is-loading"); }
  }
}

function openPdfModal() {
  const m = document.getElementById("pdfModalOverlay");
  if (!m) return;
  m.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add("open")));
}

function closePdfModal() {
  const m = document.getElementById("pdfModalOverlay");
  if (!m) return;
  m.classList.remove("open");
  setTimeout(() => { m.hidden = true; document.body.style.overflow = ""; }, 280);
}

function downloadPdf() {
  if (!_pdfBlob) return;
  const url = URL.createObjectURL(_pdfBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bakerytrail-top-eclairs.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  closePdfModal();
}

async function sharePdfMessenger() {
  if (!_pdfBlob) return;
  const file = new File([_pdfBlob], "bakerytrail-top-eclairs.pdf", { type: "application/pdf" });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: "BakeryTrail — Top Éclairs",
        text:  "Notre classement éclairs 🥐",
        files: [file],
      });
      closePdfModal();
      return;
    } catch (e) {
      if (e && e.name === "AbortError") return;
      // fall through
    }
  }

  // Fallback: download then open Messenger
  const url = URL.createObjectURL(_pdfBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bakerytrail-top-eclairs.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  closePdfModal();

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  setTimeout(() => {
    if (isMobile) window.location.href = "fb-messenger://";
    else openMessengerShare(SITE_URL);
  }, 900);
}

// =============================================================================
// EXPOSE — used by classement.html
// =============================================================================
window.ECLAIRS_APP = {
  PATISSERIES,
  RATING_CRITERIA,
  getCheckins,
  getPhotos,
  savePhotos,
  getRatings,
  saveRatings,
  buildPlaceUrl,
  downloadAllPhotos,
  downloadStopPhotos,
  shareNotesOnMessenger,
  openMessengerShare,
  openShareDrawer,
  closeShareDrawer,
  generatePDF,
};
