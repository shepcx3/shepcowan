// Film projects, in the order they appear. To add one: drop a compressed
// loop + poster in assets/film/ and add an entry here.
const projects = [
  {
    client: "Drake",
    title: "Whisper My Name",
    director: "Theo Skudra",
    type: "Music Video",
    year: 2026,
    role: "2nd AD",
    slug: "drake-whisper-my-name",
    url: "https://www.youtube.com/watch?v=YhUqxWR4mnE",
  },
  {
    client: "Nissan Canada",
    title: "Kicks Rock Creek",
    director: "Glenn Michael",
    type: "Commercial",
    year: 2026,
    role: "2nd AD",
    slug: "nissan-kicks-rock-creek",
    url: "https://www.youtube.com/watch?v=5nyNFdJ_pdE",
  },
];

const reel = document.getElementById("reel");
const list = document.getElementById("index-list");
const counter = document.getElementById("counter");

projects.forEach((p, i) => {
  const slide = document.createElement("section");
  slide.className = "slide";
  slide.id = p.slug;
  slide.dataset.index = i;
  slide.setAttribute("aria-label", `${p.client} — ${p.title}`);
  slide.innerHTML = `
    <video muted loop playsinline preload="${i === 0 ? "auto" : "metadata"}"
           poster="assets/film/${p.slug}.jpg" aria-hidden="true">
      <source src="assets/film/${p.slug}.mp4" type="video/mp4">
    </video>
    <div class="shade"></div>
    <div class="meta">
      <span>${p.type} &middot; ${p.year}</span>
      <span>${p.role}</span>
      <a href="${p.url}" target="_blank" rel="noopener">Watch full &nearr;</a>
    </div>`;
  reel.appendChild(slide);

  const li = document.createElement("li");
  li.innerHTML = `<a href="#${p.slug}"><b>${p.client} / ${p.title}</b> by ${p.director}</a>`;
  li.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    slide.scrollIntoView({ behavior: "smooth" });
  });
  list.appendChild(li);
});

const slides = [...reel.querySelectorAll(".slide")];
const items = [...list.children];

function setActive(i) {
  items.forEach((li, j) => li.classList.toggle("active", j === i));
  counter.textContent = `${i + 1}/${slides.length}`;
}
setActive(0);

// Play only the slide that's on screen; pause the rest to save bandwidth/CPU
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      const video = target.querySelector("video");
      if (isIntersecting) {
        setActive(Number(target.dataset.index));
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  },
  { threshold: 0.6 }
);
slides.forEach((s) => observer.observe(s));

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Intro: the wordmark fills the screen black-on-white, inverts to white-on-black,
// then shrinks back into its spot in the header as the reel fades in.
const intro = document.getElementById("intro");
const endIntro = () => {
  intro.remove();
  document.documentElement.classList.remove("intro-running");
};

function playIntro() {
  const mark = intro.querySelector(".intro-mark");
  const r = document.querySelector(".top .wordmark").getBoundingClientRect();
  mark.style.left = `${r.left}px`;
  mark.style.top = `${r.top}px`;

  const scale = Math.min((innerWidth * 0.92) / r.width, (innerHeight * 0.5) / r.height);
  const dx = innerWidth / 2 - (r.left + r.width / 2);
  const dy = innerHeight / 2 - (r.top + r.height / 2);
  const big = `translate(${dx}px, ${dy}px) scale(${scale})`;
  const timing = { duration: 2800, fill: "forwards" };
  const settle = "cubic-bezier(0.7, 0, 0.2, 1)";

  mark.style.opacity = 1;
  const text = mark.animate(
    [
      { offset: 0, transform: big, color: "#000" },
      { offset: 0.28, transform: big, color: "#000", easing: "ease-in-out" },
      { offset: 0.48, transform: big, color: "#fff" },
      { offset: 0.6, transform: big, color: "#fff", easing: settle },
      { offset: 1, transform: "none", color: "#fff" },
    ],
    timing
  );
  const backdrop = intro.animate(
    [
      { offset: 0, backgroundColor: "#fff" },
      { offset: 0.28, backgroundColor: "#fff", easing: "ease-in-out" },
      { offset: 0.48, backgroundColor: "#000" },
      { offset: 0.68, backgroundColor: "rgba(0, 0, 0, 1)", easing: "ease-out" },
      { offset: 1, backgroundColor: "rgba(0, 0, 0, 0)" },
    ],
    timing
  );

  backdrop.finished.then(endIntro);
  // Click anywhere to skip
  intro.addEventListener("click", () => [text, backdrop].forEach((a) => a.finish()));
}

if (reducedMotion) endIntro();
else document.fonts.ready.then(playIntro);

// Respect reduced-motion: show posters instead of autoplaying video
if (reducedMotion) {
  observer.disconnect();
  const fallback = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.index))),
    { threshold: 0.6 }
  );
  slides.forEach((s) => fallback.observe(s));
}
