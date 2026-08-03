const COLOR_THEMES = [
  { id: 'violet',  primary: '#6366f1', secondary: '#8b5cf6', accent: '#a855f7' },
  { id: 'coral',   primary: '#ec4899', secondary: '#f97316', accent: '#fb923c' },
  { id: 'emerald', primary: '#10b981', secondary: '#059669', accent: '#34d399' },
  { id: 'sky',     primary: '#3b82f6', secondary: '#06b6d4', accent: '#22d3ee' },
  { id: 'rose',    primary: '#ef4444', secondary: '#f43f5e', accent: '#fb7185' },
  { id: 'amber',   primary: '#f59e0b', secondary: '#ea580c', accent: '#fbbf24' },
];

const FONTS = ['alexandria', 'tajawal', 'cairo'];
const DEFAULT_FONT = 'tajawal';
const DEFAULT_COLOR = 'violet';

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
    const activeId = visibleEntries[0].target.id;
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

      const navLinksContainer = document.querySelector('.nav-links');
      if (navLinksContainer?.classList.contains('active')) {
        closeMobileMenu();
      }
    });
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

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinksContainer.classList.contains('active')) {
      closeMobileMenu();
    }
  });
}

function populateColorGrid() {
  const themeColorsGrid = document.getElementById('theme-colors-grid');
  if (!themeColorsGrid) return;

  themeColorsGrid.innerHTML = '';

  COLOR_THEMES.forEach(theme => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'color-option relative w-12 h-12 rounded-full border-2 border-transparent hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900';
    btn.style.backgroundColor = theme.primary;
    btn.dataset.color = theme.id;
    btn.setAttribute('aria-label', `اختيار لون ${theme.id}`);
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');

    const check = document.createElement('span');
    check.className = 'pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200';
    check.innerHTML = '<i class="fa-solid fa-check text-white text-sm drop-shadow-md"></i>';
    btn.appendChild(check);

    themeColorsGrid.appendChild(btn);
  });
}

function applyFont(fontName) {
  const body = document.body;
  if (!body) return;

  FONTS.forEach(font => body.classList.remove(`font-${font}`));
  body.classList.add(`font-${fontName}`);

  const fontOptions = document.querySelectorAll('.font-option');
  fontOptions.forEach(btn => {
    const isSelected = btn.dataset.font === fontName;
    btn.classList.toggle('active', isSelected);
    btn.setAttribute('aria-checked', String(isSelected));
  });

  try {
    localStorage.setItem('settings-font', fontName);
  } catch (e) {
    console.warn('Failed to save font preference:', e);
  }
}

function applyColor(colorId) {
  const theme = COLOR_THEMES.find(c => c.id === colorId);
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-secondary', theme.secondary);
  root.style.setProperty('--color-accent', theme.accent);

  document.querySelectorAll('.color-option').forEach(btn => {
    const isSelected = btn.dataset.color === colorId;
    btn.classList.toggle('active', isSelected);
    btn.setAttribute('aria-checked', String(isSelected));

    const check = btn.querySelector('span');
    if (check) {
      check.style.opacity = isSelected ? '1' : '0';
    }

    if (isSelected) {
      btn.classList.add('ring-2', 'ring-white', 'dark:ring-slate-800', 'shadow-lg');
      btn.classList.remove('border-transparent');
    } else {
      btn.classList.remove('ring-2', 'ring-white', 'dark:ring-slate-800', 'shadow-lg');
      btn.classList.add('border-transparent');
    }
  });

  try {
    localStorage.setItem('settings-color', colorId);
  } catch (e) {
    console.warn('Failed to save color preference:', e);
  }
}

function toggleSidebar(forceOpen) {
  const settingsSidebar = document.getElementById('settings-sidebar');
  const settingsToggle = document.getElementById('settings-toggle');

  if (!settingsSidebar || !settingsToggle) return;

  const isCurrentlyOpen = !settingsSidebar.classList.contains('translate-x-full');
  const shouldOpen = forceOpen !== undefined ? forceOpen : !isCurrentlyOpen;

  settingsSidebar.classList.toggle('translate-x-full', !shouldOpen);
  settingsSidebar.setAttribute('aria-hidden', String(!shouldOpen));
  settingsToggle.setAttribute('aria-expanded', String(shouldOpen));
  settingsToggle.classList.toggle('opacity-0', shouldOpen);
  settingsToggle.classList.toggle('pointer-events-none', shouldOpen);
}

function closeSidebar() {
  toggleSidebar(false);
}

function resetSettings() {
  applyFont(DEFAULT_FONT);
  applyColor(DEFAULT_COLOR);

  try {
    localStorage.removeItem('settings-font');
    localStorage.removeItem('settings-color');
  } catch (e) {
    console.warn('Failed to clear settings:', e);
  }
}

function initializeSettings() {
  populateColorGrid();

  const savedFont = localStorage.getItem('settings-font');
  const savedColor = localStorage.getItem('settings-color');

  const fontToApply = savedFont && FONTS.includes(savedFont) ? savedFont : DEFAULT_FONT;
  const colorToApply = savedColor && COLOR_THEMES.some(c => c.id === savedColor)
    ? savedColor
    : DEFAULT_COLOR;

  applyFont(fontToApply);
  applyColor(colorToApply);
}

