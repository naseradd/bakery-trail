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

// =============================================================================
// PDF REPORT — "Top Éclairs"
// Lazy-loads jsPDF + html2canvas from CDN on first click. Builds one A4 page
// per rated stop (sorted by globale desc), plus a cover page.
// =============================================================================
const JSPDF_CDN       = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
const HTML2CANVAS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (Array.from(document.scripts).some(s => s.src === src)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload  = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

let _pdfLibsPromise = null;
function loadPdfLibs() {
  if (_pdfLibsPromise) return _pdfLibsPromise;
  _pdfLibsPromise = Promise.all([
    loadScriptOnce(JSPDF_CDN),
    loadScriptOnce(HTML2CANVAS_CDN),
  ]).then(() => ({
    jsPDF:       window.jspdf && window.jspdf.jsPDF,
    html2canvas: window.html2canvas,
  })).catch(err => { _pdfLibsPromise = null; throw err; });
  return _pdfLibsPromise;
}

function avgRating(r) {
  const vals = Object.values(r).filter(v => typeof v === "number" && v > 0);
  if (!vals.length) return 0;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

function buildRatedStops() {
  const { PATISSERIES, getRatings } = window.ECLAIRS_APP;
  const ratings = getRatings();
  const entries = PATISSERIES
    .map(s => ({ stop: s, ratings: ratings[s.id] || {} }))
    .filter(x => Object.values(x.ratings).some(v => v > 0));
  entries.sort((a, b) => {
    const ag = a.ratings.globale || avgRating(a.ratings);
    const bg = b.ratings.globale || avgRating(b.ratings);
    return bg - ag;
  });
  return entries;
}

function starsRow(value, max = 5) {
  let h = "";
  for (let i = 1; i <= max; i++) {
    h += `<span class="pdf-star${i <= value ? " filled" : ""}">★</span>`;
  }
  return h;
}

const PDF_STYLES = `
  .pdf-page { width: 800px; min-height: 1130px; padding: 64px 56px; box-sizing: border-box;
    background: #fdf6ec; color: #2a1d10;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
  .pdf-cover { display: flex; align-items: center; justify-content: center; }
  .pdf-cover-inner { text-align: center; width: 100%; }
  .pdf-emoji { font-size: 96px; line-height: 1; margin-bottom: 28px; }
  .pdf-cover-inner h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 76px;
    font-weight: 700; margin: 0; letter-spacing: -1px; line-height: 1; }
  .pdf-cover-inner h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic;
    font-size: 36px; font-weight: 600; color: #f5c518; margin: 14px 0 28px; }
  .pdf-rule { width: 80px; height: 2px; background: #f5c518; margin: 24px auto 28px; }
  .pdf-meta { font-family: 'JetBrains Mono', monospace; font-size: 17px; color: #6b5536; margin: 6px 0; }
  .pdf-footer-line { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #b39873;
    margin-top: 80px; letter-spacing: 1px; text-transform: uppercase; }
  .pdf-rank { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #f5c518;
    letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
  .pdf-stop-name { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 50px;
    font-weight: 700; margin: 0; letter-spacing: -0.5px; line-height: 1.05; }
  .pdf-stop-meta { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #6b5536; margin-top: 8px; }
  .pdf-globale { margin-top: 28px; padding: 22px 24px; background: #fff8e7;
    border: 1px solid #f5c518; border-radius: 14px;
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .pdf-globale-label { font-size: 14px; font-weight: 700; color: #6b5536;
    text-transform: uppercase; letter-spacing: 1px; }
  .pdf-globale-stars { font-size: 30px; color: #d4d4d4; letter-spacing: 3px; line-height: 1; }
  .pdf-globale-stars .filled { color: #f5c518; }
  .pdf-globale-val { font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; margin-left: auto; }
  .pdf-table { width: 100%; margin-top: 24px; border-collapse: collapse; }
  .pdf-table td { padding: 13px 0; border-bottom: 1px solid #efe2c5; font-size: 17px; }
  .pdf-table tr:last-child td { border-bottom: none; }
  .pdf-crit { color: #2a1d10; font-weight: 600; }
  .pdf-stars-cell { text-align: center; font-size: 22px; color: #d4d4d4; letter-spacing: 3px; line-height: 1; }
  .pdf-stars-cell .filled { color: #f5c518; }
  .pdf-val { text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 700; width: 64px; }
  .pdf-photos { margin-top: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .pdf-photos img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 10px;
    border: 1px solid #efe2c5; display: block; }
  .pdf-star { color: #d4d4d4; }
  .pdf-star.filled { color: #f5c518; }
`;

function ensurePdfStyles() {
  if (document.getElementById("__pdf_style")) return;
  const st = document.createElement("style");
  st.id = "__pdf_style";
  st.textContent = PDF_STYLES;
  document.head.appendChild(st);
}

function getOrCreateOffscreen() {
  let host = document.getElementById("__pdf_offscreen");
  if (!host) {
    host = document.createElement("div");
    host.id = "__pdf_offscreen";
    host.style.cssText = "position: fixed; left: -10000px; top: 0; z-index: -1; pointer-events: none;";
    document.body.appendChild(host);
  }
  host.innerHTML = "";
  return host;
}

function renderCoverHtml(count) {
  const date = new Date().toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });
  return `
    <div class="pdf-page pdf-cover">
      <div class="pdf-cover-inner">
        <div class="pdf-emoji">🥐</div>
        <h1>BakeryTrail</h1>
        <h2>Classement Éclairs</h2>
        <div class="pdf-rule"></div>
        <p class="pdf-meta">${date}</p>
        <p class="pdf-meta">${count} lieu${count > 1 ? "x" : ""} évalué${count > 1 ? "s" : ""}</p>
        <p class="pdf-footer-line">marathon-eclair-mtl · 23 mai 2026</p>
      </div>
    </div>`;
}

