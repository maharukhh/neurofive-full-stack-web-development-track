// Hero — the page's thesis: a small, welcoming coffee shop.
// The graphic is a simple cup-and-steam mark drawn in SVG,
// standing in for a photo without needing real product shots.
function Hero() {
  return `
    <section class="hero" id="top">
      <div class="wrap">
        <div>
          <span class="eyebrow">Neighborhood coffee, since 2019</span>
          <h1>Slow coffee, made for staying a while.</h1>
          <p>
            Kettle &amp; Bean is a small corner coffee shop — hand-poured
            drip, simple pastries, and seats that don't rush you out.
            No app, no rewards card. Just come in.
          </p>
          <div class="hero__actions">
            <a href="#menu" class="btn btn--primary">See the menu</a>
            <a href="#visit" class="btn btn--ghost">Find us</a>
          </div>
        </div>
        <div class="hero__graphic" aria-hidden="true">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="var(--brown)" stroke-width="4" stroke-linecap="round">
              <path d="M55 85 h80 v45 a40 40 0 0 1 -80 0 z" />
              <path d="M135 95 h12 a16 16 0 0 1 0 32 h-12" />
              <line x1="60" y1="85" x2="60" y2="70" />
            </g>
            <g fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round">
              <path d="M75 55 q6 -10 0 -20" />
              <path d="M95 55 q6 -10 0 -20" />
              <path d="M115 55 q6 -10 0 -20" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  `;
}
