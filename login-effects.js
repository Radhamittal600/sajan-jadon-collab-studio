(() => {
  const body = document.body;
  if (body && body.classList.contains('lamp-login')) {
    const colors = ['255,190,75','0,220,255','170,90,255','255,90,170'];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % colors.length;
      body.style.setProperty('--lamp-color', colors[i]);
    }, 3200);

    const lamp = document.querySelector('.lamp-stage');
    if (lamp) {
      lamp.setAttribute('tabindex', '0');
      lamp.setAttribute('role', 'button');
      lamp.setAttribute('aria-label', 'Change lamp light color');
      const toggle = () => {
        i = (i + 1) % colors.length;
        body.style.setProperty('--lamp-color', colors[i]);
      };
      lamp.addEventListener('click', toggle);
      lamp.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    }
  }

  // Animate only the element that actually contains the creator credit.
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const hits = [];
  while (walk.nextNode()) {
    const node = walk.currentNode;
    if (/website\s*created\s*by\s*chetan\s*mittal/i.test(node.nodeValue || '')) {
      let el = node.parentElement;
      while (el && el !== document.body &&
        (el.children.length > 4 || (el.tagName === 'BODY' || el.tagName === 'HTML'))) {
        el = el.parentElement;
      }
      if (el && el !== document.body) hits.push(el);
    }
  }
  [...new Set(hits)].forEach(el => el.classList.add('chetan-creator-signature'));
})();
