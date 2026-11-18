/* Duety - Script Principal */

/* 1. Cintas 3D */
document.querySelectorAll(".scene").forEach(function(sc){
  var fs=parseFloat(getComputedStyle(sc).fontSize),n=8;
  [[-28,-22,16,"normal","#fff",0,1],[24,18,24,"reverse","transparent",1,1.14],[72,-8,34,"normal","#4a4a4a",0,1.28]].forEach(function(c){
    var t=document.createElement("div");t.className="tilt";t.style.transform="rotateX("+c[0]+"deg) rotateZ("+c[1]+"deg)";
    var y=document.createElement("div");y.className="cyl";y.style.animationDuration=c[2]+"s";y.style.animationDirection=c[3];
    var r=c[6]*n*7.6*fs/(2*Math.PI);
    for(var i=0;i<n;i++){var s=document.createElement("span");s.textContent="COMING SOON";s.style.color=c[4];
      if(c[5]){s.style.webkitTextStroke="1px #8b8b8b"}
      s.style.transform="rotateY("+(i*360/n)+"deg) translateZ("+r+"px)";y.appendChild(s)}
    t.appendChild(y);sc.appendChild(t)});
});

/* 2. Ticker de conceptos */
var w=["novedad","género","estado de ánimo","duelo musical","zona de confort","artistas emergentes","descubrir"],h="";
for(var k=0;k<4;k++)w.forEach(function(x,i){h+=(i%2?"<b>"+x+"</b>":"<em>"+x+"</em>")});
var tkEl=document.getElementById("tk");
if(tkEl) tkEl.innerHTML=h+h;

/* 3. PROTOTIPO: DUELO 1 VS 1 (HIGHER OR LOWER SÓNICO) */
var G=["Indie","Hip hop","Electrónica","Salsa / Latina","Rock","Jazz / Soul"];
var G_COLORS=["#6366f1","#ec4899","#06b6d4","#f97316","#ef4444","#8b5cf6"];
var G_ICONS=["🎸","🎤","🎛️","🎺","⚡","🎷"];

/* Dataset de canciones estructurado para contrastar distancias y estilos */
var DATASET = [
  /* Indie */
  {t:"Neón en la lluvia", a:"Luna Cobre", g:0, d:0.14, e:true},
  {t:"Cartas sin sello", a:"Ágata Verde", g:0, d:0.22, e:true},
  {t:"Aurora de neón", a:"Pez Radio", g:0, d:0.42, e:true},
  {t:"Mapa de ecos", a:"Lámpara", g:0, d:0.52, e:false},
  /* Hip hop */
  {t:"Sombra de barrio", a:"Dos Veces Rey", g:1, d:0.18, e:false},
  {t:"Rima de balcón", a:"Mc Alba", g:1, d:0.28, e:true},
  {t:"Verso a medianoche", a:"Oso Lírico", g:1, d:0.46, e:true},
  {t:"Calle y cadencia", a:"Sirena Norte", g:1, d:0.82, e:true},
  /* Electrónica */
  {t:"Pulso 128", a:"Nube Eléctrica", g:2, d:0.55, e:false},
  {t:"Vidrio líquido", a:"Kira Volt", g:2, d:0.70, e:true},
  {t:"Latido de sala", a:"Fase Cero", g:2, d:0.90, e:true},
  {t:"Sintaxis modular", a:"Prisma B", g:2, d:0.84, e:true},
  /* Salsa / Latina */
  {t:"Sábado de pregón", a:"Los Mareados", g:3, d:0.62, e:false},
  {t:"Cobre y clave", a:"Orquesta Lila", g:3, d:0.78, e:true},
  {t:"Son de la tarde", a:"Casa Canela", g:3, d:0.94, e:true},
  {t:"Tambor y sal", a:"Raíz Negra", g:3, d:0.86, e:true},
  /* Rock */
  {t:"Ruta 40", a:"Cuervos del Sur", g:4, d:0.48, e:false},
  {t:"Tormenta lenta", a:"Hierro Dulce", g:4, d:0.68, e:true},
  {t:"Cuerdas de polvo", a:"Los Faroles", g:4, d:0.85, e:true},
  {t:"Eco de hangar", a:"Vulcano 7", g:4, d:0.73, e:true},
  /* Jazz / Soul */
  {t:"Humo azul a las tres", a:"Trío Marea", g:5, d:0.75, e:true},
  {t:"Escala menor", a:"Elena Oro", g:5, d:0.88, e:false},
  {t:"Trompeta de lluvia", a:"Quinteto Sal", g:5, d:0.58, e:true},
  {t:"Saxo en el ático", a:"Julián Velvet", g:5, d:0.92, e:true}
];

