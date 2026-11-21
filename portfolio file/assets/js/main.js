/**
 * Daksh Vyas — Video Editor Portfolio Interactive Script
 * Warm Dark (#0E0C0A) + Amber (#E9AE4A) Theme
 */

document.addEventListener('DOMContentLoaded', () => {
  setupProfilePhoto();
  setupNavigation();
  setupProjectFilters();
  setupVideoLightbox();
  setupComparisonToggle();
  setupContactForm();
  setupCopyrightYear();
});

/**
 * 1. Automatic Photo Detection & Assignment
 */
function setupProfilePhoto() {
  const profileImg = document.getElementById('profile-img');
  if (!profileImg) return;

  // Use the professionally edited profile.jpg
  const candidatePaths = [
    'assets/images/profile.jpg',
    'profile.jpg',
    'profile.png'
  ];

  function tryNext(index) {
    if (index >= candidatePaths.length) return;
    const testImg = new Image();
    testImg.onload = function () {
      profileImg.src = candidatePaths[index];
    };
    testImg.onerror = function () {
      tryNext(index + 1);
    };
    testImg.src = candidatePaths[index];
  }

  tryNext(0);
}

/**
 * 2. Navigation Behavior & Mobile Drawer
 */
function setupNavigation() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link');

  // Navbar blur & shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile drawer toggle
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
      const isOpen = drawer.classList.contains('open');
      toggleBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close drawer on clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }
}

/**
 * 3. Project Filter Tabs
 */
function setupProjectFilters() {
  const filterChips = document.querySelectorAll('.filter-chip');
  const projectCards = document.querySelectorAll('.project-card');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterValue = chip.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 4. Video Lightbox Player with Google Drive & Video Embed Support
 */
function setupVideoLightbox() {
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-video-title');
  const modalIframe = document.getElementById('modal-iframe');
  const modalDirectLink = document.getElementById('modal-direct-link');
  const triggerBtns = document.querySelectorAll('[data-video-url]');

  if (!modal) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const rawUrl = btn.getAttribute('data-video-url');
      const title = btn.getAttribute('data-video-title') || 'Featured Video Edit';

      // Convert Google Drive view URL to embeddable preview URL
      let embedUrl = rawUrl;
      if (rawUrl.includes('drive.google.com/file/d/')) {
        embedUrl = rawUrl.replace(/\/view(\?.*)?$/, '/preview');
      }

      if (modalTitle) modalTitle.textContent = title;
      if (modalIframe) {
        modalIframe.src = embedUrl;
      }
      if (modalDirectLink) {
        modalDirectLink.href = rawUrl;
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    if (modalIframe) modalIframe.src = '';
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * 5. Interactive Raw vs Final Color Grade Toggle
 */
function setupComparisonToggle() {
  const toggleBtn = document.getElementById('toggle-grade-btn');
  const previewBox = document.getElementById('grade-preview-box');
  const gradeLabel = document.getElementById('grade-mode-label');

  if (!toggleBtn || !previewBox || !gradeLabel) return;

  let isGraded = true;

  toggleBtn.addEventListener('click', () => {
    isGraded = !isGraded;
    if (isGraded) {
      previewBox.style.filter = 'none';
      gradeLabel.textContent = 'FINAL: COLOR-GRADED & POLISHED';
      gradeLabel.style.color = 'var(--accent)';
      toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i> View Raw LOG Profile';
    } else {
      previewBox.style.filter = 'saturate(0.3) contrast(0.85) brightness(1.1)';
      gradeLabel.textContent = 'BEFORE: FLAT RAW LOG FOOTAGE';
      gradeLabel.style.color = 'var(--muted)';
      toggleBtn.innerHTML = '<i class="fas fa-magic"></i> View Color-Graded Cut';
    }
  });
}

/**
 * 6. Contact Form Submission
 */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending Inquiry...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Inquiry Received!';
      btn.style.backgroundColor = '#10B981';
      btn.style.color = '#fff';

      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.style.color = 'var(--accent)';
        statusMsg.textContent = 'Thank you! Daksh will review your project and reply within a few hours.';
      }

      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.disabled = false;
        if (statusMsg) statusMsg.style.display = 'none';
      }, 5000);
    }, 1000);
  });
}

/**
 * 7. Copyright Year
 */
function setupCopyrightYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
