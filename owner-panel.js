(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const storeKey = 'sajanJadonOwnerSettingsDraft';

  function openTab(name) {
    document.querySelectorAll('[data-op-section]').forEach(section => {
      section.classList.toggle('active', section.dataset.opSection === name);
    });
    document.querySelectorAll('[data-op-tab]').forEach(button => {
      button.classList.toggle('active', button.dataset.opTab === name);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('[data-op-tab]').forEach(button => {
    button.addEventListener('click', () => openTab(button.dataset.opTab));
  });

  document.querySelectorAll('[data-op-go]').forEach(button => {
    button.addEventListener('click', () => openTab(button.dataset.opGo));
  });

  $('opViewSite')?.addEventListener('click', () => {
    window.open('index.html', '_blank', 'noopener');
  });

  function updateCounts() {
    const rows = document.querySelectorAll('#adminGallery .admin-row');
    const enquiries = document.querySelectorAll('#enquiries .enquiry');
    if ($('opPortfolioCount')) {
      $('opPortfolioCount').textContent = rows.length;
    }
    if ($('opEnquiryCount')) {
      $('opEnquiryCount').textContent = enquiries.length;
    }
  }

  const observer = new MutationObserver(updateCounts);
  ['adminGallery', 'enquiries'].forEach(id => {
    const node = $(id);
    if (node) observer.observe(node, { childList: true, subtree: true });
  });
  setTimeout(updateCounts, 1000);

  const fields = {
    siteName: 'opSiteName',
    accent: 'opAccent',
    headline: 'opHeadline',
    description: 'opDescription',
    seoTitle: 'opSeoTitle',
    seoDescription: 'opSeoDescription'
  };

  function readForm() {
    const result = {};
    Object.entries(fields).forEach(([key, id]) => {
      result[key] = $(id)?.value ?? '';
    });
    return result;
  }

  function loadDraft() {
    try {
      const data = JSON.parse(localStorage.getItem(storeKey) || '{}');
      Object.entries(fields).forEach(([key, id]) => {
        if (data[key] !== undefined && $(id)) $(id).value = data[key];
      });
      if (data.accent) {
        document.documentElement.style.setProperty('--op-purple', data.accent);
      }
    } catch (error) {
      console.warn('Could not load local settings draft.');
    }
  }

  $('opSettingsForm')?.addEventListener('submit', event => {
    event.preventDefault();
    try {
      const data = readForm();
      localStorage.setItem(storeKey, JSON.stringify(data));
      document.documentElement.style.setProperty('--op-purple', data.accent || '#a78bfa');
      $('opSettingsStatus').textContent =
        'Draft saved in this browser. Live website publishing is not connected yet.';
    } catch (error) {
      $('opSettingsStatus').textContent =
        'Could not save the draft. Check browser storage settings.';
    }
  });

  $('opResetSettings')?.addEventListener('click', () => {
    if (!confirm('Reset the saved local settings draft?')) return;
    localStorage.removeItem(storeKey);
    $('opSettingsForm')?.reset();
    document.documentElement.style.setProperty('--op-purple', '#a78bfa');
    $('opSettingsStatus').textContent = 'Local draft reset.';
  });

  $('opSecurityLogout')?.addEventListener('click', () => $('logoutBtn')?.click());

  loadDraft();
})();
