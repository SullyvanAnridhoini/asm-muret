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
      const fm = parts[1] || '';
      function pf(key) {
        const b = fm.match(new RegExp('^' + key + ':\\s*\\|-?\\n((?:[ \\t]+.+\\n?)*)', 'm'));
        if (b) return b[1].replace(/^[ \t]+/gm, '').trimEnd();
        const i = fm.match(new RegExp('^' + key + ':\\s*(.+)$', 'm'));
        return i ? i[1].trim() : '';
      }
      return { title: pf('title'), date: pf('date'), image: pf('image'), type: pf('type'), texte: pf('texte'), resultats: pf('resultats'), equipes: pf('equipes'), encadrement: pf('encadrement') };
    }));
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    articles.forEach((a, i) => {
      const df = a.date ? new Date(a.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '';
      const tc = i % 2 === 0 ? 'Competition' : 'Competition2';
      const ac = i % 2 === 0 ? 'actualites2' : 'actualites3';
      const ec = i % 2 === 0 ? 'equipes' : 'equipes2';
      const pr = i % 2 === 0 ? 'prog-row' : 'prog-rowac2';
      const etags = a.equipes ? a.equipes.split(',').map(e => '<span class="prog-tag">' + e.trim() + '</span>').join('') : '';
      const ctags = a.encadrement ? a.encadrement.split(',').map(e => '<span class="prog-tag5">' + e.trim() + '</span>').join('') : '';
      const rhtml = a.resultats ? a.resultats.split('\n').join('<br>') : '';
      let html = '<div class="card-tarif3">';
      html += a.image ? '<img src="' + a.image + '" alt="' + a.title + '" class="background-image3">' : '';
      html += '<div class="card-content-right">';
      html += '<div class="card-header-row">';
      html += a.type ? '<span class="' + tc + '">' + a.type + '</span>' : '';
      html += df ? '<span class="date_competition">' + df + '</span>' : '';
      html += '</div>';
      html += '<h1 class="titreduat">' + a.title + '</h1>';
      html += '<p class="actualites1">' + a.texte.replace(/\n/g, '<br>') + '</p>';
      html += rhtml ? '<p class="' + ac + '">' + rhtml + '</p>' : '';
      html += etags ? '<div class="card-equipes"><span class="' + ec + '">L\'EQUIPE:</span><div class="' + pr + '">' + etags + '</div></div>' : '';
      html += ctags ? '<div class="card-equipes"><span class="encadrement">ENCADREMENT:</span><div class="prog-row2">' + ctags + '</div></div>' : '';
      html += '</div></div>';
      container.innerHTML += html;
    });
  } catch(e) {
    console.error('Erreur:', e);
    document.getElementById('actualites-dynamiques').innerHTML = '<p style="color:red;text-align:center">Impossible de charger les actualites.</p>';
  }
}
loadActualites();
