document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTyping();
  initSkillBars();
  initSkillToggles();
  initTabs();
  initModals();
  initPageAnimations();
  initStatusLine();
});

// ====== NAVIGATION ======
function initNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '≡';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.textContent = '≡';
      });
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ====== TYPING EFFECT ======
function initTyping() {
  const el = document.querySelector('[data-typing]');
  if (!el) return;

  const texts = JSON.parse(el.dataset.typing);
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      el.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentText.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  type();
}

// ====== SKILL BARS ======
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.level + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

// ====== SKILL CATEGORY TOGGLES ======
function initSkillToggles() {
  document.querySelectorAll('.skill-category-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const toggle = header.querySelector('.skill-category-toggle');
      const isOpen = body.style.display !== 'none';

      body.style.display = isOpen ? 'none' : 'grid';
      if (toggle) toggle.classList.toggle('open', !isOpen);
    });
  });
}

// ====== TABS ======
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabContainer => {
    const tabs = tabContainer.querySelectorAll('.tab');
    const contents = tabContainer.parentElement.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.tab);
        if (target) target.classList.add('active');
      });
    });
  });
}

// ====== PROJECT MODALS ======
function initModals() {
  const overlay = document.querySelector('.modal-overlay');
  if (!overlay) return;

  const modalTitle = overlay.querySelector('.modal-title');
  const modalBody = overlay.querySelector('.modal-body');

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.project-title').textContent;
      const org = card.querySelector('.project-org').textContent;
      const desc = card.dataset.fullDescription || card.querySelector('.project-desc').textContent;
      const techs = card.querySelector('.project-tech');
      const date = card.dataset.date || '';

      modalTitle.textContent = title;
      const github = card.dataset.github;
      modalBody.innerHTML = `
        <p style="color: var(--secondary); margin-bottom: 16px;">${org}${date ? ' | ' + date : ''}</p>
        <p>${desc}</p>
        ${github ? `<div style="margin-top: 16px;"><a href="${github}" target="_blank" class="btn" style="display:inline-flex;">[ VIEW ON GITHUB ]</a></div>` : ''}
        ${techs ? `<div class="modal-tech">${techs.innerHTML}</div>` : ''}
      `;

      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('.modal-close')) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ====== PAGE ANIMATIONS ======
function initPageAnimations() {
  const elements = document.querySelectorAll('.card, .project-card, .exp-item, .award-item, .edu-item, .skill-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 50);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'opacity 0.4s, transform 0.4s';
    observer.observe(el);
  });
}

// ====== STATUS LINE ======
function initStatusLine() {
  const statusTime = document.getElementById('status-time');
  if (!statusTime) return;

  function updateTime() {
    const now = new Date();
    statusTime.textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }

  updateTime();
  setInterval(updateTime, 1000);
}
