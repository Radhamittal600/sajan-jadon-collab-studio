(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const KEY = 'sajanJadonOwnerSettingsDraftV2';

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
    brand:'opBrand',
    headline:'opHeadline',
    subtitle:'opSubtitle',
    buttonText:'opButtonText',
    accent:'opAccent',
    background:'opBackground',
    footer:'opFooter',
    seoTitle:'opSeoTitle',
    seoDescription:'opSeoDescription',
    contactLabel:'opContactLabel',
    theme:'opTheme'
  };

  function getValues() {
    const data = {};
    for (const [key,id] of Object.entries(ids)) {
      const el = $(id);
      data[key] = el ? el.value : defaults[key];
    }
    return data;
  }

  function fill(data) {
    for (const [key,id] of Object.entries(ids)) {
      const el = $(id);
      if (el) el.value = data[key] ?? defaults[key];
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
    document.querySelectorAll('[data-owner-section]').forEach(el => {
      el.classList.toggle('active', el.dataset.ownerSection === name);
    });
    document.querySelectorAll('[data-owner-tab]').forEach(el => {
      el.classList.toggle('active', el.dataset.ownerTab === name);
    });
    window.scrollTo({top:0,behavior:'smooth'});
  }

  document.querySelectorAll('[data-owner-tab]').forEach(el => {
    el.addEventListener('click', () => switchTab(el.dataset.ownerTab));
  });
  document.querySelectorAll('[data-owner-go]').forEach(el => {
    el.addEventListener('click', () => switchTab(el.dataset.ownerGo));
  });

  const settingsForm = $('ownerSettingsForm');

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    fill({...defaults,...saved});
  } catch {
    fill(defaults);
  }

  settingsForm?.addEventListener('input', preview);

  settingsForm?.addEventListener('submit', event => {
    event.preventDefault();
    try {
      localStorage.setItem(KEY, JSON.stringify(getValues()));
      if ($('opSettingsStatus')) {
        $('opSettingsStatus').textContent =
          'Draft saved in this browser. Live visitor-wide publishing needs a connected settings database.';
      }
    } catch {
      if ($('opSettingsStatus')) $('opSettingsStatus').textContent = 'Could not save the draft.';
    }
  });

  $('opResetSettings')?.addEventListener('click', () => {
    if (!confirm('Reset all fields to their default values?')) return;
    fill(defaults);
    if ($('opSettingsStatus')) $('opSettingsStatus').textContent = 'Defaults restored. Press Save Draft to save them.';
  });

  $('opSitePreview')?.addEventListener('click', () => {
    window.open('index.html','_blank','noopener');
  });

  $('opJumpPortfolio')?.addEventListener('click', () => switchTab('portfolio'));
  $('opJumpEnquiries')?.addEventListener('click', () => switchTab('enquiries'));

  const countObserver = new MutationObserver(() => {
    const portfolio = document.querySelectorAll('#adminGallery .admin-row').length;
    const enquiries = document.querySelectorAll('#enquiries .enquiry').length;
    if ($('opPortfolioCount')) $('opPortfolioCount').textContent = portfolio;
    if ($('opEnquiryCount')) $('opEnquiryCount').textContent = enquiries;
  });

  ['adminGallery','enquiries'].forEach(id => {
    if ($(id)) countObserver.observe($(id),{childList:true,subtree:true});
  });
})();
