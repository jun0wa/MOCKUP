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
var w=["novedad","género","estado de ánimo","popularidad","zona de confort","artistas emergentes","descubrir"],h="";
for(var k=0;k<4;k++)w.forEach(function(x,i){h+=(i%2?"<b>"+x+"</b>":"<em>"+x+"</em>")});
var tkEl=document.getElementById("tk");
if(tkEl) tkEl.innerHTML=h+h;

/* 3. PROTOTIPO INTERACTIVO DE DUETY */
var G=["Indie","Hip hop","Electrónica","Salsa / Latina","Rock","Jazz / Soul"];
var G_COLORS=["#6366f1","#ec4899","#06b6d4","#f97316","#ef4444","#8b5cf6"];
var G_ICONS=["🎸","🎤","🎛️","🎺","⚡","🎷"];

/* Dataset de canciones estructurado según los objetivos del proyecto */
var DATASET = [
  /* Indie */
  {t:"Neón en la lluvia", a:"Luna Cobre", g:0, d:0.14, m:"chill", e:true},
  {t:"Cartas sin sello", a:"Ágata Verde", g:0, d:0.22, m:"nostalgia", e:true},
  {t:"Aurora de neón", a:"Pez Radio", g:0, d:0.42, m:"focus", e:true},
  {t:"Mapa de ecos", a:"Lámpara", g:0, d:0.52, m:"chill", e:false},
  /* Hip hop */
  {t:"Sombra de barrio", a:"Dos Veces Rey", g:1, d:0.18, m:"energy", e:false},
  {t:"Rima de balcón", a:"Mc Alba", g:1, d:0.28, m:"energy", e:true},
  {t:"Verso a medianoche", a:"Oso Lírico", g:1, d:0.46, m:"focus", e:true},
  {t:"Calle y cadencia", a:"Sirena Norte", g:1, d:0.82, m:"party", e:true},
  /* Electrónica */
  {t:"Pulso 128", a:"Nube Eléctrica", g:2, d:0.55, m:"party", e:false},
  {t:"Vidrio líquido", a:"Kira Volt", g:2, d:0.70, m:"energy", e:true},
  {t:"Latido de sala", a:"Fase Cero", g:2, d:0.90, m:"energy", e:true},
  {t:"Sintaxis modular", a:"Prisma B", g:2, d:0.84, m:"focus", e:true},
  /* Salsa / Latina */
  {t:"Sábado de pregón", a:"Los Mareados", g:3, d:0.62, m:"party", e:false},
  {t:"Cobre y clave", a:"Orquesta Lila", g:3, d:0.78, m:"party", e:true},
  {t:"Son de la tarde", a:"Casa Canela", g:3, d:0.94, m:"chill", e:true},
  {t:"Tambor y sal", a:"Raíz Negra", g:3, d:0.86, m:"energy", e:true},
  /* Rock */
  {t:"Ruta 40", a:"Cuervos del Sur", g:4, d:0.48, m:"energy", e:false},
  {t:"Tormenta lenta", a:"Hierro Dulce", g:4, d:0.68, m:"nostalgia", e:true},
  {t:"Cuerdas de polvo", a:"Los Faroles", g:4, d:0.85, m:"energy", e:true},
  {t:"Eco de hangar", a:"Vulcano 7", g:4, d:0.73, m:"energy", e:true},
  /* Jazz / Soul */
  {t:"Humo azul a las tres", a:"Trío Marea", g:5, d:0.75, m:"nostalgia", e:true},
  {t:"Escala menor", a:"Elena Oro", g:5, d:0.88, m:"chill", e:false},
  {t:"Trompeta de lluvia", a:"Quinteto Sal", g:5, d:0.58, m:"focus", e:true},
  {t:"Saxo en el ático", a:"Julián Velvet", g:5, d:0.92, m:"nostalgia", e:true}
];

/* Estado de la aplicación */
var state = {
  novelty: 3,
  mood: "all",
  filter: "all",
  genres: [0, 1, 2, 3, 4, 5],
  saved: {},
  currentSong: null,
  isPlaying: false,
  view: "explore"
};

