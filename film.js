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
    production: "Denim",
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
    production: "Denim",
    slug: "nissan-kicks-rock-creek",
    url: "https://www.youtube.com/watch?v=5nyNFdJ_pdE",
  },
  {
    client: "Capella University",
    title: "How Dare You",
    director: "Elle Brooks-Tao",
    type: "Commercial",
    year: 2026,
    role: "2nd AD",
    production: "Sanctuary, serviced by Suneeva",
    slug: "capella-how-dare-you",
    url: "https://www.youtube.com/watch?v=3kinNxekkVY",
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
      <span>${p.type}${p.year ? ` &middot; ${p.year}` : ""}</span>
      <span>${p.role}</span>
      <span>Prod. ${p.production}</span>
      ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">Watch full &nearr;</a>` : ""}
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

// Contact is the last stop in the reel, after every project
const contact = document.createElement("section");
contact.className = "contact";
contact.id = "contact";
contact.innerHTML = `
  <p>Contact</p>
  <a href="mailto:info@shepcowan.ca">info@shepcowan.ca</a>`;
reel.appendChild(contact);

document.getElementById("contact-link").addEventListener("click", (e) => {
  e.preventDefault();
  contact.scrollIntoView({ behavior: "smooth" });
});

// The project index and counter fade out on the contact slide
new IntersectionObserver(
  ([entry]) => document.body.classList.toggle("on-contact", entry.isIntersecting),
  { threshold: 0.6 }
).observe(contact);

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

// Respect reduced-motion: show posters instead of autoplaying video
if (reducedMotion) {
  observer.disconnect();
  const fallback = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.index))),
    { threshold: 0.6 }
  );
  slides.forEach((s) => fallback.observe(s));
}
