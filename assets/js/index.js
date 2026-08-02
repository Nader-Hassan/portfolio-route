function toggleTheme() {
  const toggleButton = document.getElementById('theme-toggle-button');
  const htmlElement = document.documentElement;
  
  if (!toggleButton) return;

  const isDark = htmlElement.classList.toggle('dark');
  
  toggleButton.setAttribute('aria-pressed', String(isDark));
  
  try {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  } catch (error) {
    console.warn('Unable to save theme preference:', error);
  }
}

function initializeTheme() {
  const toggleButton = document.getElementById('theme-toggle-button');
  const htmlElement = document.documentElement;
  
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light') {
    htmlElement.classList.remove('dark');
    toggleButton?.setAttribute('aria-pressed', 'false');
  } else {
    htmlElement.classList.add('dark');
    toggleButton?.setAttribute('aria-pressed', 'true');
  }
}

function initScrollSpy() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length === 0 || !header) return;

  const navHeight = header.offsetHeight;

  const observerOptions = {
    root: null,
    rootMargin: `-${navHeight}px 0px -60% 0px`,
    threshold: 0
  };

  let currentActiveId = null;

  const observer = new IntersectionObserver((entries) => {
    const visibleEntries = entries.filter(entry => entry.isIntersecting);

    if (visibleEntries.length === 0) return;

    visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    const activeSection = visibleEntries[0].target;
    const activeId = activeSection.id;

    if (activeId === currentActiveId) return;
    currentActiveId = activeId;

    navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    const activeLink = document.querySelector(`.nav-links a[href="#${activeId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.setAttribute('aria-current', 'page');
    }
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}


function initSmoothScroll() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const navLinksContainer = document.querySelector('.nav-links');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (!targetSection || !header) return;

      const navHeight = header.offsetHeight;
      const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      if (navLinksContainer?.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  });
}


function initMobileMenu() {
  const navLinksContainer = document.querySelector('.nav-links');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

  if (!mobileMenuBtn || !navLinksContainer) return;

  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('active');

    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    mobileMenuBtn.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'فتح القائمة');
  });

  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  });

  document.addEventListener('click', (event) => {
    const isClickInsideMenu = navLinksContainer.contains(event.target);
    const isClickOnButton = mobileMenuBtn.contains(event.target);

    if (!isClickInsideMenu && !isClickOnButton && navLinksContainer.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinksContainer.classList.contains('active')) {
      closeMobileMenu();
    }
  });
}


function closeMobileMenu() {
  const navLinksContainer = document.querySelector('.nav-links');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

  if (!navLinksContainer || !mobileMenuBtn) return;

  navLinksContainer.classList.remove('active');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
  mobileMenuBtn.setAttribute('aria-label', 'فتح القائمة');
}



document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('theme-toggle-button');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleTheme);
  }
  initializeTheme();
  initScrollSpy();
  initSmoothScroll();
  initMobileMenu();
});