/* ═══════════════════════════════════════════════════════
   FAGA — Filipino-American Golf Association
   Landing Page JavaScript
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── NAV SCROLL EFFECT ───
  const nav = document.getElementById('main-nav');
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── MOBILE NAV TOGGLE ───
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav when link clicked
  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── SMOOTH SCROLL TO ANCHORS ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const navHeight = nav.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── SCROLL REVEAL ANIMATIONS ───
  const revealElements = () => {
    // Mark elements for reveal
    const selectors = [
      '.section-header',
      '.about__text',
      '.stat-card',
      '.recap__card',
      '.insight',
      '.league__card',
      '.upcoming__detail',
      '.upcoming__cta-card',
      '.gallery__item',
      '.contact__info',
      '.contact__form',
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
          // Add staggered delay for cards
          if (i < 5) el.classList.add(`reveal-delay-${i + 1}`);
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  };

  revealElements();

  // ─── GALLERY LIGHTBOX ───
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  const galleryItems = document.querySelectorAll('.gallery__item');
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    const item = galleryItems[index];
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery__item-overlay span');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  };

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // ─── CONTACT FORM ───
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn__text');
  const btnLoader = submitBtn.querySelector('.btn__loader');
  const successMsg = document.getElementById('form-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const firstName = document.getElementById('form-first-name').value.trim();
    const lastName = document.getElementById('form-last-name').value.trim();
    const email = document.getElementById('form-email').value.trim();

    if (!firstName || !lastName) {
      shakeElement(document.getElementById(firstName ? 'form-last-name' : 'form-first-name'));
      return;
    }

    if (!email) {
      shakeElement(document.getElementById('form-email'));
      return;
    }

    if (!isValidEmail(email)) {
      shakeElement(document.getElementById('form-email'));
      return;
    }

    // Submit to Formspree
    btnText.setAttribute('hidden', '');
    btnLoader.removeAttribute('hidden');
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://formspree.io/f/mqegldal', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      btnText.removeAttribute('hidden');
      btnLoader.setAttribute('hidden', '');
      submitBtn.disabled = false;

      if (response.ok) {
        form.reset();
        successMsg.removeAttribute('hidden');
        successMsg.style.animation = 'fadeIn 0.4s ease';
      } else {
        alert('Something went wrong. Please try again or email us directly at hello@fagagolf.com.');
      }
    } catch (err) {
      btnText.removeAttribute('hidden');
      btnLoader.setAttribute('hidden', '');
      submitBtn.disabled = false;
      alert('Network error. Please check your connection and try again.');
    }
  });

  // ─── HELPERS ───
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight; // trigger reflow
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => { el.style.animation = ''; }, 400);
  }

  // Add shake keyframes dynamically
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // ─── PARALLAX (subtle on hero) ───
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const heroImg = document.querySelector('.hero__bg-img');
        if (heroImg && window.scrollY < window.innerHeight) {
          heroImg.style.transform = `scale(${1.05 + window.scrollY * 0.0001}) translateY(${window.scrollY * 0.15}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
});