var NOVELTY_DESCS = [
  "Zona segura: muy cercana a tus gustos",
  "Variación suave: matices conocidos",
  "Exploración intermedia: variedad equilibrada",
  "Nuevos horizontes: géneros y sonidos vecinos",
  "Ruptura radical: fuera de tu zona de confort"
];
var NOVELTY_TARGETS = [0.15, 0.35, 0.50, 0.68, 0.88];

/* Elementos del DOM del Prototipo */
var novSlider = document.getElementById("nov-slider");
var novVal = document.getElementById("nov-val");
var novDesc = document.getElementById("nov-desc");
var songGrid = document.getElementById("song-grid");
var streamCount = document.getElementById("stream-count");
var streamStatus = document.getElementById("stream-status");
var libCount = document.getElementById("lib-count");
var libGrid = document.getElementById("lib-grid");
var libStats = document.getElementById("lib-stats");
var libEmpty = document.getElementById("lib-empty");
var radarBox = document.getElementById("radar-container");
var soundWave = document.getElementById("sound-wave");

var pTitle = document.getElementById("p-title");
var pArtist = document.getElementById("p-artist");
var pCov = document.getElementById("p-cov");
var pDistance = document.getElementById("p-distance");
var pPlay = document.getElementById("p-play");
var pPrev = document.getElementById("p-prev");
var pNext = document.getElementById("p-next");
var pSave = document.getElementById("p-save");

/* Toast notification */
var toast = document.createElement("div");
toast.className = "duety-toast";
document.body.appendChild(toast);
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(function(){ toast.classList.remove("show"); }, 2800);
}

/* 4. MOTOR DE AUDIO SINTÉTICO PROCEDURAL (Web Audio API) */
var audioCtx = null;
var activeGain = null;
var activeOscs = [];
var synthTimer = null;

function stopAudio() {
  if (activeGain && audioCtx) {
    try {
      activeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
      setTimeout(function() {
        activeOscs.forEach(function(o) { try { o.stop(); o.disconnect(); } catch(e){} });
        activeOscs = [];
      }, 180);
    } catch(e){}
  }
  if (synthTimer) {
    clearInterval(synthTimer);
    synthTimer = null;
  }
  state.isPlaying = false;
  updatePlayerUI();
}

function playSong(song) {
  if (!song) return;

  if (state.currentSong === song && state.isPlaying) {
    stopAudio();
    return;
  }

  stopAudio();
  state.currentSong = song;
  state.isPlaying = true;

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    var baseFreqs = [
      [261.63, 329.63, 392.00, 523.25], // Indie: C major
      [146.83, 174.61, 220.00, 293.66], // Hip hop: D minor
      [130.81, 196.00, 261.63, 392.00], // Electrónica: C bass arp
      [220.00, 277.18, 329.63, 440.00], // Salsa: Montuno
      [164.81, 246.94, 329.63, 493.88], // Rock: Em
      [174.61, 220.00, 261.63, 329.63]  // Jazz: Fmaj7
    ];
    var freqs = baseFreqs[song.g % baseFreqs.length];

    var master = audioCtx.createGain();
    master.gain.setValueAtTime(0.001, audioCtx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.25);

    var filter = audioCtx.createBiquadFilter();
    filter.type = song.g === 2 ? "bandpass" : "lowpass";
    filter.frequency.setValueAtTime(song.g === 2 ? 750 : 1200, audioCtx.currentTime);

    freqs.forEach(function(f) {
      var osc = audioCtx.createOscillator();
      osc.type = song.g === 2 ? "sawtooth" : song.g === 4 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f, audioCtx.currentTime);
      var gNode = audioCtx.createGain();
      gNode.gain.value = 0.25;
      osc.connect(gNode);
      gNode.connect(filter);
      osc.start();
      activeOscs.push(osc);
    });

    filter.connect(master);
    master.connect(audioCtx.destination);
    activeGain = master;

    /* Arpegio suave */
    var step = 0;
    synthTimer = setInterval(function() {
      if (!state.isPlaying || !audioCtx) return;
      var f = freqs[step % freqs.length];
      if (activeOscs[0]) {
        try {
          activeOscs[0].frequency.exponentialRampToValueAtTime(f * (step % 2 === 0 ? 1 : 1.5), audioCtx.currentTime + 0.1);
        } catch(e){}
      }
      step++;
    }, 450);

  } catch(err) {
    console.warn("Audio Context fallback:", err);
  }

  updatePlayerUI();
  renderSongs();
  if (state.view === "radar") renderRadar();
}

