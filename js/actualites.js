async function loadActualites() {
  try {
    const res = await fetch('https://api.github.com/repos/SullyvanAnridhoini/asm-muret/contents/_actualites');
    const files = await res.json();
    const container = document.getElementById('actualites-dynamiques');
    container.innerHTML = '';

    // Trier par date décroissante
    const mdFiles = files.filter(f => f.name.endsWith('.md'));

    const articles = await Promise.all(mdFiles.map(async (file) => {
      const fileRes = await fetch(file.download_url);
      const text = await fileRes.text();

      // Parser le front matter YAML
      const parts = text.split('---');
      const frontMatter = parts[1] || '';
      const body = parts.slice(2).join('---').trim();

      const get = (key) => frontMatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim() || '';
      const getMultiline = (key) => {
        const match = frontMatter.match(new RegExp(`^${key}:\\s*\\|\\n([\\s\\S]*?)(?=\\n\\w|$)`, 'm'));
        return match ? match[1].replace(/^ {2}/gm, '').trim() : get(key);
      };

      return {
        title:        get('title'),
        date:         get('date'),
        image:        get('image'),
        type:         get('type'),
        texte:        get('texte') || body,
        resultats:    getMultiline('resultats'),
        equipes:      get('equipes'),
        encadrement:  get('encadrement'),
        separateur:   get('separateur') || 'separateur2',
        separateur2:  get('separateur2') || 'separateursec2',
      };
    }));

    // Trier par date décroissante
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    articles.forEach((a, i) => {
      const dateFormatee = a.date
        ? new Date(a.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        : '';

      const typeClass = i % 2 === 0 ? 'Competition' : 'Competition2';
      const titreClass = i % 2 === 0 ? 'titreduat' : 'titreduat2';
      const actu2Class = i % 2 === 0 ? 'actualites2' : 'actualites3';
      const sep1Class  = i % 2 === 0 ? 'separateur2' : 'separateursec2';
      const sep2Class  = i % 2 === 0 ? 'separateur3' : 'separateursec3';
      const equipes2Class = i % 2 === 0 ? 'equipes' : 'equipes2';
      const progRowClass  = i % 2 === 0 ? 'prog-row' : 'prog-rowac2';

      // Équipes → badges
      const equipesTags = a.equipes
        ? a.equipes.split(',').map(e => `<span class="prog-tag">${e.trim()}</span>`).join('\n')
        : '';

      // Encadrement → badges
      const encadrementTags = a.encadrement
        ? a.encadrement.split(',').map(e => `<span class="prog-tag5">${e.trim()}</span>`).join('\n')
        : '';

      // Résultats : remplacer les sauts de ligne par <br>
      const resultatsHTML = a.resultats
        ? a.resultats.split('\n').join('<br>')
        : '';

      container.innerHTML += `
        <div class="card-tarif3">
          ${a.image ? `<img src="${a.image}" alt="${a.title}" class="background-image3">` : ''}
          ${a.type   ? `<h2 class="${typeClass}">${a.type}</h2>` : ''}
          ${dateFormatee ? `<h2 class="date_competition">${dateFormatee}</h2>` : ''}
          <h1 class="${titreClass}">${a.title}</h1>
          <p class="actualites1">${a.texte.replace(/\n/g, '<br>')}</p><br>
          ${resultatsHTML ? `<p class="${actu2Class}">${resultatsHTML}</p>` : ''}
          ${equipesTags ? `
            <hr class="${sep1Class}">
            <h2 class="${equipes2Class}">L'Équipe:</h2>
            <div class="${progRowClass}">${equipesTags}</div>
          ` : ''}
          ${encadrementTags ? `
            <hr class="${sep2Class}">
            <h2 class="encadrement">Encadrement:</h2>
            <div class="prog-row2">${encadrementTags}</div>
          ` : ''}
        </div>`;
    });

  } catch(e) {
    console.error('Erreur chargement actualités:', e);
    document.getElementById('actualites-dynamiques').innerHTML =
      '<p style="color:red;text-align:center">Impossible de charger les actualités.</p>';
  }
}

loadActualites();
