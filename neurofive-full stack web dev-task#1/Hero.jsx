import './Hero.css';

const ROWS = [
  { text: 'Senior Product Designer — Figma, user research, A/B testing', hit: true },
  { text: 'Led redesign of onboarding flow, +18% activation', hit: false },
  { text: 'Cross-functional collaboration with Engineering & PM', hit: true },
  { text: 'Design systems, component libraries, accessibility (WCAG)', hit: true },
  { text: 'Mentored 2 junior designers over 12 months', hit: false },
  { text: 'SQL, basic Python for design analytics', hit: true },
];

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">// ats_pass_rate: checking</p>
          <h1 className="hero__title">
            Your resume is good.
            <br />
            Is it <em>readable</em> to the bot reading it first?
          </h1>
          <p className="hero__sub">
            Most resumes are rejected by applicant tracking software before a
            human sees them — not because the candidate is unqualified, but
            because the formatting or keywords don't parse. ResumeScan shows
            you exactly what the machine sees.
          </p>
          <div className="hero__actions">
            <a href="#cta" className="btn btn-primary">
              Scan my resume — free
            </a>
            <a href="#how-it-works" className="btn btn-ghost">
              See how it works
            </a>
          </div>
          <p className="hero__note">No signup required for your first scan.</p>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="scan-doc">
            <div className="scan-doc__head">
              <span className="scan-doc__dot" />
              <span className="scan-doc__dot" />
              <span className="scan-doc__dot" />
              <span className="scan-doc__title">resume_final_v3.pdf</span>
            </div>
            <div className="scan-doc__body">
              {ROWS.map((row, i) => (
                <div
                  className={`scan-row ${row.hit ? 'scan-row--hit' : ''}`}
                  style={{ animationDelay: `${i * 0.42}s` }}
                  key={i}
                >
                  <span className="scan-row__bar" />
                  <span className="scan-row__text">{row.text}</span>
                  {row.hit && <span className="scan-row__badge">match</span>}
                </div>
              ))}
            </div>
            <div className="scan-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
