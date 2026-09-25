const dash = document.getElementById("dash");
const dashWrap = document.getElementById("dashWrap");
const clock = document.getElementById("clock");
const steps = document.querySelectorAll(".step");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
function tick() {
  if (!clock) return;
  clock.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
tick();
setInterval(tick, 30000);

function count(el, n, pre = "", suf = "") {
  const dec = n % 1 !== 0;
  const t0 = performance.now();
  const run = (t) => {
    const p = Math.min((t - t0) / 1600, 1);
    const eased = 1 - Math.pow(1 - p, 5);
    const v = n * eased;
    el.textContent = pre + (dec ? v.toFixed(1) : Math.floor(v)) + suf;
    if (p < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

function startDash() {
  if (!dash || dash.classList.contains("live")) return;
  dash.classList.add("live");
  dash.querySelectorAll("strong[data-n]").forEach((el, i) => {
    setTimeout(() => {
      count(el, parseFloat(el.dataset.n), el.dataset.pre || "", el.dataset.suf || "");
    }, i * 100);
  });
}

function initPipeline() {
  if (!steps.length || reduced) return;
  const progress = document.getElementById("pipelineProgress");
  const modelBarFill = document.getElementById("modelBarFill");
  const modelPhase = document.getElementById("modelPhase");
  const modelDesc = document.getElementById("modelDesc");
  const modelHero = document.getElementById("modelHero");
  const modelWatermark = document.getElementById("modelWatermark");
  const modelCount = document.getElementById("modelCount");
  let i = 0;
  let timer;
  let switchTimer = null;
  let firstRun = true;

  const setActive = (index, userInitiated = false) => {
    if (index === i && !firstRun && !userInitiated) return;

    steps.forEach((s, idx) => {
      s.classList.remove("active");
      s.classList.toggle("passed", idx < index);
    });
    const step = steps[index];
    step.classList.add("active");
    i = index;

    const pct = ((index + 1) / steps.length) * 100;
    if (progress) progress.style.width = `${pct}%`;
    if (modelBarFill) modelBarFill.style.width = `${pct}%`;

    const num = step.querySelector(".step-num")?.textContent || "";
    const name = step.querySelector(".step-name")?.textContent || "";
    const desc = step.dataset.desc || "";

    const applyContent = () => {
      if (modelWatermark) modelWatermark.textContent = num;
      if (modelCount) modelCount.textContent = `Step ${index + 1} of ${steps.length}`;
      if (modelPhase) modelPhase.textContent = name;
      if (modelDesc) modelDesc.textContent = desc;
      requestAnimationFrame(() => {
        modelHero?.classList.remove("is-switching");
      });
    };

    if (switchTimer) {
      clearTimeout(switchTimer);
      switchTimer = null;
    }

    if (modelHero && !firstRun) {
      modelHero.classList.add("is-switching");
      switchTimer = setTimeout(applyContent, 280);
    } else {
      applyContent();
      firstRun = false;
    }

    if (userInitiated && window.innerWidth <= 900) {
      step.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  const startCycle = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      setActive((i + 1) % steps.length);
    }, 3000);
  };

  steps.forEach((step, idx) => {
    step.addEventListener("click", () => {
      setActive(idx, true);
      startCycle();
    });
  });

  setActive(0);
  startCycle();
}

function initModelTilt() {
  const stage = document.getElementById("modelStage");
  const tilt = document.getElementById("modelTilt");
  if (!stage || !tilt || reduced || !finePointer) return;

  const maxTilt = 8;
  let targetRX = 0;
  let targetRY = 0;
  let currentRX = 0;
  let currentRY = 0;

  stage.addEventListener(
    "mousemove",
    (e) => {
      const rect = tilt.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRY = x * maxTilt * 2;
      targetRX = -y * maxTilt * 2;
    },
    { passive: true }
  );

  stage.addEventListener("mouseleave", () => {
    targetRX = 0;
    targetRY = 0;
  });

  const animate = () => {
    currentRX += (targetRX - currentRX) * 0.1;
    currentRY += (targetRY - currentRY) * 0.1;
    tilt.style.transform = `rotateX(${currentRX.toFixed(2)}deg) rotateY(${currentRY.toFixed(2)}deg)`;
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

document.querySelectorAll(".fade").forEach((el, idx) => {
  el.style.transitionDelay = `${Math.min(idx * 0.06, 0.3)}s`;
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        el.classList.add("show");
        if (el.id === "dashWrap") startDash();
        io.unobserve(el);
      }
    },
    { threshold: 0.12 }
  );
  io.observe(el);
});

window.addEventListener("load", () => {
  document.querySelectorAll(".fade").forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight * 0.92) {
      el.classList.add("show");
      if (el.id === "dashWrap") startDash();
    }
  });
});

initPipeline();
initModelTilt();

