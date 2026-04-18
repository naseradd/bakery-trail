// Marathon Éclair MTL — classement.js (page récap)

document.addEventListener("DOMContentLoaded", () => {
  const { PATISSERIES, getCheckins, getPhotos, savePhotos, buildPlaceUrl } = window.ECLAIRS_APP;

  const checkins = getCheckins();
  const photos   = getPhotos();
  const visitedCount = PATISSERIES.filter(p => !!checkins[p.id]).length;

  // ── Progress ──────────────────────────────────────────────────
  document.getElementById("visitedCount").textContent = visitedCount;
  document.getElementById("progressBar").style.width  = `${Math.round((visitedCount / 6) * 100)}%`;
  document.getElementById("progressLabel").textContent =
    visitedCount === 0 ? "Aucune pâtisserie visitée pour le moment"
    : visitedCount === 6 ? "Marathon terminé !"
    : `${visitedCount} pâtisserie${visitedCount > 1 ? "s" : ""} visitée${visitedCount > 1 ? "s" : ""}`;

  // ── Icons ─────────────────────────────────────────────────────
  const ICON_MAP   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const ICON_GLOBE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
  const ICON_CHECK = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  // ── Pâtisserie list ───────────────────────────────────────────
  const listEl = document.getElementById("patisserieList");
  listEl.innerHTML = PATISSERIES.map((stop) => {
    const isVisited = !!checkins[stop.id];
    const placeUrl  = buildPlaceUrl(stop);
    const time = isVisited
      ? new Date(checkins[stop.id]).toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" })
      : null;

    const websiteBtn = stop.websiteUrl
      ? `<a href="${stop.websiteUrl}" target="_blank" rel="noopener" class="link-btn">
           ${ICON_GLOBE}<span>Site</span>
         </a>`
      : `<span class="link-btn disabled">${ICON_GLOBE}<span>—</span></span>`;

    return `
<div class="patisserie-row${isVisited ? " is-visited" : ""}">
  <div class="row-num f-display">${String(stop.order).padStart(2, "0")}</div>
  <div class="row-info">
    <div class="row-name f-display">${stop.name}</div>
    <div class="row-meta f-mono">${stop.neighborhood} · ${stop.openSat}</div>
    ${isVisited ? `<div class="row-visited-time f-mono">${ICON_CHECK} Visité · ${time}</div>` : ""}
  </div>
  <div class="row-links">
    <a href="${placeUrl}" target="_blank" rel="noopener" class="link-btn">
      ${ICON_MAP}<span>Maps</span>
    </a>
    ${websiteBtn}
  </div>
</div>`;
  }).join("");

  // ── Timeline ──────────────────────────────────────────────────
  const timelineEl = document.getElementById("timeline");
  timelineEl.innerHTML = PATISSERIES.map((stop) => {
    const isVisited = !!checkins[stop.id];
    const time = isVisited
      ? new Date(checkins[stop.id]).toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" })
      : null;

    return `
<div class="timeline-item">
  <div class="timeline-dot${isVisited ? " visited" : ""}">
    ${isVisited ? ICON_CHECK : ""}
  </div>
  <div class="timeline-content">
    <div class="timeline-name f-display">${stop.name}</div>
    <div class="timeline-time f-mono${isVisited ? " checked" : ""}">
      ${isVisited ? `Visité · ${time}` : `Planifié · ${stop.arrivalTime}`}
    </div>
  </div>
</div>`;
  }).join("");

  // ── Gallery ───────────────────────────────────────────────────
  function renderGallery() {
    const currentPhotos  = getPhotos();
    const galleryEl = document.getElementById("gallery");
    const stopsWithPhotos = PATISSERIES.filter(p => (currentPhotos[p.id] || []).length > 0);

    if (stopsWithPhotos.length === 0) {
      galleryEl.innerHTML = `<p class="gallery-empty f-mono">Aucune photo pour le moment —<br/>prends des souvenirs lors du marathon !</p>`;
      return;
    }

    galleryEl.innerHTML = stopsWithPhotos.map((stop) => {
      const stopPhotos = currentPhotos[stop.id] || [];
      const imgsHtml = stopPhotos.map((src, i) => `
<div class="gallery-img-wrap">
  <img class="gallery-img" src="${src}" alt="Photo ${i + 1} — ${stop.name}"
       data-stop-id="${stop.id}" data-idx="${i}" />
  <button class="delete-btn" data-stop-id="${stop.id}" data-idx="${i}" aria-label="Supprimer photo ${i + 1}">✕</button>
</div>`).join("");

      return `
<div class="gallery-stop">
  <div class="gallery-stop-name f-display">
    <span class="gallery-stop-num f-mono">${String(stop.order).padStart(2, "0")}</span>
    ${stop.name}
  </div>
  <div class="gallery-grid">${imgsHtml}</div>
</div>`;
    }).join("");
  }

  renderGallery();

  // ── Lightbox ──────────────────────────────────────────────────
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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // ── Interactions (delegated) ──────────────────────────────────
  document.addEventListener("click", (e) => {
    if (e.target.matches(".gallery-img")) {
      openLightbox(e.target.src);
      return;
    }

    if (e.target.id === "lightbox" || e.target.id === "lightboxClose") {
      closeLightbox();
      return;
    }

    const deleteBtn = e.target.closest(".delete-btn");
    if (deleteBtn) {
      const stopId = deleteBtn.dataset.stopId;
      const idx    = parseInt(deleteBtn.dataset.idx, 10);
      const allPhotos = getPhotos();
      if (allPhotos[stopId]) {
        allPhotos[stopId].splice(idx, 1);
        if (allPhotos[stopId].length === 0) delete allPhotos[stopId];
        savePhotos(allPhotos);
        renderGallery();
      }
    }
  });
});