/* Estado del Duelo */
var songA = DATASET[0];
var songB = DATASET[8];
var chosenList = [];
var currentlyPlaying = null; // 'A' | 'B' | null

/* Elementos del DOM */
var cardAEl = document.getElementById("card-a");
var cardBEl = document.getElementById("card-b");
var duelCountEl = document.getElementById("duel-count");
var duelResetBtn = document.getElementById("duel-reset");
var duelChipsEl = document.getElementById("duel-chips");
var duelDiversityEl = document.getElementById("duel-diversity");

/* 4. MOTOR DE AUDIO (Web Audio API para snippets) */
var audioCtx = null;
var activeGain = null;
var activeOscs = [];

function stopAudio() {
  if (activeGain && audioCtx) {
    try {
      activeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
      setTimeout(function() {
        activeOscs.forEach(function(o){ try{o.stop(); o.disconnect();}catch(e){} });
        activeOscs = [];
      }, 120);
    } catch(e){}
  }
  currentlyPlaying = null;
}

function playSnippet(song, side) {
  if (currentlyPlaying === side) {
    stopAudio();
    updateAudioButtons();
    return;
  }

  stopAudio();
  currentlyPlaying = side;

  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();

    var baseFreqs = [
      [261.63, 329.63, 392.00], // Indie
      [146.83, 174.61, 220.00], // Hip hop
      [130.81, 196.00, 261.63], // Electrónica
      [220.00, 277.18, 329.63], // Salsa
      [164.81, 246.94, 329.63], // Rock
      [174.61, 220.00, 261.63]  // Jazz
    ];
    var freqs = baseFreqs[song.g % baseFreqs.length];

    var master = audioCtx.createGain();
    master.gain.setValueAtTime(0.001, audioCtx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.14, audioCtx.currentTime + 0.2);
    master.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.8);

    freqs.forEach(function(f) {
      var osc = audioCtx.createOscillator();
      osc.type = song.g === 2 ? "sawtooth" : song.g === 4 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f, audioCtx.currentTime);
      osc.connect(master);
      osc.start();
      osc.stop(audioCtx.currentTime + 4.0);
      activeOscs.push(osc);
    });

    master.connect(audioCtx.destination);
    activeGain = master;

    setTimeout(function() {
      if (currentlyPlaying === side) {
        currentlyPlaying = null;
        updateAudioButtons();
      }
    }, 4000);

  } catch(e) {
    console.warn("Audio Context:", e);
  }

  updateAudioButtons();
}

function updateAudioButtons() {
  var btnA = cardAEl ? cardAEl.querySelector(".duel-btn-preview") : null;
  var btnB = cardBEl ? cardBEl.querySelector(".duel-btn-preview") : null;
  if (btnA) {
    btnA.innerHTML = (currentlyPlaying === "A" ? "⏸ Pausar muestra" : "▶ Escuchar snippet");
    btnA.classList.toggle("playing", currentlyPlaying === "A");
  }
  if (btnB) {
    btnB.innerHTML = (currentlyPlaying === "B" ? "⏸ Pausar muestra" : "▶ Escuchar snippet");
    btnB.classList.toggle("playing", currentlyPlaying === "B");
  }
}

/* 5. RENDERIZADO DEL DUELO (HIGHER OR LOWER) */
function getDistanceInfo(d) {
  if (d < 0.35) return { text: "Cercana a tu zona", cls: "cercana" };
  if (d < 0.65) return { text: "Intermedia / Variedad", cls: "intermedia" };
  return { text: "Lejana / Ruptura radical", cls: "lejana" };
}

function renderCard(container, song, side) {
  if (!container || !song) return;
  var dInfo = getDistanceInfo(song.d);
  var bgGradient = "linear-gradient(135deg, " + G_COLORS[song.g] + "22, #141414)";

  container.innerHTML =
    '<div class="duel-card-art" style="background:' + bgGradient + ';border-color:' + G_COLORS[song.g] + '44">' +
      '<span>' + G_ICONS[song.g] + '</span>' +
      '<small>' + G[song.g] + '</small>' +
    '</div>' +
    '<div class="duel-card-info">' +
      '<b>' + song.t + '</b>' +
      '<small>' + song.a + '</small>' +
      '<div class="duel-card-tags">' +
        '<span class="dist-pill ' + dInfo.cls + '">' + song.d.toFixed(2) + ' • ' + dInfo.text + '</span>' +
        (song.e ? '<span class="badge-emerging">★ Artista Emergente</span>' : '<span class="dist-pill" style="border:1px solid #333;color:var(--mut)">Mainstream</span>') +
      '</div>' +
    '</div>' +
    '<div class="duel-actions">' +
      '<button class="duel-btn-preview" type="button">' +
        (currentlyPlaying === side ? "⏸ Pausar muestra" : "▶ Escuchar snippet") +
      '</button>' +
      '<button class="duel-btn-choose" type="button">Elegir esta canción →</button>' +
    '</div>';

  /* Escuchar preview */
  container.querySelector(".duel-btn-preview").onclick = function() {
    playSnippet(song, side);
  };

  /* Elegir canción */
  container.querySelector(".duel-btn-choose").onclick = function() {
    chooseSong(side);
  };
}

