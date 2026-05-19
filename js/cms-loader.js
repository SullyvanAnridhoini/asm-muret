/**
 * ASMuret CMS Loader v3
 * Lit directement les fichiers JSON du repo via l'API GitHub
 */

const GITHUB_USER = 'SullyvanAnridhoini';
const GITHUB_REPO = 'asm-muret';
const GITHUB_BRANCH = 'main';

async function githubList(folder) {
  try {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${folder}?ref=${GITHUB_BRANCH}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const files = await res.json();
    return files.filter(f => f.name.endsWith('.json') && f.name !== 'index.json');
  } catch { return []; }
}

async function githubFetch(path) {
  try {
    const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function loadActualites() {
  const container = document.getElementById('actualites-container');
  if (!container) return;
  const files = await githubList('_data/actualites');
  if (!files.length) return;
  container.innerHTML = '';
  for (const f of files) {
    const item = await githubFetch(`_data/actualites/${f.name}`);
    if (!item) continue;
    container.innerHTML += buildActuCard(item);
  }
}

function buildActuCard(item) {
  const isComp = item.type === 'Competition';
  const isEvt  = item.type === 'Evenement';
  const tL = isComp ? 'Compétition' : isEvt ? 'Événement' : 'Info';
  const tC = isComp ? 'Competition' : 'Competition2';
  const hC = isComp ? 'titreduat' : 'titreduat2';
  const rC = isComp ? 'actualites2' : 'actualites3';
  const rLines = (item.resultats||'').split('\n').filter(Boolean);
  const rHTML = rLines.length ? `<p class="${rC}">${rLines.join('<br>')}</p>` : '';
  const eqHTML = (item.equipe||[]).length ? `<hr class="separateur2"><h2 class="equipes">L'Équipe:</h2><div class="prog-row">${item.equipe.map(e=>`<span class="prog-tag">${e.nom||e}</span>`).join('')}</div>` : '';
  const enHTML = (item.encadrement||[]).length ? `<hr class="separateur3"><h2 class="encadrement">Encadrement:</h2><div class="prog-row2">${item.encadrement.map(e=>`<span class="prog-tag5">${e.nom||e}</span>`).join('')}</div>` : '';
  const dHTML  = (item.disciplines||[]).length ? `<hr class="separateursec2"><h2 class="equipes2">Discipline:</h2><div class="prog-rowac2">${item.disciplines.map(d=>`<span class="prog-tag">${d.nom||d}</span>`).join('')}</div>` : '';
  return `<div class="card-tarif3"><img src="${item.image}" alt="" class="background-image3"><h2 class="${tC}">${tL}</h2><h2 class="date_competition">${item.date}</h2><h1 class="${hC}">${item.titre}</h1><p class="actualites1">${(item.intro||'').replace(/\n/g,'<br>')}</p><br>${rHTML}${eqHTML}${enHTML}${dHTML}</div>`;
}

async function loadPalmares() {
  const container = document.getElementById('palmares-equipes-container');
  if (!container) return;
  const files = await githubList('_data/palmares');
  if (!files.length) return;
  container.innerHTML = '';
  for (const f of files) {
    const item = await githubFetch(`_data/palmares/${f.name}`);
    if (!item) continue;
    container.innerHTML += `<div class="card-Palmares"><img src="${item.image}" alt="" class="background-imagepa1"><h3 class="sous_titrepalmares3">${item.equipe}</h3><h4 class="sous_titrepalmares4">${item.annee}</h4><h3 class="sous_titrepalmares5">${item.description}</h3></div>`;
  }
}

async function loadEvenements() {
  const files = await githubList('_data/evenements');
  if (!files.length) return;
  const slug = new URLSearchParams(window.location.search).get('evt');
  let item = slug ? await githubFetch(`_data/evenements/${slug}.json`) : null;
  if (!item) item = await githubFetch(`_data/evenements/${files[0].name}`);
  if (!item) return;
  const q = s => document.querySelector(s);
  if (q('.card-Event .background-imageevent')) q('.card-Event .background-imageevent').src = item.image;
  if (q('.card-Event .info-event1')) q('.card-Event .info-event1').textContent = item.nom;
  if (q('.card-Event .sous_titreevent')) q('.card-Event .sous_titreevent').innerHTML = (item.description||'').replace(/\n/g,'<br>');
  if (q('.card-Event .btn-primary') && item.lien_inscription) q('.card-Event .btn-primary').href = item.lien_inscription;
  if (q('.infos-grid')) q('.infos-grid').innerHTML = `<div class="info-card"><div class="icon">📍</div><h4>Lieu</h4><p>${item.lieu||''}</p></div><div class="info-card"><div class="icon">🏊</div><h4>Epreuves</h4><p>${(item.epreuves||'').replace(/\n/g,'<br>')}</p></div><div class="info-card"><div class="icon">💶</div><h4>Tarifs</h4><p>${(item.tarifs||[]).map(t=>`${t.categorie} : ${t.prix}`).join('<br>')}</p></div>`;
  if (q('.planning-grid') && (item.planning||[]).length) q('.planning-grid').innerHTML = item.planning.map(r=>`<div class="planning-card"><div class="time">${r.heure}</div><div class="label">${r.label}</div><div class="cat">${r.categorie||''}</div></div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const p = window.location.pathname.toLowerCase();
  if (p.includes('actualites')) loadActualites();
  if (p.includes('palmares')) loadPalmares();
  if (p.includes('evenements') || p.includes('event')) loadEvenements();
});
