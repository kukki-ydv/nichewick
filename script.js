const dash = document.getElementById("dash");
const dashWrap = document.getElementById("dashWrap");
const clock = document.getElementById("clock");
const steps = document.querySelectorAll(".step");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  let i = 0;
  setInterval(() => {
    steps.forEach((s) => s.classList.remove("active"));
    steps[i].classList.add("active");
    i = (i + 1) % steps.length;
  }, 2200);
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
