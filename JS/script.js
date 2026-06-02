const $ = id => document.getElementById(id);
 
// ── HELPER: container vullen met html ────────────────
function vul(id, html) {
  const el = $(id);
  if (el) el.innerHTML = html;
}
 
// ── HELPER: herbruikbare slider ──────────────────────
function maakSlider(id, items, perKeer, renderFn, pijlKlasse) {
  const el = $(id);
  if (!el) return; // element bestaat niet op deze pagina → overslaan
  let i = 0;
  function teken() {
    const zichtbaar = [];
    for (let j = 0; j < perKeer; j++) zichtbaar.push(items[(i + j) % items.length]);
    el.innerHTML = renderFn(zichtbaar) + `<button class="${pijlKlasse}">›</button>`;
    el.querySelector(`.${pijlKlasse}`).onclick = () => { i = (i + 1) % items.length; teken(); };
  }
  teken();
}
 
 
// ════════════════════════════════════════════════════
//  HOME PAGINA
// ════════════════════════════════════════════════════
 
const acties = [
  { icon: '🎬', titel: 'Films ontdekken',      tekst: 'Bekijk alle Pixar films die zijn gemaakt' },
  { icon: '👤', titel: 'Personages ontdekken', tekst: 'Leer alles over leuke personages' },
  { icon: '🙂', titel: 'Fun facts',            tekst: 'Leuke weetjes die je nog niet kende' },
  { icon: '💡', titel: 'Doe een quiz',         tekst: 'Test je kennis' },
];
 
const films = [
  { src: 'toy-story',  jaar: 1995, rating: 8.3 },
  { src: 'inside-out', jaar: 2015, rating: 8.1 },
  { src: 'nemo',       jaar: 2003, rating: 8.2 },
  { src: 'cars',       jaar: 2006, rating: 7.2 },
  { src: 'coco',       jaar: 2017, rating: 8.4 },
];
 
const personages = [
  { id: 'woody',  naam: 'Woody',  pagina: 'personage-woody.html' },
  { id: 'nemo',   naam: 'Nemo',   pagina: null },
  { id: 'wall-e', naam: 'WALL-E', pagina: null },
  { id: 'miguel', naam: 'Miguel', pagina: null },
  { id: 'luca',   naam: 'Luca',   pagina: null },
  { id: 'buzz',   naam: 'Buzz',   pagina: null },
];
 
const trailers = [
  { src: 'rat',        alt: 'Ratatouille trailer' },
  { src: 'monsterinc', alt: 'Monsters Inc trailer' },
  { src: 'coco',       alt: 'Coco trailer' },
];
 
// Actiekaarten
vul('actionGrid', acties.map(a => `
  <div class="action-card">
    <div class="icon">${a.icon}</div>
    <div><h4>${a.titel}</h4><p>${a.tekst}</p></div>
  </div>`).join(''));
 
// Films slider (3 tegelijk)
maakSlider('movieList', films, 3, lijst => lijst.map(f => `
  <div class="movie-card">
    <div class="poster"><img src="images/home-${f.src}-film.png" alt="${f.src}"></div>
    <p>${f.jaar} <span>⭐ ${f.rating}</span></p>
  </div>`).join(''), 'small-arrow');
 
// Personages slider (5 tegelijk) – klikbaar als pagina is ingesteld
maakSlider('characterList', personages, 5, lijst => lijst.map(p => `
  <div class="character ${p.pagina ? 'klikbaar' : ''}"
       ${p.pagina ? `onclick="location.href='${p.pagina}'"` : ''}>
    <div class="avatar ${p.id}-bg">
      <img src="images/home-${p.id}-personage.png" alt="${p.naam}">
    </div>
    <p>${p.naam}</p>
  </div>`).join(''), 'small-arrow');
 
// Trailers slider (2 tegelijk)
maakSlider('trailerRow', trailers, 2, lijst => lijst.map(t => `
  <div class="trailer-box">
    <img src="images/home-${t.src}-trailer.png" alt="${t.alt}">
  </div>`).join(''), 'trailer-arrow');
 
// Zoekfunctie
const zoekInput = $('searchInput');
if (zoekInput) {
  zoekInput.addEventListener('input', e =>
    console.log('Zoekt:', e.target.value.toLowerCase())
  );
}
 
 
// ════════════════════════════════════════════════════
//  PERSONAGE WOODY PAGINA
// ════════════════════════════════════════════════════
 
const woodyVrienden = [
  { id: 'buzz_lightyear', naam: 'Buzz Lightyear' },
  { id: 'jessie',         naam: 'Jessie'         },
  { id: 'bullseye',       naam: 'Bullseye'       },
  { id: 'slinky_dog',     naam: 'Slinky dog'     },
];
 
const woodyGeschiedenisFotos = [1, 2, 3, 4];
 
const woodyQuiz = {
  opties:    ['Woody', 'Andy', 'Bonnie', 'Buzz'],
  antwoord:  'Andy',
};
 
// Geschiedenis foto's
vul('geschFotos', woodyGeschiedenisFotos.map(n => `
  <img src="images/personage_woody_geschiedenis_${n}.png" alt="Geschiedenis ${n}">`
).join(''));
 
// Vrienden slider (4 tegelijk)
maakSlider('vriendenLijst', woodyVrienden, 4, lijst => lijst.map(v => `
  <div class="vriend">
    <div class="vriend-avatar">
      <img src="images/personage_woody_vriend_${v.id}.png" alt="${v.naam}">
    </div>
    <p>${v.naam}</p>
  </div>`).join(''), 'vriend-pijl');
 