function renderStopHtml(entry, rank, total) {
  const { RATING_CRITERIA, getPhotos } = window.ECLAIRS_APP;
  const { stop, ratings } = entry;
  const globale = ratings.globale || Math.round(avgRating(ratings));
  const photos = (getPhotos()[stop.id] || []).slice(0, 4);

  const orderedCrits = ["pate", "ganache", "qualite_prix", "visuel", "fraicheur", "glacage"];
  const rowsHtml = orderedCrits.map(critId => {
    const c = RATING_CRITERIA.find(x => x.id === critId);
    if (!c) return "";
    const v = ratings[critId] || 0;
    return `
      <tr>
        <td class="pdf-crit">${c.label}</td>
        <td class="pdf-stars-cell">${starsRow(v)}</td>
        <td class="pdf-val">${v > 0 ? `${v}/5` : "—"}</td>
      </tr>`;
  }).join("");

  const photosHtml = photos.length
    ? `<div class="pdf-photos">${photos.map(p => `<img src="${p}" alt="" />`).join("")}</div>`
    : "";

  return `
    <div class="pdf-page">
      <div class="pdf-rank">#${rank} sur ${total}</div>
      <h2 class="pdf-stop-name">${stop.name}</h2>
      <div class="pdf-stop-meta">${stop.neighborhood} · ${stop.address}</div>
      <div class="pdf-globale">
        <span class="pdf-globale-label">Note globale</span>
        <span class="pdf-globale-stars">${starsRow(globale)}</span>
        <span class="pdf-globale-val">${globale > 0 ? `${globale}/5` : "—"}</span>
      </div>
      <table class="pdf-table">
        <tbody>${rowsHtml}</tbody>
      </table>
      ${photosHtml}
    </div>`;
}

async function renderHtmlToImage(htmlString, html2canvas) {
  const host = getOrCreateOffscreen();
  host.innerHTML = htmlString;
  const node = host.firstElementChild;

  const imgs = node.querySelectorAll("img");
  await Promise.all(Array.from(imgs).map(im =>
    (im.complete && im.naturalWidth > 0)
      ? null
      : new Promise(res => { im.onload = im.onerror = res; })
  ));

  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: "#fdf6ec",
    logging: false,
    useCORS: true,
  });
  return canvas.toDataURL("image/jpeg", 0.88);
}