function renderDuel() {
  renderCard(cardAEl, songA, "A");
  renderCard(cardBEl, songB, "B");
  updateTrayUI();
}

/* 6. LÓGICA HIGHER OR LOWER: ELIGES UNA Y PASA LA SIGUIENTE */
function getRandomNewSong(excludeA, excludeB) {
  var pool = DATASET.filter(function(s) {
    return s !== excludeA && s !== excludeB;
  });
  if (pool.length === 0) return DATASET[Math.floor(Math.random() * DATASET.length)];
  return pool[Math.floor(Math.random() * pool.length)];
}

function chooseSong(side) {
  stopAudio();
  var chosen = (side === "A") ? songA : songB;
  chosenList.push(chosen);

  /* Mecánica Higher or Lower:
     La canción elegida se mantiene o se coloca en Card A como ancla,
     y entra una nueva canción retadora en Card B */
  songA = chosen;
  songB = getRandomNewSong(songA, null);

  /* Animación visual rápida de selección */
  if (cardAEl && cardBEl) {
    var chosenEl = (side === "A") ? cardAEl : cardBEl;
    chosenEl.classList.add("chosen");
    setTimeout(function() {
      chosenEl.classList.remove("chosen");
      renderDuel();
    }, 220);
  } else {
    renderDuel();
  }
}

function updateTrayUI() {
  if (duelCountEl) duelCountEl.textContent = chosenList.length;

  if (duelDiversityEl) {
    if (chosenList.length === 0) {
      duelDiversityEl.textContent = "Haz tu primera elección para calibrar la ruptura sónica";
    } else {
      var avgDist = chosenList.reduce(function(acc, s){ return acc + s.d; }, 0) / chosenList.length;
      var pct = Math.round(avgDist * 100);
      duelDiversityEl.innerHTML = 'Ruptura acumulada: <strong>+' + pct + '%</strong> fuera de tu zona de confort';
    }
  }

  if (duelChipsEl) {
    if (chosenList.length === 0) {
      duelChipsEl.innerHTML = '<small style="color:var(--mut)">Tus elecciones aparecerán aquí conforme elijas entre las 2 opciones.</small>';
    } else {
      duelChipsEl.innerHTML = "";
      chosenList.slice().reverse().forEach(function(s) {
        var chip = document.createElement("span");
        chip.className = "duel-chip-item";
        chip.innerHTML = G_ICONS[s.g] + ' ' + s.t + ' <small>(' + s.d.toFixed(2) + ')</small>';
        duelChipsEl.appendChild(chip);
      });
    }
  }
}

/* Reiniciar Duelo */
if (duelResetBtn) {
  duelResetBtn.onclick = function() {
    stopAudio();
    chosenList = [];
    songA = DATASET[0];
    songB = DATASET[8];
    renderDuel();
  };
}

/* Inicializar Duelo */
renderDuel();

/* 7. SLIDES: CONTADOR, REVELADO Y TECLADO */
var S2 = [].slice.call(document.querySelectorAll("section")), cur = 0;
var pg = document.getElementById("pg");
var io = new IntersectionObserver(function(es){
  es.forEach(function(e){
    if (e.isIntersecting) {
      e.target.classList.add("in");
      cur = S2.indexOf(e.target);
      if (pg) pg.textContent = (cur + 1) + " / " + S2.length;
    }
  });
}, { threshold: 0.45 });

S2.forEach(function(s){ io.observe(s); });

document.addEventListener("keydown", function(e) {
  var d = { ArrowDown:1, PageDown:1, ArrowRight:1, ArrowUp:-1, PageUp:-1, ArrowLeft:-1 }[e.key];
  if (!d || (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "BUTTON"))) return;
  var n = Math.max(0, Math.min(S2.length - 1, cur + d));
  S2[n].scrollIntoView({ behavior: "smooth" });
  e.preventDefault();
});