// Audio simulatie
(function() {
  const btn       = $('playBtn');
  const voortgang = $('voortgang');
  const tijdEl    = $('audioTijd');
  if (!btn) return; // niet op deze pagina
  const duur = 5;
  let speelt = false, procent = 0, interval = null;
 
  btn.addEventListener('click', () => {
    if (speelt) {
      clearInterval(interval);
      speelt = false;
      btn.textContent = '▶';
      btn.classList.remove('speelt');
    } else {
      if (procent >= 100) procent = 0;
      speelt = true;
      btn.textContent = '⏸';
      btn.classList.add('speelt');
      interval = setInterval(() => {
        procent += 100 / (duur * 10);
        voortgang.style.width = Math.min(procent, 100) + '%';
        tijdEl.textContent = Math.ceil(Math.max(0, duur - procent / 100 * duur)) + ' Sec';
        if (procent >= 100) {
          clearInterval(interval);
          speelt = false;
          btn.textContent = '▶';
          btn.classList.remove('speelt');
        }
      }, 100);
    }
  });
})();
 
// Quiz
(function () {
  const container = $("quizOpties");
  const feedback = $("quizFeedback");

  if (!container) return;

  container.innerHTML = woodyQuiz.opties.map(optie => {
    const antwoordClass = optie === woodyQuiz.antwoord ? "correct" : "wrong";
    return `<button class="quiz-opt ${antwoordClass}">${optie}</button>`;
  }).join("");

  container.querySelectorAll(".quiz-opt").forEach(button => {
    button.addEventListener("click", () => {
      container.querySelectorAll(".quiz-opt").forEach(btn => {
        btn.classList.remove("clicked");
      });

      button.classList.add("clicked");

      const goed = button.textContent === woodyQuiz.antwoord;

      if (feedback) {
        feedback.textContent = goed
          ? "✅ Goed!"
          : "❌ Helaas, het goede antwoord is " + woodyQuiz.antwoord + ".";
      }
    });
  });
})();

// AR pagina camera + Woody beweging + hoed face tracking + foto maken
(function () {
  const video = document.getElementById("camera");
  const woodyAR = document.querySelector(".ar-woody");
  const hatBtn = document.getElementById("hatBtn");
  const woodyHat = document.getElementById("woodyHat");

  const openCaptureBtn = document.getElementById("openCaptureBtn");
  const captureBtn = document.getElementById("captureBtn");
  const arInstruction = document.getElementById("arInstruction");
  const snapshotCanvas = document.getElementById("snapshotCanvas");
  const downloadPhoto = document.getElementById("downloadPhoto");

  let hatActive = false;

  if (!video) return;

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  })
  .then(stream => {
    video.srcObject = stream;
    video.play();

    if (typeof FaceMesh !== "undefined" && woodyHat) {
      const faceMesh = new FaceMesh({
        locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults(results => {
        if (!hatActive) {
          woodyHat.style.display = "none";
          return;
        }

        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
          woodyHat.style.display = "none";
          return;
        }

        const face = results.multiFaceLandmarks[0];

        const topHead = face[10];
        const leftFace = face[234];
        const rightFace = face[454];

        const x = (1 - topHead.x) * window.innerWidth;
        const y = topHead.y * window.innerHeight;

        const faceWidth = Math.abs(rightFace.x - leftFace.x) * window.innerWidth;
        const hatWidth = faceWidth * 1.4;

        woodyHat.style.display = "block";
        woodyHat.style.left = `${x - 10}px`;
        woodyHat.style.top = `${y - 150}px`;
        woodyHat.style.width = `${hatWidth * 1.2}px`;
      });

      async function trackFace() {
        await faceMesh.send({ image: video });
        requestAnimationFrame(trackFace);
      }

      video.addEventListener("loadeddata", trackFace);
    }
  })
  .catch(error => {
    console.error("Camera error:", error);
    alert("Camera start niet. Gebruik Live Server en geef toestemming voor camera.");
  });

  if (woodyAR) {
    woodyAR.addEventListener("click", () => {
      woodyAR.classList.remove("signature-move");
      void woodyAR.offsetWidth;
      woodyAR.classList.add("signature-move");
    });
  }

  if (hatBtn && woodyHat) {
    hatBtn.addEventListener("click", () => {
      hatActive = !hatActive;

      if (!hatActive) {
        woodyHat.style.display = "none";
      }
    });
  }

  if (openCaptureBtn && captureBtn) {
  openCaptureBtn.addEventListener("click", () => {
    captureBtn.classList.toggle("show");

    if (arInstruction) {
      if (captureBtn.classList.contains("show")) {
        arInstruction.style.display = "none";
      } else {
        arInstruction.style.display = "block";
      }
    }
  });
}

  if (captureBtn && snapshotCanvas && downloadPhoto) {
    captureBtn.addEventListener("click", () => {
      snapshotCanvas.width = window.innerWidth;
      snapshotCanvas.height = window.innerHeight;

      const ctx = snapshotCanvas.getContext("2d");

      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -snapshotCanvas.width, 0, snapshotCanvas.width, snapshotCanvas.height);
      ctx.restore();

      if (woodyAR) {
        const rect = woodyAR.getBoundingClientRect();
        ctx.drawImage(woodyAR, rect.left, rect.top, rect.width, rect.height);
      }

      if (woodyHat && woodyHat.style.display !== "none") {
        const rect = woodyHat.getBoundingClientRect();
        ctx.drawImage(woodyHat, rect.left, rect.top, rect.width, rect.height);
      }

      downloadPhoto.href = snapshotCanvas.toDataURL("image/png");
      downloadPhoto.click();
    });
  }
})();