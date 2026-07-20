// Entry point — composes each section component (loaded as
// plain global scripts, see index.html) into #app in order.
// Kept as a regular script (not type="module") so the page
// also works when opened directly as a local file, not just
// from a server.
const app = document.getElementById("app");

app.innerHTML = [
  Navbar(),
  Hero(),
  Menu(),
  About(),
  Visit(),
  Footer(),
].join("");

initNavbar();
