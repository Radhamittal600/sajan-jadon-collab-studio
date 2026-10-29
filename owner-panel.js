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

// SOCIAL CONTROL CENTER: manual display stats and profile links
(() => {
  const $ = id => document.getElementById(id);
  const KEY = 'sajanJadonSocialControlV1';
  const fields = [
    'socialUsername','socialInstagramUrl','socialYoutubeUrl','socialOtherUrl',
    'socialFollowers','socialViews','socialPosts','socialStatsLabel','socialStatsNote'
  ];
  const defaults = {
    socialUsername:'', socialInstagramUrl:'', socialYoutubeUrl:'', socialOtherUrl:'',
    socialFollowers:'0', socialViews:'0', socialPosts:'0',
    socialStatsLabel:'manual', socialStatsNote:'Updated by owner'
  };

  const validUrl = value => {
    if (!value) return true;
    try {
      const u = new URL(value);
      return u.protocol === 'https:';
    } catch { return false; }
  };

  const values = () => Object.fromEntries(
    fields.map(id => [id, $(id)?.value ?? defaults[id]])
  );

  function paint(data) {
    if ($('socialPreviewUsername')) {
      $('socialPreviewUsername').textContent =
        data.socialUsername ? (data.socialUsername.startsWith('@') ? data.socialUsername : '@' + data.socialUsername) : '@yourusername';
    }
    if ($('socialPreviewFollowers')) $('socialPreviewFollowers').textContent = Number(data.socialFollowers || 0).toLocaleString();
    if ($('socialPreviewViews')) $('socialPreviewViews').textContent = Number(data.socialViews || 0).toLocaleString();
    if ($('socialPreviewPosts')) $('socialPreviewPosts').textContent = Number(data.socialPosts || 0).toLocaleString();
    if ($('socialPreviewLabel')) $('socialPreviewLabel').textContent =
      data.socialStatsLabel === 'sample' ? 'Sample Statistics' : 'Manually Updated';

    if ($('socialFollowersCard')) $('socialFollowersCard').textContent = Number(data.socialFollowers || 0).toLocaleString();
    if ($('socialViewsCard')) $('socialViewsCard').textContent = Number(data.socialViews || 0).toLocaleString();

    const url = validUrl(data.socialInstagramUrl) && data.socialInstagramUrl
      ? data.socialInstagramUrl : 'https://www.instagram.com/';
    if ($('socialInstagramPreview')) $('socialInstagramPreview').href = url;
  }

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    const data = {...defaults, ...saved};
    fields.forEach(id => { if ($(id)) $(id).value = data[id] ?? defaults[id]; });
    paint(data);
  } catch {
    paint(defaults);
  }

  $('socialSettingsForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const data = values();

    for (const id of ['socialInstagramUrl','socialYoutubeUrl','socialOtherUrl']) {
      if (!validUrl(data[id])) {
        $('socialLinksStatus').textContent = 'Please enter a valid HTTPS profile URL.';
        return;
      }
    }

    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      paint(data);
      $('socialLinksStatus').textContent =
        'Social links saved in this browser. Public website-wide sync needs shared settings storage.';
    } catch {
      $('socialLinksStatus').textContent = 'Could not save links in this browser.';
    }
  });

  $('socialStatsForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const data = values();
    for (const id of ['socialFollowers','socialViews','socialPosts']) {
      const n = Number(data[id]);
      if (!Number.isSafeInteger(n) || n < 0) {
        $('socialStatsStatus').textContent = 'Enter a valid non-negative whole number.';
        return;
      }
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      paint(data);
      $('socialStatsStatus').textContent =
        'Statistics saved locally. They are manual display values, not verified live Instagram analytics.';
    } catch {
      $('socialStatsStatus').textContent = 'Could not save statistics in this browser.';
    }
  });

  fields.forEach(id => $(id)?.addEventListener('input', () => paint(values())));
  fields.forEach(id => $(id)?.addEventListener('change', () => paint(values())));

  $('socialStatsReset')?.addEventListener('click', () => {
    if (!confirm('Reset follower and view display values to zero?')) return;
    const current = values();
    current.socialFollowers = '0';
    current.socialViews = '0';
    current.socialPosts = '0';
    fields.forEach(id => { if ($(id)) $(id).value = current[id] ?? defaults[id]; });
    paint(current);
    try { localStorage.setItem(KEY, JSON.stringify(current)); } catch {}
    if ($('socialStatsStatus')) $('socialStatsStatus').textContent = 'Statistics reset to zero.';
  });
})();

/* Shared social analytics integration */
(() => {
  const $ = id => document.getElementById(id);
  const api = () => window.SajanSocialAnalytics;
  const ids = {
    instagramUsername: "socialUsername",
    instagramUrl: "socialInstagramUrl",
    youtubeUrl: "socialYoutubeUrl",
    otherUrl: "socialOtherUrl",
    followers: "socialFollowers",
    views: "socialViews",
    posts: "socialPosts",
    label: "socialStatsLabel",
    note: "socialStatsNote"
  };

  async function loadSharedSocial() {
    if (!api()) return;
    const data = await api().getData();
    Object.entries(ids).forEach(([key, id]) => {
      const el = $(id);
      if (el && data[key] !== undefined) el.value = data[key];
    });
  }

  const form = $("socialStatsForm");
  if (form && !form.dataset.sharedHandler) {
    form.dataset.sharedHandler = "1";
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const status = $("socialSaveStatus") || $("socialStatsLabel");
      const data = {};
      Object.entries(ids).forEach(([key, id]) => {
        const el = $(id);
        if (el) data[key] = el.value;
      });
      if (!api()) {
        alert("Social analytics module load नहीं हुआ। पेज refresh करें।");
        return;
      }
      try {
        status && (status.textContent = "Saving...");
        await api().save(data);
        status && (status.textContent = "Saved successfully");
        await api().renderPublic();
        alert("Social आँकड़े सेव हो गए। अगर Appwrite configure है तो दूसरे डिवाइस पर भी दिखेंगे।");
      } catch (err) {
        status && (status.textContent = err.message);
        alert("Save नहीं हुआ: " + err.message +
          "\nAppwrite database, collection और document permissions जाँचें।");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", loadSharedSocial);
  loadSharedSocial();
})();
