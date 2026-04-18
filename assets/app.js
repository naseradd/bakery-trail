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
    transitFromPrev: { mode: "bicycling", duration: 8, detail: "BIXI · 1.5 km axe Masson" },
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
    openSat: "07:30–20:00",
    arrivalTime: "13:20",
    transitFromPrev: { mode: "bicycling", duration: 15, detail: "BIXI · 3 km St-Joseph → St-Denis" },
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
// CONFIG
// =============================================================================
const EVENT_DATE = new Date("2026-05-23T11:15:00-04:00");
const KEY_CHECKINS = "eclairs_mtl_checkins";
const KEY_PHOTOS   = "eclairs_mtl_photos";

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

// =============================================================================
// COUNTDOWN
// =============================================================================
function updateCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;
  const diff = EVENT_DATE - new Date();
  if (diff <= 0) { el.textContent = "C'EST PARTI"; return; }
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  el.textContent = days >= 1 ? `J-${days}` : `H-${hours}`;
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

// Close lightbox on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
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
  initEventDelegation();
  scrollToNextStop();
});

// =============================================================================
// EXPOSE — used by classement.html
// =============================================================================
window.ECLAIRS_APP = {
  PATISSERIES,
  getCheckins,
  getPhotos,
  savePhotos,
  buildPlaceUrl,
};
