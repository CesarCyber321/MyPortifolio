/* script.js: controla tema e animação das barras de proficiência */
(function(){
  const root = document.documentElement;
  const body = document.body;
  const toggle = document.getElementById('theme-toggle');

  function applyTheme(theme){
    if(theme === 'dark'){
      document.documentElement.setAttribute('data-theme','dark');
      toggle.textContent = '☀️';
    } else {
      document.documentElement.removeAttribute('data-theme');
      toggle.textContent = '🌙';
    }
  }

  // carregar preferencia
  const saved = localStorage.getItem('theme');
  applyTheme(saved === 'dark' ? 'dark' : 'light');

  toggle.addEventListener('click', ()=>{
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  // animar barras quando visíveis
  const skills = document.querySelectorAll('.skill');
  const observer = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const prog = entry.target.querySelector('.progress');
        const val = prog.style.getPropertyValue('--value') || prog.getAttribute('data-value') || '80%';
        // extrair número
        const n = val.replace('%','').trim();
        prog.style.width = n + '%';
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.2});

  skills.forEach(s=>observer.observe(s));

  // clique na skill mostra detalhes rápidos
  skills.forEach(s=>{
    s.addEventListener('click', ()=>{
      const name = s.getAttribute('data-skill') || s.querySelector('strong').textContent;
      const pct = s.querySelector('.percent').textContent;
      alert(name + ' — Proficiência aproximada: ' + pct + '\nExemplos: projetos, estudos e prática contínua.');
    });
  });

  // avatar upload & preview
  const avatarInput = document.getElementById('avatarInput');
  const avatarPreview = document.getElementById('avatarPreview');

  function loadAvatar(){
    try{
      const data = localStorage.getItem('avatarData');
      if(data && avatarPreview) avatarPreview.src = data;
    }catch(e){console.warn('Não foi possível carregar avatar', e)}
  }

  function saveAvatar(dataUrl){
    try{ localStorage.setItem('avatarData', dataUrl); }catch(e){console.warn('Não foi possível salvar avatar', e)}
  }

  if(avatarInput && avatarPreview){
    loadAvatar();
    avatarInput.addEventListener('change', (ev)=>{
      const f = ev.target.files && ev.target.files[0];
      if(!f) return;
      const reader = new FileReader();
      reader.onload = function(e){
        const url = e.target.result;
        avatarPreview.src = url;
        saveAvatar(url);
      };
      reader.readAsDataURL(f);
    });
    // permitir clicar na imagem para abrir o seletor
    const wrapper = document.querySelector('.avatar-wrapper');
    if(wrapper){
      wrapper.tabIndex = 0;
      wrapper.addEventListener('keydown', e=>{ if(e.key === 'Enter' || e.key === ' ') avatarInput.click(); });
      wrapper.addEventListener('click', ()=> avatarInput.click());
    }
  }
})();
