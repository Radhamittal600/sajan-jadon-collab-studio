(() => {
  'use strict';

  const C = window.SAJAN_CONFIG;
  const { Client, Account } = window.Appwrite || {};
  const ready = !!(
    C &&
    typeof C.projectId === 'string' &&
    C.projectId.trim() &&
    !C.projectId.startsWith('YOUR_') &&
    typeof C.endpoint === 'string' &&
    /^https:\/\/[^<>\s]+\/v1\/?$/.test(C.endpoint.trim())
  );

  let account;
  if (ready && Client && Account) {
    account = new Account(
      new Client().setEndpoint(C.endpoint).setProject(C.projectId)
    );
  }

  const form = document.getElementById('loginForm');
  const status = document.getElementById('loginStatus');
  const button = form?.querySelector('[type="submit"]');

  if (!form || !status) return;

  function react(type) {
    if (typeof window.loginRobotReact === 'function') {
      window.loginRobotReact(type);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!account) {
      status.textContent = 'Appwrite config.js is not configured yet.';
      react('fail');
      return;
    }

    const fields = new FormData(form);
    const email = String(fields.get('email') || '').trim();
    const password = String(fields.get('password') || '');

    status.textContent = 'Signing in…';
    if (button) button.disabled = true;

    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();

      if (!C.ownerUserId || user.$id !== C.ownerUserId) {
        await account.deleteSession('current');
        status.textContent = 'Not authorized as the owner.';
        react('fail');
        return;
      }

      status.textContent = 'Login successful! Welcome back.';
      react('success');
      setTimeout(() => { location.href = 'studio.html'; }, 1700);
    } catch (err) {
      status.textContent = 'Login failed. Check your email and password.';
      react('fail');
    } finally {
      if (button) button.disabled = false;
    }
  });
})();