function updatePlayerUI() {
  if (state.currentSong) {
    pTitle.textContent = state.currentSong.t;
    pArtist.textContent = state.currentSong.a + " • " + G[state.currentSong.g];
    pCov.textContent = G_ICONS[state.currentSong.g];
    pCov.style.background = G_COLORS[state.currentSong.g] + "33";
    pDistance.textContent = state.currentSong.d.toFixed(2) + " Distancia";
    pSave.textContent = state.saved[state.currentSong.t] ? "Guardada ✓" : "Guardar";
    pSave.classList.toggle("on", !!state.saved[state.currentSong.t]);
  }
  pPlay.textContent = state.isPlaying ? "⏸" : "▶";
  pPlay.classList.toggle("playing", state.isPlaying);
  if (soundWave) soundWave.classList.toggle("active", state.isPlaying);
}

/* 5. ALGORITMO DE RECOMENDACIÓN Y FILTRADO */
function getFilteredAndRankedSongs() {
  var targetDist = NOVELTY_TARGETS[state.novelty - 1];

  var filtered = DATASET.filter(function(s) {
    /* Filtro por género */
    if (state.genres.indexOf(s.g) === -1) return false;
    /* Filtro por mood */
    if (state.mood !== "all" && s.m !== state.mood) return false;
    /* Filtro por artista emergente */
    if (state.filter === "emerging" && !s.e) return false;
    if (state.filter === "balanced" && !s.e && Math.random() > 0.5) return false;
    return true;
  });

  /* Ordenar según cercanía al nivel de novedad deseado */
  filtered.sort(function(a, b) {
    var diffA = Math.abs(a.d - targetDist);
    var diffB = Math.abs(b.d - targetDist);
    return diffA - diffB;
  });

  return filtered;
}

function getDistanceTag(d) {
  if (d < 0.35) return { label: "Cercana", cls: "cercana" };
  if (d < 0.65) return { label: "Intermedia", cls: "intermedia" };
  return { label: "Ruptura", cls: "lejana" };
}

/* 6. RENDERIZADO DEL EXPLORADOR */
function renderSongs() {
  if (!songGrid) return;
  songGrid.innerHTML = "";
  var list = getFilteredAndRankedSongs();

  streamCount.textContent = list.length + " canciones descubiertas";
  streamStatus.textContent = "Nivel " + state.novelty + " (" + NOVELTY_DESCS[state.novelty - 1] + ")";

  if (list.length === 0) {
    songGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--mut)">No hay canciones con los filtros seleccionados. Activa más géneros o cambia el estado de ánimo.</div>';
    return;
  }

  list.forEach(function(s) {
    var card = document.createElement("div");
    card.className = "song-card" + (state.currentSong === s && state.isPlaying ? " playing" : "");

    var dInfo = getDistanceTag(s.d);
    var isSaved = !!state.saved[s.t];

    card.innerHTML =
      '<div class="card-top">' +
        '<div class="card-art" style="background:' + G_COLORS[s.g] + '22;border-color:' + G_COLORS[s.g] + '44">' + G_ICONS[s.g] + '</div>' +
        '<div class="card-details">' +
          '<b>' + s.t + '</b>' +
          '<small>' + s.a + ' • ' + G[s.g] + '</small>' +
          (s.e ? '<span class="badge-emerging">★ Artista Emergente</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="card-bottom">' +
        '<span class="dist-pill ' + dInfo.cls + '">' + s.d.toFixed(2) + ' • ' + dInfo.label + '</span>' +
        '<div class="card-actions">' +
          '<button class="card-sv' + (isSaved ? " on" : "") + '">' + (isSaved ? "Guardada ✓" : "Guardar") + '</button>' +
          '<button class="play-btn' + (state.currentSong === s && state.isPlaying ? " playing" : "") + '" title="Escuchar snippet">' +
            (state.currentSong === s && state.isPlaying ? "⏸" : "▶") +
          '</button>' +
        '</div>' +
      '</div>';

    /* Botón Play */
    var playBtn = card.querySelector(".play-btn");
    playBtn.onclick = function() {
      playSong(s);
    };

    /* Botón Guardar */
    var svBtn = card.querySelector(".card-sv");
    svBtn.onclick = function(e) {
      e.stopPropagation();
      if (state.saved[s.t]) {
        delete state.saved[s.t];
        showToast("Eliminada de tu biblioteca");
      } else {
        state.saved[s.t] = s;
        showToast("✓ Guardada: \"" + s.t + "\" en tu biblioteca");
      }
      updateLibUI();
      renderSongs();
      updatePlayerUI();
    };

    songGrid.appendChild(card);
  });
}

