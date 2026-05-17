/**
 * ASMuret CMS Loader
 * Charge les données depuis les fichiers JSON générés par Decap CMS
 * et injecte le HTML dans les pages correspondantes.
 */

// ─── Utilitaires ───────────────────────────────────────────────────────────

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function fetchIndex(folder) {
  const index = await fetchJSON(`/_data/${folder}/index.json`);
  return index || [];
}

// ─── ACTUALITÉS ────────────────────────────────────────────────────────────

async function loadActualites() {
  const container = document.getElementById('actualites-container');
  if (!container) return;

  const files = await fetchIndex('actualites');
  if (!files.length) return; // garde le HTML statique existant

  container.innerHTML = '';

  for (const filename of files) {
    const item = await fetchJSON(`/_data/actualites/${filename}`);
    if (!item) continue;
    container.innerHTML += buildActuCard(item);
  }
}

function buildActuCard(item) {
  const isComp = item.type === 'Competition';
  const isEvt  = item.type === 'Evenement';

  const typeLabel = isComp ? 'Compétition' : isEvt ? 'Événement' : 'Info';
  const typeClass = isComp ? 'Competition' : 'Competition2';
  const titleClass = isComp ? 'titreduat' : 'titreduat2';
  const resultClass = isComp ? 'actualites2' : 'actualites3';

  const resultatsLines = (item.resultats || '').split('\n').filter(Boolean);
  const resultatsHTML = resultatsLines.length
    ? `<p class="${resultClass}">${resultatsLines.join('<br>')}</p>`
    : '';

  const equipeHTML = (item.equipe || []).length ? `
    <hr class="separateur2">
    <h2 class="equipes">L'Équipe:</h2>
    <div class="prog-row">
      ${item.equipe.map(e => `<span class="prog-tag">${e.nom}</span>`).join('')}
    </div>` : '';

  const encadrementHTML = (item.encadrement || []).length ? `
    <hr class="separateur3">
    <h2 class="encadrement">Encadrement:</h2>
    <div class="prog-row2">
      ${item.encadrement.map(e => `<span class="prog-tag5">${e.nom}</span>`).join('')}
    </div>` : '';

  const disciplinesHTML = (item.disciplines || []).length ? `
    <hr class="separateursec2">
    <h2 class="equipes2">Discipline:</h2>
    <div class="prog-rowac2">
      ${item.disciplines.map(d => `<span class="prog-tag">${d.nom}</span>`).join('')}
    </div>` : '';

  return `
    <div class="card-tarif3">
      <img src="${item.image}" alt="background" class="background-image3">
      <h2 class="${typeClass}">${typeLabel}</h2>
      <h2 class="date_competition">${item.date}</h2>
      <h1 class="${titleClass}">${item.titre}</h1>
      <p class="actualites1">${(item.intro || '').replace(/\n/g, '<br>')}</p><br>
      ${resultatsHTML}
      ${equipeHTML}
      ${encadrementHTML}
      ${disciplinesHTML}
    </div>`;
}

// ─── PALMARÈS ──────────────────────────────────────────────────────────────

async function loadPalmares() {
  const container = document.getElementById('palmares-equipes-container');
  if (!container) return;

  const files = await fetchIndex('palmares');
  if (!files.length) return;

  container.innerHTML = '';

  for (const filename of files) {
    const item = await fetchJSON(`/_data/palmares/${filename}`);
    if (!item) continue;
    container.innerHTML += `
      <div class="card-Palmares">
        <img src="${item.image}" alt="background" class="background-imagepa1">
        <h3 class="sous_titrepalmares3">${item.equipe}</h3>
        <h4 class="sous_titrepalmares4">${item.annee}</h4>
        <h3 class="sous_titrepalmares5">${item.description}</h3>
      </div>`;
  }
}

// ─── ÉVÉNEMENTS ────────────────────────────────────────────────────────────

async function loadEvenements() {
  const container = document.getElementById('evenements-container');
  if (!container) return;

  const files = await fetchIndex('evenements');
  if (!files.length) return;

  // Cherche un paramètre ?evt=slug dans l'URL pour afficher le bon événement
  const params  = new URLSearchParams(window.location.search);
  const slug    = params.get('evt');

  let item = null;
  if (slug) {
    item = await fetchJSON(`/_data/evenements/${slug}.json`);
  }
  if (!item && files.length) {
    item = await fetchJSON(`/_data/evenements/${files[0]}`);
  }
  if (!item) return;

  // Mise à jour de la bannière
  const banner = document.querySelector('.card-Event');
  if (banner) {
    const img = banner.querySelector('.background-imageevent');
    if (img) img.src = item.image;
    const titre = banner.querySelector('.info-event1');
    if (titre) titre.textContent = item.nom;
    const desc = banner.querySelector('.sous_titreevent');
    if (desc) desc.innerHTML = (item.description || '').replace(/\n/g, '<br>');
    const btnInscription = banner.querySelector('.btn-primary');
    if (btnInscription && item.lien_inscription) btnInscription.href = item.lien_inscription;
    const btnPDF = banner.querySelector('.btn-secondary');
    if (btnPDF && item.lien_pdf) btnPDF.href = item.lien_pdf;
  }

  // Infos pratiques
  const infosGrid = document.querySelector('.infos-grid');
  if (infosGrid) {
    const tarifsHTML = (item.tarifs || []).map(t => `${t.categorie} : ${t.prix}`).join('<br>');
    infosGrid.innerHTML = `
      <div class="info-card"><div class="icon">📍</div><h4>Lieu</h4><p>${item.lieu || ''}</p></div>
      <div class="info-card"><div class="icon">🏊</div><h4>Epreuves</h4><p>${(item.epreuves || '').replace(/\n/g, '<br>')}</p></div>
      <div class="info-card"><div class="icon">💶</div><h4>Tarifs</h4><p>${tarifsHTML}</p></div>`;
  }

  // Planning
  const planningGrid = document.querySelector('.planning-grid');
  if (planningGrid && (item.planning || []).length) {
    planningGrid.innerHTML = item.planning.map(r => `
      <div class="planning-card">
        <div class="time">${r.heure}</div>
        <div class="label">${r.label}</div>
        <div class="cat">${r.categorie || ''}</div>
      </div>`).join('');
  }
}

// ─── AUTO-DÉTECTION DE LA PAGE ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.toLowerCase();

  if (path.includes('actualites')) loadActualites();
  if (path.includes('palmares'))   loadPalmares();
  if (path.includes('evenements') || path.includes('event')) loadEvenements();
});
