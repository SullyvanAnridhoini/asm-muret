async function loadActualites() {
  try {
    const res = await fetch('https://api.github.com/repos/SullyvanAnridhoini/asm-muret/contents/_actualites');
    const files = await res.json();
    const container = document.getElementById('actualites-dynamiques');
    container.innerHTML = '';
    const mdFiles = files.filter(f => f.name.endsWith('.md'));
    const articles = await Promise.all(mdFiles.map(async (file) => {
      const fileRes = await fetch(file.download_url);
      const text = await fileRes.text();
      const parts = text.split(/^---$/m);
      const frontMatter = parts[1] || '';
      function parseField(key, fm) {
        const blockReg = new RegExp('^' + key + ':\\s*\\|-?\\n((?:[ \\t]+.+\\n?)*)', 'm');
        const blockMatch = fm.match(blockReg);
        if (blockMatch) return blockMatch[1].replace(/^[ \t]+/gm, '').trimEnd();
        const inlineReg = new RegExp('^' + key + ':\\s*(.+)$', 'm');
        const inlineMatch = fm.match(inlineReg);
        return inlineMatch ? inlineMatch[1].trim() : '';
      }
      return {
        title:       parseField('title', frontMatter),
        date:        parseField('date', frontMatter),
        image:       parseField('image', frontMatter),
        type:        parseField('type', frontMatter),
        texte:       parseField('texte', frontMatter),
        resultats:   parseField('resultats', frontMatter),
        equipes:     parseField('equipes', frontMatter),
        encadrement: parseField('encadrement', frontMatter),
      };
    }));
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    articles.forEach((a, i) => {
      const dateFormatee = a.date ? new Date(a.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '';
      const typeClass    = i % 2 === 0 ? 'Competition'  : 'Competition2';
      const titreClass   = i % 2 === 0 ? 'titreduat'    : 'titreduat2';
      const actu2Class   = i % 2 === 0 ? 'actualites2'  : 'actualites3';
      const sep1Class    = i % 2 === 0 ? 'separateur2'  : 'separateursec2';
      const sep2Class    = i % 2 === 0 ? 'separateur3'  : 'separateursec3';
      const equipesClass = i % 2 === 0 ? 'equipes'      : 'equipes2';
      const progRowClass = i % 2 === 0 ? 'prog-row'     : 'prog-rowac2';
      const equipesTags = a.equipes ? a.equipes.split(',').map(e => '<span class="prog-tag">' + e.trim() + '</span>').join('\n') : '';
      const encadrementTags = a.encadrement ? a.encadrement.split(',').map(e => '<span class="prog-tag5">' + e.trim() + '</span>').join('\n') : '';
      const resultatsHTML = a.resultats ? a.resultats.split('\n').join('<br>') : '';
      container.innerHTML += '<div class="card-tarif3">'
        + (a.image ? '<img src="' + a.image + '" alt="' + a.title + '" class="background-image3">' : '')
        + (a.type  ? '<h2 class="' + typeClass + '">' + a.type + '</h2>' : '')
        + (dateFormatee ? '<h2 class="date_competition">' + dateFormatee + '</h2>' : '')
        + '<h1 class="' + titreClass + '">' + a.title + '</h1>'
        + '<p class="actualites1">' + a.texte.replace(/\n/g, '<br>') + '</p>'
        + (resultatsHTML ? '<p class="' + actu2Class + '">' + resultatsHTML + '</p>' : '')
        + (equipesTags ? '<hr class="' + sep1Class + '"><h2 class="' + equipesClass + '">L\'Equipe:</h2><div class="' + progRowClass + '">' + equipesTags + '</div>' : '')
        + (encadrementTags ? '<hr class="' + sep2Class + '"><h2 class="encadrement">Encadrement:</h2><div class="prog-row2">' + encadrementTags + '</div>' : '')
        + '</div>';
    });
  } catch(e) {
    console.error('Erreur:', e);
    document.getElementById('actualites-dynamiques').innerHTML = '<p style="color:red;text-align:center">Impossible de charger les actualites.</p>';
  }
}
loadActualites();
