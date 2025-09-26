// --- Utilities ---
function closeAllDropdowns(except = null){
  document.querySelectorAll('.dropdown[aria-expanded="true"]').forEach(dd=>{
    if (dd !== except) dd.setAttribute('aria-expanded','false');
  });
}

function initUI(cfg){
  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');
  hamburger?.addEventListener('click', (e)=>{
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
    if (!open) closeAllDropdowns();
  });

  // Dropdowns (normal ones only)
  document.querySelectorAll('.dropdown > button').forEach(btn=>{
    // skip faculty button
    if (btn.id === "faculty-btn") return;
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const dd = btn.parentElement;
      const isOpen = dd.getAttribute('aria-expanded') === 'true';
      closeAllDropdowns(dd);
      dd.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Inside dropdowns
  document.querySelectorAll('.dropdown .dropdown-menu').forEach(menuEl=>{
    menuEl.addEventListener('click', (e)=> e.stopPropagation());
  });

  // Click outside
  document.addEventListener('click', ()=>{
    closeAllDropdowns();
    if (menu?.classList.contains('open')) {
      menu.classList.remove('open');
      hamburger?.setAttribute('aria-expanded','false');
    }
  });

  // Esc key
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape'){
      closeAllDropdowns();
      if (menu?.classList.contains('open')){
        menu.classList.remove('open');
        hamburger?.setAttribute('aria-expanded','false');
      }
    }
  });

  // --- Scheduled reveal ---
  const target = new Date(cfg?.targetDate || '2099-01-01T00:00:00');
  if (!isNaN(target) && new Date() >= target){
    document.getElementById('scheduled')?.classList.remove('gated');
  }

  // --- Faculty Zone password gate ---
  const facultyDD = document.getElementById('faculty-dd');
const facultyBtn = document.getElementById('faculty-btn');
const pwDialog  = document.getElementById('pwDialog');
const pwForm    = document.getElementById('pwForm');
const pwInput   = document.getElementById('pwInput');
const pwErr     = document.getElementById('pwErr');
const pwCancel  = document.getElementById('pwCancel');

const facultyPass = "faculty2025"; // or pull from config.json

function openPwDialog(){
  pwErr.textContent = '';
  pwInput.value = '';
  pwDialog.showModal();
}

// Intercept Faculty Zone button
facultyBtn?.addEventListener('click', (e)=>{
  if (facultyDD.classList.contains('locked')){
    e.preventDefault();
    e.stopPropagation();
    openPwDialog();
  }
});

// Handle submit
pwForm?.addEventListener('submit', (e)=>{
  e.preventDefault();
  if (pwInput.value === facultyPass){
    pwDialog.close();
    // Redirect to faculty page
    window.location.href = "faculty/faculty.html"; 
  } else {
    pwErr.textContent = 'Wrong password.';
  }
});

// Cancel button
pwCancel?.addEventListener('click', ()=>{
  pwDialog.close();
});
}

// Initialize with defaults first
initUI({ targetDate: '2099-01-01T00:00:00', facultyPassword: 'faculty2025' });

// Then override with config.json
fetch('config.json')
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(cfg => initUI(cfg))
  .catch(()=>{ /* ignore if config.json missing */ });
