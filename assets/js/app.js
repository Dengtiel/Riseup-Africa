// Small interactivity for prototype: handle admin buttons (approve/request/start)
document.addEventListener('DOMContentLoaded', function(){
  // init AOS if available (Animate On Scroll)
  if(window.AOS && typeof AOS.init === 'function'){
    AOS.init({duration:700,once:true,easing:'ease-out-cubic'});
  }

  // on load, check auth state and adjust UI (show profile, admin links)
  (async function(){
    try{
      var res = await fetch('/api/me');
      var j = await res.json();
      if(j && j.authenticated){
        var nodes = [document.getElementById('loginBtn'), document.getElementById('loginBtnHeader'), document.getElementById('loginBtnMobile')];
        nodes.forEach(function(n){ if(n){ n.textContent = 'Profile'; n.classList.remove('btn-outline-primary'); n.classList.add('btn-outline-secondary'); n.href = 'profile.html'; } });
        // show profile icon(s) if present
        try{
          var icons = [document.getElementById('profileIcon'), document.getElementById('profileIconHeader'), document.getElementById('profileIconNav')];
          icons.forEach(function(ic){ if(ic){ ic.classList.remove('d-none'); ic.href = 'profile.html'; } });
        }catch(e){}
        // show admin console if role indicates admin or field team
        try{
          if(j.role && (j.role === 'admin' || j.role === 'field')){
            var adminBtn = document.getElementById('adminConsoleBtn'); if(adminBtn) adminBtn.classList.remove('d-none');
          }
        }catch(e){}
      }
    }catch(e){ /* ignore */ }
  })();

  document.body.addEventListener('click', function(e){
    var btn = e.target.closest('[data-action]');
    if(!btn) return;
    var action = btn.getAttribute('data-action');
    if(action === 'approve'){
      if(!confirm('Approve this youth?')) return;
      // show spinner
      var orig = btn.innerHTML;
      btn.innerHTML = '<span class="spinner-inline" aria-hidden="true"></span> Approving';
      btn.disabled = true;
      setTimeout(function(){
        btn.innerHTML = 'Approved';
        btn.classList.remove('btn-success');
        btn.classList.add('btn-secondary');
        var row = btn.closest('tr');
        if(row){
          var cell = row.querySelector('td:nth-child(2)');
          if(cell) cell.innerHTML = '<span class="badge bg-success">Verified</span>';
        }
      },900);
    }
    if(action === 'request'){
      var reason = prompt('Enter request message for the youth (optional):','Missing ID document');
      if(reason === null) return; // cancelled
      btn.classList.add('btn-warning');
      btn.disabled = true;
      btn.textContent = 'Requested';
    }
    if(action === 'start-visit'){
      if(!confirm('Start field visit process?')) return;
      btn.textContent = 'In progress';
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline-primary');
    }
  });

  // profile form submit: POST to backend /api/youth then upload files
  var profileForm = document.getElementById('profileForm');
  if(profileForm){
    profileForm.addEventListener('submit', async function(ev){
      ev.preventDefault();
      var btn = profileForm.querySelector('button[type=submit]');
      var orig = btn.innerHTML;
      btn.innerHTML = '<span class="spinner-inline" aria-hidden="true"></span> Submitting';
      btn.disabled = true;
      try{
        // build profile JSON
        var data = {
          fullName: profileForm.querySelector('input[name="fullName"]').value,
          category: profileForm.querySelector('select[name="category"]') ? profileForm.querySelector('select[name="category"]').value : '',
          country: profileForm.querySelector('input[name="country"]').value,
          camp: profileForm.querySelector('input[name="camp"]').value,
          issuer: profileForm.querySelector('input[name="issuer"]').value,
          notes: profileForm.querySelector('textarea[name="notes"]').value
        };
        // indicate we want to submit this profile for verification immediately
        data.submit = true;
        // create profile
        var res = await fetch('/api/youth', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
        var j = await res.json();
        if(!res.ok){ alert('Error creating profile: '+(j.error||res.statusText)); btn.innerHTML = orig; btn.disabled = false; return; }
        var id = j.id;
        // upload files if present
        var toUpload = [];
        var docsInput = profileForm.querySelector('input[name="docs"]');
        var letterInput = profileForm.querySelector('input[name="letter"]');
        if(docsInput && docsInput.files && docsInput.files.length){ toUpload.push({field:'docs',file:docsInput.files[0]}); }
        if(letterInput && letterInput.files && letterInput.files.length){ toUpload.push({field:'letter',file:letterInput.files[0]}); }
        for(var f of toUpload){
          var fd = new FormData();
          // backend accepts key 'file' (and handles 'docs'/'letter')
          fd.append('file', f.file, f.file.name);
          try{
            var up = await fetch('/api/upload/'+id, {method:'POST', body: fd});
            var upj = await up.json();
            if(!up.ok){ console.warn('Upload failed', upj); }
          }catch(e){ console.warn('Upload error', e); }
        }
        alert('Profile submitted for verification.');
        window.location.href = 'youth_dashboard.html';
      }catch(err){
        console.error(err); alert('Submission error');
      }
      btn.innerHTML = orig; btn.disabled = false;
    });
  }

  // Theme toggle: remember in localStorage
  var themeToggle = document.getElementById('themeToggle');
  function applyTheme(){
    var dark = localStorage.getItem('r4_dark') === '1';
    if(dark) document.documentElement.classList.add('dark-mode'); else document.documentElement.classList.remove('dark-mode');
    if(themeToggle) themeToggle.innerHTML = dark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
  }
  applyTheme();
  if(themeToggle){
    themeToggle.addEventListener('click', function(){
      var isDark = document.documentElement.classList.toggle('dark-mode');
      localStorage.setItem('r4_dark', isDark ? '1' : '0');
      applyTheme();
    });
  }

  // Open login modal from nav
  var loginBtn = document.getElementById('loginBtn');
  if(loginBtn){
    loginBtn.addEventListener('click', function(e){
      e.preventDefault();
      var modalEl = document.getElementById('loginModal');
      if(modalEl){
        var m = new bootstrap.Modal(modalEl);
        m.show();
      }
    });
  }

  // Header login / theme handlers (moved controls)
  var loginBtnHeader = document.getElementById('loginBtnHeader');
  if(loginBtnHeader){
    loginBtnHeader.addEventListener('click', function(e){ e.preventDefault(); var modalEl = document.getElementById('loginModal'); if(modalEl){ new bootstrap.Modal(modalEl).show(); } });
  }
  var loginBtnMobile = document.getElementById('loginBtnMobile');
  if(loginBtnMobile){ loginBtnMobile.addEventListener('click', function(e){ e.preventDefault(); var modalEl = document.getElementById('loginModal'); if(modalEl){ new bootstrap.Modal(modalEl).show(); } }); }

  var themeToggleHeader = document.getElementById('themeToggleHeader');
  if(themeToggleHeader){ themeToggleHeader.addEventListener('click', function(){ var isDark = document.documentElement.classList.toggle('dark-mode'); localStorage.setItem('r4_dark', isDark ? '1':'0'); applyTheme(); }); }
  var themeToggleMobile = document.getElementById('themeToggleMobile');
  if(themeToggleMobile){ themeToggleMobile.addEventListener('click', function(){ var isDark = document.documentElement.classList.toggle('dark-mode'); localStorage.setItem('r4_dark', isDark ? '1':'0'); applyTheme(); }); }

  // Handle login form (call backend /api/login)
  var loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', async function(ev){
      ev.preventDefault();
      var submitBtn = loginForm.querySelector('button[type=submit]');
      var orig = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner-inline" aria-hidden="true"></span> Signing in';
      submitBtn.disabled = true;
      try{
        var email = loginForm.querySelector('input[type="email"]').value;
        var password = loginForm.querySelector('input[type="password"]').value;
        var res = await fetch('/api/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: email, password: password})});
        var j = await res.json();
        if(res.ok && j.ok){
          var modalEl = document.getElementById('loginModal');
          if(modalEl){ var m = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl); m.hide(); }
          // update all login buttons to Profile
          var nodes = [document.getElementById('loginBtn'), document.getElementById('loginBtnHeader'), document.getElementById('loginBtnMobile')];
          nodes.forEach(function(n){ if(n){ n.textContent = 'Profile'; n.classList.remove('btn-outline-primary'); n.classList.add('btn-outline-secondary'); n.href = 'profile.html'; } });
          alert('Signed in as '+(j.name||j.email));
          // if a pending opportunity was saved before login, submit it now
          try{
            if(window.pendingOpportunity){
              (async function(payload){
                try{
                  var r = await fetch('/api/opportunities', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
                  var jr = await r.json();
                  if(r.status === 201 && jr.id){
                    // clear pending and navigate to detail
                    window.pendingOpportunity = null;
                    window.location.href = 'opportunity_detail.html?id=' + encodeURIComponent(jr.id);
                  } else {
                    console.warn('Failed to resume pending opportunity', jr);
                  }
                }catch(e){ console.error('Resume publish error', e); }
              })(window.pendingOpportunity);
            }
          }catch(e){ console.warn('resume error', e); }
        } else {
          alert('Sign in failed: '+(j.error||res.statusText));
        }
      }catch(e){ console.error(e); alert('Network error'); }
      submitBtn.innerHTML = orig; submitBtn.disabled = false;
    });
  }

  // --- Search expansion + autocomplete/typeahead (server-backed with client fallback) ---
  (function(){
    var navSearch = document.querySelector('.nav-search, .nav-search-header');
    if(!navSearch) return;
    var input = navSearch.querySelector('input[type="search"], input[aria-label], .form-control') || navSearch.querySelector('input');
    if(!input) return;

    // expansion on focus
    input.addEventListener('focus', function(){ navSearch.classList.add('expanded'); });
    input.addEventListener('blur', function(){ setTimeout(function(){ navSearch.classList.remove('expanded'); }, 200); });

    // create typeahead container
    var ta = document.createElement('div'); ta.className = 'typeahead d-none';
    navSearch.appendChild(ta);

    // sample static suggestions for prototype (fallback)
    var suggestions = [
      'STEM Scholarship 2025', 'Tech Internship — Nairobi', 'Vocational Program – Solar', 'Open Scholars · Fellowship', 'Agritech Bootcamp', 'Healthcare Training Grant', 'Women in STEM Mentorship', 'Remote Research Assistant'
    ];

    var matches = [];
    var selected = -1;
    var debounceTimer = null;

    function render(){
      ta.innerHTML = '';
      if(matches.length === 0){ ta.classList.add('d-none'); return; }
      matches.forEach(function(item, idx){
        var el = document.createElement('div'); el.className = 'item'+(idx===selected? ' active':''); el.textContent = item; el.setAttribute('data-idx', idx);
        el.addEventListener('mousedown', function(ev){ ev.preventDefault(); choose(idx); });
        ta.appendChild(el);
      });
      ta.classList.remove('d-none');
    }

    function choose(idx){
      if(idx<0 || idx>=matches.length) return;
      input.value = matches[idx];
      ta.classList.add('d-none');
      // prototype action: navigate to opportunity_detail for demo when choosing an opportunity-like item
      if(matches[idx].toLowerCase().includes('stem')) window.location.href = 'opportunity_detail.html';
    }

    function fetchSuggestions(q){
      // if page served from file:// we can't call the backend reliably — use fallback
      if(window.location.protocol === 'file:'){
        return Promise.resolve(suggestions.filter(function(s){ return s.toLowerCase().indexOf(q.toLowerCase()) !== -1; }).slice(0,8));
      }

      if(!q) return Promise.resolve([]);
      // call backend /api/search?q= — backend returns array of {type,id,text}
      return fetch('/api/search?q='+encodeURIComponent(q)).then(function(res){
        if(!res.ok) return [];
        return res.json();
      }).then(function(data){
        if(!Array.isArray(data)) return [];
        return data.map(function(it){ return it.text; }).slice(0,8);
      }).catch(function(){
        // on error, use local suggestions
        return suggestions.filter(function(s){ return s.toLowerCase().indexOf(q.toLowerCase()) !== -1; }).slice(0,8);
      });
    }

    input.addEventListener('input', function(){
      var q = input.value.trim();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function(){
        if(q.length < 1){ matches = []; selected = -1; render(); return; }
        fetchSuggestions(q).then(function(arr){
          if(Array.isArray(arr) && arr.length){
            matches = arr.slice(0,8);
          } else {
            matches = suggestions.filter(function(s){ return s.toLowerCase().indexOf(q.toLowerCase()) !== -1; }).slice(0,8);
          }
          selected = -1; render();
        });
      }, 180);
    });

    input.addEventListener('keydown', function(e){
      if(ta.classList.contains('d-none')) return;
      if(e.key === 'ArrowDown'){ e.preventDefault(); selected = Math.min(selected+1, matches.length-1); render(); scrollIntoView(); }
      else if(e.key === 'ArrowUp'){ e.preventDefault(); selected = Math.max(selected-1, 0); render(); scrollIntoView(); }
      else if(e.key === 'Enter'){ e.preventDefault(); if(selected === -1) { if(input.value.trim()) { /* fallback search */ alert('Search: '+input.value); } } else choose(selected); }
      else if(e.key === 'Escape'){ ta.classList.add('d-none'); }
    });

    function scrollIntoView(){ var active = ta.querySelector('.item.active'); if(active) active.scrollIntoView({block:'nearest'}); }

    // close on outside click
    document.addEventListener('click', function(ev){ if(!navSearch.contains(ev.target)) ta.classList.add('d-none'); });
  })();
});