async function generateReportPdf() {
  const entries = buildRatedStops();
  if (entries.length === 0) {
    alert("Aucune note saisie pour le moment. Note au moins un lieu pour générer le rapport.");
    return null;
  }

  const { jsPDF, html2canvas } = await loadPdfLibs();
  if (!jsPDF || !html2canvas) throw new Error("Libs PDF indisponibles");
  ensurePdfStyles();

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const coverImg = await renderHtmlToImage(renderCoverHtml(entries.length), html2canvas);
  pdf.addImage(coverImg, "JPEG", 0, 0, pageW, pageH, undefined, "FAST");

  for (let i = 0; i < entries.length; i++) {
    pdf.addPage();
    const img = await renderHtmlToImage(renderStopHtml(entries[i], i + 1, entries.length), html2canvas);
    pdf.addImage(img, "JPEG", 0, 0, pageW, pageH, undefined, "FAST");
  }

  const host = document.getElementById("__pdf_offscreen");
  if (host) host.innerHTML = "";

  return pdf;
}

// === REPORT UI WIRING =========================================================
let _generatedPdf = null;

function showPdfLoader() { const el = document.getElementById("pdfLoader"); if (el) el.hidden = false; }
function hidePdfLoader() { const el = document.getElementById("pdfLoader"); if (el) el.hidden = true; }

function openPdfActions() {
  const overlay = document.getElementById("pdfActionsOverlay");
  if (!overlay) return;
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("open")));
}

function closePdfActions() {
  const overlay = document.getElementById("pdfActionsOverlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  setTimeout(() => {
    overlay.hidden = true;
    document.body.style.overflow = "";
  }, 280);
}

async function handleGenerateReport() {
  const btn = document.getElementById("genReportBtn");
  if (btn) btn.disabled = true;
  showPdfLoader();
  try {
    const pdf = await generateReportPdf();
    hidePdfLoader();
    if (!pdf) return;
    _generatedPdf = pdf;
    openPdfActions();
  } catch (e) {
    hidePdfLoader();
    alert("Erreur de génération PDF" + (e && e.message ? ` — ${e.message}` : "."));
  } finally {
    if (btn) btn.disabled = false;
  }
}

function downloadGeneratedPdf() {
  if (!_generatedPdf) return;
  _generatedPdf.save("bakerytrail-top-eclairs.pdf");
  closePdfActions();
}

async function shareGeneratedPdf() {
  if (!_generatedPdf) return;
  const blob = _generatedPdf.output("blob");
  const file = new File([blob], "bakerytrail-top-eclairs.pdf", { type: "application/pdf" });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: "BakeryTrail — Top Éclairs",
        text:  "Voici notre classement des meilleurs éclairs 🥐",
        files: [file],
      });
      closePdfActions();
      return;
    } catch (e) {
      if (e && e.name === "AbortError") return;
      // fall through to fallback
    }
  }

  // Fallback: download + open Messenger
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bakerytrail-top-eclairs.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  closePdfActions();

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  setTimeout(() => {
    if (isMobile) {
      window.location.href = "fb-messenger://";
    } else if (window.ECLAIRS_APP && window.ECLAIRS_APP.openMessengerShare) {
      window.ECLAIRS_APP.openMessengerShare("https://naseradd.github.io/bakery-trail/");
    }
  }, 900);
}

document.addEventListener("click", (e) => {
  if (e.target.closest("#genReportBtn")) { handleGenerateReport(); return; }
  const pdfAction = e.target.closest("[data-pdf-action]");
  if (pdfAction) {
    if (pdfAction.dataset.pdfAction === "download") downloadGeneratedPdf();
    if (pdfAction.dataset.pdfAction === "share")    shareGeneratedPdf();
    return;
  }
  if (e.target.id === "pdfActionsOverlay") closePdfActions();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePdfActions();
});
