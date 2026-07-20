const HOURS = [
  ["Mon – Fri", "7:00 AM – 6:00 PM"],
  ["Saturday", "8:00 AM – 5:00 PM"],
  ["Sunday", "8:00 AM – 2:00 PM"],
];

function HoursRow([day, time]) {
  return `<div class="hours-row"><span>${day}</span><span>${time}</span></div>`;
}

function Visit() {
  const hours = HOURS.map(HoursRow).join("");

  return `
    <section class="section" id="visit">
      <div class="wrap">
        <span class="eyebrow">Visit</span>
        <h2>Come find us.</h2>
        <div class="info-grid">
          <div class="info-card">
            <h3>Hours</h3>
            ${hours}
          </div>
          <div class="info-card">
            <h3>Location</h3>
            <p style="margin-bottom: var(--space-2);">Gulshan e Iqbal block 10A<br />Karachi, Pakistan</p>
            <p style="margin-bottom:0;">Street parking available. Two steps in from the sidewalk — no ramp yet, working on it.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}
