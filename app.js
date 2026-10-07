(function(){
  var K='reos-lang';
  function apply(l){
    document.documentElement.lang=l;
    document.querySelectorAll('[data-en]').forEach(function(n){
      if(!n.dataset.it) n.dataset.it=n.innerHTML;
      n.innerHTML = l==='en' ? n.dataset.en : n.dataset.it;
    });
    document.querySelectorAll('[data-en-ph]').forEach(function(n){
      if(!n.dataset.itPh) n.dataset.itPh=n.placeholder;
      n.placeholder = l==='en' ? n.dataset.enPh : n.dataset.itPh;
    });
    document.querySelectorAll('.lang button').forEach(function(b){
      b.setAttribute('aria-pressed', String(b.dataset.l===l));
    });
    try{localStorage.setItem(K,l)}catch(e){}
  }
  document.querySelectorAll('.lang button').forEach(function(b){
    b.addEventListener('click',function(){apply(b.dataset.l)});
  });
  var saved='it'; try{saved=localStorage.getItem(K)||'it'}catch(e){}
  apply(saved);

  // one page: a link to #slug opens that panel and scrolls to it
  function open(id){
    var c=document.getElementById(id);
    if(!c||c.tagName!=='DETAILS') return false;
    c.open=true;
    c.scrollIntoView({behavior:'smooth',block:'start'});
    return true;
  }
  document.querySelectorAll('a.go').forEach(function(a){
    a.addEventListener('click',function(e){
      var id=(a.getAttribute('href')||'').replace('#','');
      if(open(id)){e.preventDefault(); history.replaceState(null,'','#'+id);}
    });
  });
  if(location.hash) setTimeout(function(){open(location.hash.slice(1))},60);
  window.addEventListener('hashchange',function(){open(location.hash.slice(1))});

  var f=document.getElementById('f'),
      cnt=document.getElementById('cnt'),
      empty=document.getElementById('empty'),
      cards=[].slice.call(document.querySelectorAll('.card')),
      role='';
  function count(n){
    if(!cnt) return;
    cnt.textContent=n+' / '+cards.length;   // numbers need no translation
    cnt.style.visibility=(n===cards.length?'hidden':'visible');
  }
  function apply_filter(){
    var q=f?f.value.trim().toLowerCase():'', n=0;
    cards.forEach(function(c){
      var okq=!q||(c.dataset.all||'').toLowerCase().indexOf(q)>-1
               ||c.textContent.toLowerCase().indexOf(q)>-1;
      var okr=!role||(' '+(c.dataset.roles||'')+' ').indexOf(' '+role+' ')>-1;
      var hit=okq&&okr;
      c.style.display=hit?'':'none'; if(hit)n++;
    });
    if(empty) empty.style.display=n?'none':'';
    document.querySelectorAll('.cards').forEach(function(g){
      var any=[].slice.call(g.querySelectorAll('.card'))
                .some(function(c){return c.style.display!=='none'});
      g.style.display=any?'':'none';
      var h=g.previousElementSibling;
      if(h&&h.classList.contains('sec')) h.style.display=any?'':'none';
    });
    count(n);
  }
  if(f) f.addEventListener('input',apply_filter);
  document.querySelectorAll('.rb').forEach(function(b){
    b.addEventListener('click',function(){
      role=b.dataset.r||'';
      document.querySelectorAll('.rb').forEach(function(x){
        x.classList.toggle('on',x===b);
      });
      apply_filter();
    });
  });
  apply_filter();

  // the phase map lights up the cards of the phase you are pointing at
  document.querySelectorAll('svg.map a.go').forEach(function(a){
    var id=(a.getAttribute('href')||'').replace('#','');
    a.addEventListener('mouseenter',function(){
      var c=document.getElementById(id); if(c) c.classList.add('hl');
    });
    a.addEventListener('mouseleave',function(){
      var c=document.getElementById(id); if(c) c.classList.remove('hl');
    });
  });
})();
