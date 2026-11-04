// Runs in <head>, before the page paints: the intro plays once per visit
try {
  if (!sessionStorage.getItem("introSeen")) document.documentElement.classList.add("intro-on");
} catch (e) {
  document.documentElement.classList.add("intro-on");
}
