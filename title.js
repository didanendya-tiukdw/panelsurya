(() => {
  'use strict';

  const app = document.getElementById('app');
  if (!app) return;

  const titleScreen = document.createElement('section');
  titleScreen.id = 'titleScreen';
  titleScreen.className = 'title-screen';
  titleScreen.setAttribute('aria-label', 'Halaman judul Solar Energy Conversion Lab 3D');
  titleScreen.innerHTML = `
    <div class="title-bg-orb orb-one"></div>
    <div class="title-bg-orb orb-two"></div>
    <div class="title-visual" aria-hidden="true">
      <div class="title-sun">☀</div>
      <div class="title-rays"></div>
      <div class="title-panel-illustration">
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="title-house"></div>
      <div class="title-lawn"></div>
    </div>
    <div class="title-card">
      <div class="title-kicker"><span>☀</span> LABORATORIUM ENERGI SURYA 3D</div>
      <h1>Simulasi Panel Surya<br>Dalam Model 3D</h1>
      <p class="title-lead">Rangkai sistem energi surya, atur kondisi eksperimen, dan amati perubahan daya secara real-time.</p>
      <div class="title-features">
        <span>✥ Drag & Drop</span>
        <span>◷ Waktu Matahari</span>
        <span>⚡ DC → AC</span>
      </div>
      <button id="enterLabBtn" class="enter-lab-btn" type="button">Mulai Simulasi <span>→</span></button>
      <p class="title-note">Resoulsi Optimal: 1280 × 720 px· Model Pembelajaran Eksploratif</p>
    </div>
  `;

  document.body.appendChild(titleScreen);

  const enter = document.getElementById('enterLabBtn');
  enter.addEventListener('click', () => {
    titleScreen.classList.add('leaving');
    app.classList.remove('title-pending');
    setTimeout(() => {
      titleScreen.remove();
      window.dispatchEvent(new Event('resize'));
    }, 360);
  });

  enter.focus();
})();
