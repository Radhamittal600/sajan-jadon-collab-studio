(() => {
  'use strict';

  if (!document.body.classList.contains('lamp-login')) return;

  const robot = document.createElement('div');
  robot.id = 'cuteLoginRobot';
  robot.setAttribute('aria-hidden', 'true');
  robot.innerHTML = `
    <div class="cr-shadow"></div>
    <div class="cr-antenna"><i></i></div>
    <div class="cr-head">
      <div class="cr-ear cr-ear-l"></div>
      <div class="cr-ear cr-ear-r"></div>
      <div class="cr-eyes"><i></i><i></i></div>
      <div class="cr-cheeks"><i></i><i></i></div>
      <div class="cr-mouth"></div>
      <div class="cr-cross">✕</div>
      <div class="cr-success">✓</div>
    </div>
    <div class="cr-body">
      <span class="cr-heart">♥</span>
      <i class="cr-arm cr-arm-l"></i>
      <i class="cr-arm cr-arm-r"></i>
    </div>
    <div class="cr-legs"><i></i><i></i></div>
    <div class="cr-bubble"></div>`;
  document.body.appendChild(robot);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let x = innerWidth * .78;
  let y = innerHeight * .72;
  let tx = x, ty = y;
  let mode = 'idle';
  let modeTimer;

  function moveTarget(e) {
    const p = e.touches ? e.touches[0] : e;
    if (!p) return;
    tx = Math.max(65, Math.min(innerWidth - 65, p.clientX + 35));
    ty = Math.max(120, Math.min(innerHeight - 100, p.clientY + 25));
  }

  document.addEventListener('pointermove', moveTarget, {passive:true});
  document.addEventListener('touchmove', moveTarget, {passive:true});

  function animate() {
    if (mode === 'idle') {
      x += (tx - x) * (reduced ? .4 : .12);
      y += (ty - y) * (reduced ? .4 : .12);
      robot.style.left = x + 'px';
      robot.style.top = y + 'px';
    }
    requestAnimationFrame(animate);
  }
  animate();

  window.loginRobotReact = function (result) {
    clearTimeout(modeTimer);
    mode = result;
    robot.classList.remove('cr-fail','cr-dance');
    void robot.offsetWidth;

    if (result === 'fail') {
      robot.classList.add('cr-fail');
      robot.querySelector('.cr-bubble').textContent = '✋ ✕ Try again!';
    } else if (result === 'success') {
      robot.classList.add('cr-dance');
      robot.querySelector('.cr-bubble').textContent = 'YAY! 🎉';
    } else {
      mode = 'idle';
      robot.querySelector('.cr-bubble').textContent = '';
    }

    if (result !== 'idle') {
      modeTimer = setTimeout(() => {
        robot.classList.remove('cr-fail','cr-dance');
        robot.querySelector('.cr-bubble').textContent = '';
        mode = 'idle';
      }, result === 'success' ? 1800 : 2200);
    }
  };

  const lamp = document.querySelector('.lamp-stage');
  if (lamp) {
    const colors = ['#ffe7a1','#8cf7ff','#e8a4ff','#a8ffbd'];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % colors.length;
      lamp.style.setProperty('--lamp-color', colors[i]);
    }, 2600);
  }
})();