function initSettingsEvents() {
  const settingsToggle = document.getElementById('settings-toggle');
  const closeSettingsBtn = document.getElementById('close-settings');
  const themeColorsGrid = document.getElementById('theme-colors-grid');
  const resetSettingsBtn = document.getElementById('reset-settings');
  const settingsSidebar = document.getElementById('settings-sidebar');

  if (settingsToggle) {
    settingsToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar(true);
    });
  }

  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSidebar();
    });
  }

  const fontsContainer = document.querySelector('[role="radiogroup"]');
  if (fontsContainer) {
    fontsContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.target.closest('.font-option');
      if (!btn) return;

      const fontName = btn.dataset.font;
      if (fontName) applyFont(fontName);
    });
  }

  if (themeColorsGrid) {
    themeColorsGrid.addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.target.closest('.color-option');
      if (!btn) return;

      const colorId = btn.dataset.color;
      if (colorId) applyColor(colorId);
    });
  }

  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetSettings();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const isOpen = settingsSidebar && !settingsSidebar.classList.contains('translate-x-full');
      if (isOpen) closeSidebar();
    }
  });
}

function initPortfolioFilter() {
  const filterContainer = document.getElementById('portfolio-filters');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (!filterContainer || portfolioItems.length === 0) return;

  const ACTIVE_CLASSES = [
    'bg-linear-to-r', 'from-primary', 'to-secondary', 'text-white',
    'hover:shadow-lg', 'hover:shadow-primary/50'
  ];

  const INACTIVE_CLASSES = [
    'bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300',
    'border', 'border-slate-300', 'dark:border-slate-700'
  ];

  portfolioItems.forEach(item => {
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });

  function setButtonState(button, isActive) {
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));

    if (isActive) {
      button.classList.remove(...INACTIVE_CLASSES);
      button.classList.add(...ACTIVE_CLASSES);
    } else {
      button.classList.remove(...ACTIVE_CLASSES);
      button.classList.add(...INACTIVE_CLASSES);
    }
  }

  filterContainer.addEventListener('click', (event) => {
    const button = event.target.closest('.portfolio-filter');
    if (!button || button.classList.contains('active')) return;

    const filterValue = button.dataset.filter;
    filterContainer.querySelectorAll('.portfolio-filter').forEach(btn => {
      setButtonState(btn, btn === button);
    });

    portfolioItems.forEach(item => {
      const category = item.dataset.category;
      const shouldShow = filterValue === 'all' || category === filterValue;
      const isHidden = item.classList.contains('hidden');

      if (shouldShow && isHidden) {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        item.classList.remove('hidden');
        void item.offsetWidth;
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      } else if (!shouldShow && !isHidden) {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';

        setTimeout(() => {
          item.classList.add('hidden');
        }, 300);
      }
    });
  });
}

function initTestimonialsCarousel() {
  const carousel = document.getElementById('testimonials-carousel');
  const cards = document.querySelectorAll('.testimonial-card');
  const nextBtn = document.getElementById('next-testimonial');
  const prevBtn = document.getElementById('prev-testimonial');
  const indicatorsContainer = document.querySelector('#testimonials [role="tablist"]');
  const carouselWrapper = carousel?.closest('.overflow-hidden');

  if (!carousel || cards.length === 0 || !carouselWrapper) return;

  let currentIndex = 0;
  let autoPlayInterval = null;
  const AUTO_PLAY_DELAY = 5000;

  function getCardsPerView() {
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 640) return 2;
    return 1;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getCardsPerView());
  }

  function getSlideWidth() {
    return carouselWrapper.clientWidth / getCardsPerView();
  }

  function updateCarousel() {
    const maxIndex = getMaxIndex();
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

    const slideWidth = getSlideWidth();
    carousel.style.transform = `translateX(${currentIndex * slideWidth}px)`;

    updateIndicators();
  }

  function updateIndicators() {
    if (!indicatorsContainer) return;
    indicatorsContainer.querySelectorAll('.carousel-indicator').forEach((dot, i) => {
      const isActive = i === currentIndex;
      dot.classList.toggle('bg-accent', isActive);
      dot.classList.toggle('bg-slate-400', !isActive);
      dot.classList.toggle('dark:bg-slate-600', !isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  }

  function generateIndicators() {
    if (!indicatorsContainer) return;
    const maxIndex = getMaxIndex();
    indicatorsContainer.innerHTML = '';

    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `carousel-indicator w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer ${i === currentIndex ? 'bg-accent' : 'bg-slate-400 dark:bg-slate-600'}`;
      dot.dataset.index = i;
      dot.role = 'tab';
      dot.setAttribute('aria-label', `التوصية ${i + 1}`);
      dot.setAttribute('aria-selected', String(i === currentIndex));

      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
        resetAutoPlay();
      });

      indicatorsContainer.appendChild(dot);
    }
  }

  function nextSlide() {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateCarousel();
  }

  function prevSlide() {
    const maxIndex = getMaxIndex();
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateCarousel();
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
    carouselWrapper.addEventListener('mouseleave', startAutoPlay);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      generateIndicators();
      updateCarousel();
    }, 150);
  });

  generateIndicators();
  updateCarousel();
  startAutoPlay();
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
  initializeSettings();
  initSettingsEvents();
  initPortfolioFilter();
  initTestimonialsCarousel();
});