/* 7. RENDERIZADO DEL RADAR SONORO */
function renderRadar() {
  if (!radarBox) return;
  var list = getFilteredAndRankedSongs();
  var cx = 190, cy = 190, rMax = 160;

  var svg = '<svg viewBox="0 0 380 380" role="img" aria-label="Radar de zona de confort">';
  /* Anillos */
  svg += '<circle cx="' + cx + '" cy="' + cy + '" r="50" fill="none" stroke="#222" stroke-width="1.5" stroke-dasharray="4,4"/>';
  svg += '<circle cx="' + cx + '" cy="' + cy + '" r="105" fill="none" stroke="#2a2a2a" stroke-width="1.5"/>';
  svg += '<circle cx="' + cx + '" cy="' + cy + '" r="160" fill="none" stroke="#333" stroke-width="1.5"/>';

  /* Ejes */
  svg += '<line x1="' + (cx - rMax) + '" y1="' + cy + '" x2="' + (cx + rMax) + '" y2="' + cy + '" stroke="#181818" stroke-width="1"/>';
  svg += '<line x1="' + cx + '" y1="' + (cy - rMax) + '" x2="' + cx + '" y2="' + (cy + rMax) + '" stroke="#181818" stroke-width="1"/>';

  /* Centro: Zona de confort */
  svg += '<circle cx="' + cx + '" cy="' + cy + '" r="14" fill="#10b981" opacity=".2"/>';
  svg += '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="#10b981"/>';
  svg += '<text x="' + cx + '" y="' + (cy + 24) + '" text-anchor="middle" fill="#888" font-size="10" font-family="Space Grotesk">Tu Centro</text>';

  /* Proyección de canciones */
  list.forEach(function(s, idx) {
    var distFrac = Math.min(1, s.d);
    var radius = 25 + distFrac * (rMax - 30);
    var angle = (idx * (360 / Math.max(list.length, 1)) + s.g * 25) * (Math.PI / 180);
    var x = cx + radius * Math.cos(angle);
    var y = cy + radius * Math.sin(angle);

    var isPlaying = state.currentSong === s && state.isPlaying;
    var dInfo = getDistanceTag(s.d);
    var dotColor = dInfo.cls === "cercana" ? "#4ade80" : dInfo.cls === "intermedia" ? "#38bdf8" : "#c084fc";
    if (s.e) dotColor = "#facc15";

    svg += '<g class="radar-node" data-idx="' + idx + '" style="cursor:pointer">';
    if (isPlaying) {
      svg += '<circle cx="' + x + '" cy="' + y + '" r="14" fill="' + dotColor + '" opacity=".4"><animate attributeName="r" values="8;18;8" dur="1.8s" repeatCount="indefinite"/></circle>';
    }
    svg += '<circle cx="' + x + '" cy="' + y + '" r="' + (isPlaying ? 7 : 5) + '" fill="' + dotColor + '" stroke="#000" stroke-width="1.5"/>';
    svg += '<title>' + s.t + ' - ' + s.a + ' (' + s.d.toFixed(2) + ')</title>';
    svg += '</g>';
  });

  svg += '</svg>';
  radarBox.innerHTML = svg;

  radarBox.querySelectorAll(".radar-node").forEach(function(el) {
    el.onclick = function() {
      var idx = +el.getAttribute("data-idx");
      if (list[idx]) playSong(list[idx]);
    };
  });
}