function initCursorGrid() {
  const grid = document.getElementById("cursorGrid");
  if (!grid || reduced || !finePointer) return;

  const radius = 190;
  grid.style.setProperty("--grid-radius", `${radius}px`);

  let targetX = innerWidth / 2;
  let targetY = innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let gridX = 0;
  let gridY = 0;

  const update = (x, y) => {
    targetX = x;
    targetY = y;
  };

  window.addEventListener(
    "mousemove",
    (e) => update(e.clientX, e.clientY),
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      const touch = e.touches[0];
      if (touch) update(touch.clientX, touch.clientY);
    },
    { passive: true }
  );

  const animate = () => {
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;

    const parallaxX = (currentX / innerWidth - 0.5) * 28;
    const parallaxY = (currentY / innerHeight - 0.5) * 28;
    gridX += (parallaxX - gridX) * 0.12;
    gridY += (parallaxY - gridY) * 0.12;

    grid.style.setProperty("--mx", `${currentX}px`);
    grid.style.setProperty("--my", `${currentY}px`);
    grid.style.setProperty("--grid-x", `${gridX}px`);
    grid.style.setProperty("--grid-y", `${gridY}px`);

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

initCursorGrid();

function initDashTilt() {
  const stage = document.getElementById("dashStage");
  const tilt = document.getElementById("dashTilt");
  const dashEl = document.getElementById("dash");
  const floor = stage?.querySelector(".dash-floor");
  const layers = tilt?.querySelectorAll(".dash-layer");
  if (!stage || !tilt || !dashEl || reduced || !finePointer) return;

  const maxTilt = 14;
  let targetRX = 0;
  let targetRY = 0;
  let currentRX = 0;
  let currentRY = 0;
  let targetX = 50;
  let targetY = 40;
  let currentX = 50;
  let currentY = 40;

  const reset = () => {
    targetRX = 0;
    targetRY = 0;
    targetX = 50;
    targetY = 40;
  };

  stage.addEventListener(
    "mousemove",
    (e) => {
      const rect = tilt.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRY = x * maxTilt * 2;
      targetRX = -y * maxTilt * 2;
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;
    },
    { passive: true }
  );

  stage.addEventListener("mouseleave", reset);

  const animate = () => {
    currentRX += (targetRX - currentRX) * 0.12;
    currentRY += (targetRY - currentRY) * 0.12;
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;

    tilt.style.transform = `rotateX(${currentRX.toFixed(2)}deg) rotateY(${currentRY.toFixed(2)}deg)`;
    dashEl.style.setProperty("--dash-x", `${currentX.toFixed(1)}%`);
    dashEl.style.setProperty("--dash-y", `${currentY.toFixed(1)}%`);

    const shadowX = currentRY * 1.6;
    const shadowY = 28 + currentRX * 1.2;
    const shadowBlur = 60 + Math.abs(currentRX) + Math.abs(currentRY);
    dashEl.style.boxShadow = `
      0 1px 0 rgba(255,255,255,0.95) inset,
      0 -1px 0 rgba(0,0,0,0.04) inset,
      ${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px ${shadowBlur.toFixed(0)}px rgba(0,0,0,0.14),
      0 8px 20px rgba(0,0,0,0.06)`;

    if (floor) {
      floor.style.transform = `scale(${1 + Math.abs(currentRY) * 0.008}) translateX(${shadowX * 0.4}px)`;
      floor.style.opacity = `${0.75 + Math.min(Math.abs(currentRX) + Math.abs(currentRY), 12) * 0.015}`;
    }

    layers?.forEach((layer) => {
      const depth = parseFloat(layer.dataset.depth || "0");
      const px = currentRY * depth * 0.035;
      const py = -currentRX * depth * 0.035;
      layer.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, ${depth}px)`;
    });

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

initDashTilt();

function initReelPlayer() {
  const play = document.getElementById("reelPlay");
  const poster = document.getElementById("reelPoster");
  const wrap = document.getElementById("reelEmbedWrap");
  const iframe = document.getElementById("reelIframe");
  const frame = document.getElementById("reelFrame");
  const REEL_EMBED = "https://www.instagram.com/reel/DYmkPCNptu1/embed/";

  if (!play || !poster || !wrap || !iframe || !frame) return;

  play.addEventListener("click", () => {
    if (frame.classList.contains("is-playing")) return;
    iframe.src = REEL_EMBED;
    poster.hidden = true;
    wrap.hidden = false;
    frame.classList.add("is-playing");
  });
}

function initReelTilt() {
  const stage = document.getElementById("reelStage");
  const tilt = document.getElementById("reelTilt");
  if (!stage || !tilt || reduced || !finePointer) return;

  const maxTilt = 10;
  let targetRX = 0;
  let targetRY = 0;
  let currentRX = 0;
  let currentRY = 0;

  const reset = () => {
    targetRX = 0;
    targetRY = 0;
  };

  stage.addEventListener(
    "mousemove",
    (e) => {
      const rect = tilt.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRY = x * maxTilt * 2;
      targetRX = -y * maxTilt * 2;
    },
    { passive: true }
  );

  stage.addEventListener("mouseleave", reset);

  const animate = () => {
    currentRX += (targetRX - currentRX) * 0.12;
    currentRY += (targetRY - currentRY) * 0.12;
    tilt.style.transform = `rotateX(${currentRX.toFixed(2)}deg) rotateY(${currentRY.toFixed(2)}deg)`;
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

initReelPlayer();
initReelTilt();
