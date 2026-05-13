
(function () {
  if (window.innerWidth > 768) return;

  var header = document.querySelector('.container');
  if (!header) return;

  if (document.querySelector('.hamburger')) return;  
  
  var btn = document.createElement('button');
  btn.className = 'hamburger';
  btn.setAttribute('aria-label', 'Menu');
  btn.innerHTML = '<span></span><span></span><span></span>';
  header.appendChild(btn);

  
  var menu = document.createElement('nav');
  menu.className = 'mobile-menu';

  
  var mainLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Événements', href: '/Evenements.html' },
    { label: 'Actualités', href: '/Actualites.html' },
    { label: 'Palmarès', href: '/Palmares.html' },
    { label: 'Boutique', href: '/Boutique.html' },
    { label: 'Contacts & Partenaires', href: '/Contacts_Partenaires.html' },
    { label: 'MGS', href: '/MGS.html' },
  ];

  
  var clubLinks = [
    { label: 'Le Bureau', href: '/Le_Club/Le_Bureau.html' },
    { label: 'Tarifs des licences', href: '/Le_Club/Tarifs_des_licences.html' },
    { label: 'Tableaux des entraînements', href: '/Le_Club/Tableaux_des_entra%C3%AEnements.html' },
    { label: 'Nos entraîneurs', href: '/Le_Club/Nos_entra%C3%AEneurs.html' },
  ];

  mainLinks.forEach(function (l) {
    if (l.label === 'Événements') {
      
      var sec = document.createElement('span');
      sec.className = 'mob-section-title';
      sec.textContent = 'Le Club';
      menu.appendChild(sec);
      clubLinks.forEach(function (cl) {
        var a = document.createElement('a');
        a.href = cl.href;
        a.textContent = cl.label;
        a.className = 'mob-sub';
        menu.appendChild(a);
      });
    }
    var a = document.createElement('a');
    a.href = l.href;
    a.textContent = l.label;
    menu.appendChild(a);
  });

  document.body.appendChild(menu);

  
  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    
    var spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
    });
  });
})();


function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
}