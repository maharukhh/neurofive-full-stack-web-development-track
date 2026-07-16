import './ReportPreview.css';

const BREAKDOWN = [
  { label: 'Keyword match', value: 68 },
  { label: 'Formatting', value: 91 },
  { label: 'Section labeling', value: 100 },
];

const FIXES = [
  'Add "stakeholder management" — appears 3x in the job description, 0x in your resume',
  'Replace the two-column layout in your Experience section — most parsers read it out of order',
  'Spell out "CI/CD" at least once — some parsers don\'t match the acronym alone',
];

const SCORE = 74;
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ReportPreview() {
  return (
    <section id="report" className="report">
      <div className="container report__inner">
        <div className="report__copy">
          <p className="eyebrow">// report_preview</p>
          <h2 className="report__title">What you actually get back</h2>
          <p className="report__sub">
            Not a black-box percentage. A breakdown of where the score comes
            from, and a short, ordered list of what to fix first.
          </p>
        </div>

        <div className="report-card">
          <div className="report-card__score">
            <svg viewBox="0 0 120 120" className="score-ring">
              <circle cx="60" cy="60" r={RADIUS} className="score-ring__track" />
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                className="score-ring__fill"
                style={{
                  strokeDasharray: CIRCUMFERENCE,
                  strokeDashoffset: CIRCUMFERENCE * (1 - SCORE / 100),
                }}
              />
            </svg>
            <div className="report-card__score-label">
              <span className="report-card__score-num">{SCORE}</span>
              <span className="report-card__score-max">/100</span>
            </div>
          </div>

          <div className="report-card__breakdown">
            {BREAKDOWN.map((b) => (
              <div className="breakdown-row" key={b.label}>
                <div className="breakdown-row__top">
                  <span>{b.label}</span>
                  <span className="breakdown-row__value">{b.value}%</span>
                </div>
                <div className="breakdown-row__track">
                  <div
                    className="breakdown-row__fill"
                    style={{ width: `${b.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="report-card__fixes">
            <span className="report-card__fixes-label">Top fixes</span>
            <ul>
              {FIXES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
