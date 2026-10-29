(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const KEY = 'sajanJadonOwnerSettingsDraftV3';

  const defaults = {
    brand: 'SAJAN JADON',
    headline: 'Create something unforgettable.',
    subtitle: 'Creative visuals, meaningful stories and collaborations.',
    buttonText: 'Explore my work',
    accent: '#a78bfa',
    background: '#080811',
    footer: 'WEBSITE CREATED BY CHETAN MITTAL',
    seoTitle: 'Sajan Jadon — Creative Studio',
    seoDescription: 'Explore the creative portfolio and collaboration studio of Sajan Jadon.',
    contactLabel: 'Let us collaborate',
    theme: 'dark'
  };

  const ids = {
    brand: 'opBrand',
    headline: 'opHeadline',
    subtitle: 'opSubtitle',
    buttonText: 'opButtonText',
    accent: 'opAccent',
    background: 'opBackground',
    footer: 'opFooter',
    seoTitle: 'opSeoTitle',
    seoDescription: 'opSeoDescription',
    contactLabel: 'opContactLabel',
    theme: 'opTheme'
  };

  function getValues() {
    const data = {};
    for (const [key, id] of Object.entries(ids)) {
      const field = $(id);
      data[key] = field ? field.value : defaults[key];
    }
    return data;
  }

  function fill(data) {
    for (const [key, id] of Object.entries(ids)) {
      const field = $(id);
      if (field) field.value = data[key] ?? defaults[key];
    }
    preview();
  }

  function preview() {
    const d = getValues();

    if ($('opPreviewBrand')) $('opPreviewBrand').textContent = d.brand;
    if ($('opPreviewHeadline')) $('opPreviewHeadline').textContent = d.headline;
    if ($('opPreviewSubtitle')) $('opPreviewSubtitle').textContent = d.subtitle;
    if ($('opPreviewButton')) $('opPreviewButton').textContent = d.buttonText;
    if ($('opPreviewFooter')) $('opPreviewFooter').textContent = d.footer;

    document.documentElement.style.setProperty('--owner-accent', d.accent || defaults.accent);
    document.documentElement.style.setProperty('--owner-bg', d.background || defaults.background);
  }

  function switchTab(name) {
    const section = document.querySelector(`[data-owner-section="${name}"]`);
    if (!section) return;

    document.querySelectorAll('[data-owner-section]').forEach(el => {
      el.classList.toggle('active', el.dataset.ownerSection === name);
    });

    document.querySelectorAll('[data-owner-tab]').forEach(el => {
      el.classList.toggle('active', el.dataset.ownerTab === name);
      if (el.dataset.ownerTab === name) el.setAttribute('aria-current', 'page');
      else el.removeAttribute('aria-current');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('[data-owner-tab]').forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.ownerTab));
  });

  document.querySelectorAll('[data-owner-go]').forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.ownerGo));
  });

  $('opSitePreview')?.addEventListener('click', () => {
    window.open('index.html', '_blank', 'noopener');
  });

  $('opJumpPortfolio')?.addEventListener('click', () => switchTab('portfolio'));
  $('opJumpEnquiries')?.addEventListener('click', () => switchTab('enquiries'));

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    fill({ ...defaults, ...saved });
  } catch (error) {
    fill(defaults);
  }

  const form = $('ownerSettingsForm');

  form?.addEventListener('input', preview);
  form?.addEventListener('change', preview);

  form?.addEventListener('submit', event => {
    event.preventDefault();

    try {
      localStorage.setItem(KEY, JSON.stringify(getValues()));
      if ($('opSettingsStatus')) {
        $('opSettingsStatus').textContent =
          'Draft saved in this browser. Shared live publishing needs a configured settings database.';
      }
    } catch (error) {
      if ($('opSettingsStatus')) {
        $('opSettingsStatus').textContent = 'Could not save draft. Check browser storage.';
      }
    }
  });

  $('opResetSettings')?.addEventListener('click', () => {
    if (!confirm('Reset all editor fields to defaults?')) return;
    fill(defaults);
    if ($('opSettingsStatus')) {
      $('opSettingsStatus').textContent = 'Defaults restored. Save Draft to keep these settings.';
    }
  });

  const updateCounts = () => {
    const portfolioCount = document.querySelectorAll('#adminGallery .admin-row').length;
    const enquiryCount = document.querySelectorAll('#enquiries .enquiry').length;

    if ($('opPortfolioCount')) $('opPortfolioCount').textContent = portfolioCount;
    if ($('opEnquiryCount')) $('opEnquiryCount').textContent = enquiryCount;
  };

  const observer = new MutationObserver(updateCounts);

  ['adminGallery', 'enquiries'].forEach(id => {
    const node = $(id);
    if (node) observer.observe(node, { childList: true, subtree: true });
  });

  window.addEventListener('pageshow', updateCounts);
  setTimeout(updateCounts, 1200);
})();