/* 8. RENDERIZADO DE BIBLIOTECA */
function updateLibUI() {
  var savedKeys = Object.keys(state.saved);
  libCount.textContent = savedKeys.length;

  if (!libGrid) return;
  libGrid.innerHTML = "";

  if (savedKeys.length === 0) {
    libEmpty.style.display = "flex";
    libStats.textContent = "0 canciones almacenadas localmente";
    return;
  }

  libEmpty.style.display = "none";
  libStats.textContent = savedKeys.length + " canciones guardadas • Descubrimientos activos";

  savedKeys.forEach(function(key) {
    var s = state.saved[key];
    var card = document.createElement("div");
    card.className = "song-card" + (state.currentSong === s && state.isPlaying ? " playing" : "");
    var dInfo = getDistanceTag(s.d);

    card.innerHTML =
      '<div class="card-top">' +
        '<div class="card-art" style="background:' + G_COLORS[s.g] + '22;border-color:' + G_COLORS[s.g] + '44">' + G_ICONS[s.g] + '</div>' +
        '<div class="card-details">' +
          '<b>' + s.t + '</b>' +
          '<small>' + s.a + ' • ' + G[s.g] + '</small>' +
          (s.e ? '<span class="badge-emerging">★ Artista Emergente</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="card-bottom">' +
        '<span class="dist-pill ' + dInfo.cls + '">' + s.d.toFixed(2) + ' • ' + dInfo.label + '</span>' +
        '<div class="card-actions">' +
          '<button class="card-sv on" title="Quitar de biblioteca">Eliminar ✕</button>' +
          '<button class="play-btn' + (state.currentSong === s && state.isPlaying ? " playing" : "") + '">' +
            (state.currentSong === s && state.isPlaying ? "⏸" : "▶") +
          '</button>' +
        '</div>' +
      '</div>';

    card.querySelector(".play-btn").onclick = function() { playSong(s); };
    card.querySelector(".card-sv").onclick = function() {
      delete state.saved[key];
      showToast("Canción eliminada de tu biblioteca");
      updateLibUI();
      renderSongs();
      updatePlayerUI();
    };

    libGrid.appendChild(card);
  });
}

/* 9. CONTROLES Y EVENTOS DEL PROTOTIPO */

/* Slider de novedad */
if (novSlider) {
  novSlider.oninput = function(e) {
    state.novelty = +e.target.value;
    novVal.textContent = state.novelty;
    novDesc.textContent = NOVELTY_DESCS[state.novelty - 1];
    renderSongs();
    if (state.view === "radar") renderRadar();
  };
}

/* Chips de Mood */
document.querySelectorAll("#mood-chips .chip").forEach(function(btn) {
  btn.onclick = function() {
    document.querySelectorAll("#mood-chips .chip").forEach(function(b){ b.classList.remove("on"); });
    btn.classList.add("on");
    state.mood = btn.getAttribute("data-mood");
    renderSongs();
    if (state.view === "radar") renderRadar();
  };
});

/* Filtro de catálogo (Emergentes) */
document.querySelectorAll("#filter-chips .chip").forEach(function(btn) {
  btn.onclick = function() {
    document.querySelectorAll("#filter-chips .chip").forEach(function(b){ b.classList.remove("on"); });
    btn.classList.add("on");
    state.filter = btn.getAttribute("data-filter");
    renderSongs();
    if (state.view === "radar") renderRadar();
  };
});

/* Chips de géneros */
document.querySelectorAll("#genre-chips .chip").forEach(function(btn) {
  btn.onclick = function() {
    var g = +btn.getAttribute("data-genre");
    var idx = state.genres.indexOf(g);
    if (idx > -1) {
      if (state.genres.length > 1) {
        state.genres.splice(idx, 1);
        btn.classList.remove("on");
      } else {
        showToast("Debes mantener al menos un género activo");
      }
    } else {
      state.genres.push(g);
      btn.classList.add("on");
    }
    renderSongs();
    if (state.view === "radar") renderRadar();
  };
});

/* Botón seleccionar todos los géneros */
var btnAllGenres = document.getElementById("btn-all-genres");
if (btnAllGenres) {
  btnAllGenres.onclick = function() {
    state.genres = [0, 1, 2, 3, 4, 5];
    document.querySelectorAll("#genre-chips .chip").forEach(function(b){ b.classList.add("on"); });
    renderSongs();
    if (state.view === "radar") renderRadar();
  };
}

/* Botón Mezclar */
var shuffleBtn = document.getElementById("shuffle-btn");
if (shuffleBtn) {
  shuffleBtn.onclick = function() {
    DATASET.sort(function() { return Math.random() - 0.5; });
    renderSongs();
    if (state.view === "radar") renderRadar();
    showToast("Descubrimientos recalculados");
  };
}

/* Switcher de Vistas (Explorador / Radar / Biblioteca) */
var tabExplore = document.getElementById("tab-explore");
var tabRadar = document.getElementById("tab-radar");
var tabLib = document.getElementById("tab-lib");
var viewExplore = document.getElementById("view-explore");
var viewRadar = document.getElementById("view-radar");
var viewLibrary = document.getElementById("view-library");

function setView(viewName) {
  state.view = viewName;
  [tabExplore, tabRadar, tabLib].forEach(function(t){ if(t) t.classList.remove("on"); });
  [viewExplore, viewRadar, viewLibrary].forEach(function(v){ if(v) v.style.display = "none"; });

  if (viewName === "explore") {
    tabExplore.classList.add("on");
    viewExplore.style.display = "block";
    renderSongs();
  } else if (viewName === "radar") {
    tabRadar.classList.add("on");
    viewRadar.style.display = "block";
    renderRadar();
  } else if (viewName === "library") {
    tabLib.classList.add("on");
    viewLibrary.style.display = "block";
    updateLibUI();
  }
}

if (tabExplore) tabExplore.onclick = function() { setView("explore"); };
if (tabRadar) tabRadar.onclick = function() { setView("radar"); };
if (tabLib) tabLib.onclick = function() { setView("library"); };

/* Controles del Mini Player */
if (pPlay) {
  pPlay.onclick = function() {
    if (!state.currentSong) {
      var list = getFilteredAndRankedSongs();
      if (list.length > 0) playSong(list[0]);
    } else {
      if (state.isPlaying) stopAudio();
      else playSong(state.currentSong);
    }
  };
}

if (pNext) {
  pNext.onclick = function() {
    var list = getFilteredAndRankedSongs();
    if (list.length === 0) return;
    var idx = list.indexOf(state.currentSong);
    var nextSong = list[(idx + 1) % list.length];
    playSong(nextSong);
  };
}

if (pPrev) {
  pPrev.onclick = function() {
    var list = getFilteredAndRankedSongs();
    if (list.length === 0) return;
    var idx = list.indexOf(state.currentSong);
    var prevSong = list[(idx - 1 + list.length) % list.length];
    playSong(prevSong);
  };
}

if (pSave) {
  pSave.onclick = function() {
    if (!state.currentSong) return;
    var s = state.currentSong;
    if (state.saved[s.t]) {
      delete state.saved[s.t];
      showToast("Eliminada de tu biblioteca");
    } else {
      state.saved[s.t] = s;
      showToast("✓ Guardada en biblioteca: " + s.t);
    }
    updateLibUI();
    renderSongs();
    updatePlayerUI();
  };
}

/* Exportar Playlist */
var exportBtn = document.getElementById("export-btn");
if (exportBtn) {
  exportBtn.onclick = function() {
    var keys = Object.keys(state.saved);
    if (keys.length === 0) {
      showToast("Guarda al menos una canción antes de exportar");
      return;
    }
    var text = "Playlist Duety - Descubrimientos:\n" + keys.map(function(k, i){ return (i+1) + ". " + state.saved[k].t + " - " + state.saved[k].a; }).join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        showToast("✓ " + keys.length + " canciones copiadas al portapapeles para importar");
      });
    } else {
      showToast("✓ Playlist de " + keys.length + " canciones generada");
    }
  };
}

/* Inicializar prototipo */
renderSongs();
updateLibUI();

/* 10. SLIDES: CONTADOR, REVELADO Y TECLADO */
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
