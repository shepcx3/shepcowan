// Intro: the wordmark fills a white screen in black, then falls into its
// spot in the header, turning white as the white backdrop dissolves.
const intro = document.getElementById("intro");
const endIntro = () => {
  intro.remove();
  document.documentElement.classList.remove("intro-on");
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
  // 2.4s total: blank white 0.35s, text fades in 0.25s, hold 0.6s, then a 1.2s fall
  // into the header while the text turns white and the white backdrop dissolves.
  const timing = { duration: 2400, fill: "forwards" };
  const settle = "cubic-bezier(0.7, 0, 0.2, 1)";
  const fallStart = 0.5;

  const text = mark.animate(
    [
      { offset: 0, transform: big, color: "#000", opacity: 0 },
      { offset: 0.146, transform: big, color: "#000", opacity: 0, easing: "ease-out" },
      { offset: 0.25, transform: big, color: "#000", opacity: 1 },
      { offset: fallStart, transform: big, color: "#000", opacity: 1, easing: settle },
      { offset: 1, transform: "none", color: "#fff", opacity: 1 },
    ],
    timing
  );
  const backdrop = intro.animate(
    [
      { offset: 0, backgroundColor: "#fff" },
      { offset: fallStart, backgroundColor: "#fff", easing: settle },
      { offset: 1, backgroundColor: "rgba(255, 255, 255, 0)" },
    ],
    timing
  );

  backdrop.finished.then(endIntro);
  // Click anywhere to skip
  intro.addEventListener("click", () => [text, backdrop].forEach((a) => a.finish()));
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !document.documentElement.classList.contains("intro-on")) endIntro();
else {
  try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}
  document.fonts.ready.then(playIntro);
  // Safety net: never leave the overlay up if something goes wrong
  setTimeout(endIntro, 4000);
}
