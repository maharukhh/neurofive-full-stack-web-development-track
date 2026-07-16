import './HowItWorks.css';

const STEPS = [
  {
    n: '01',
    title: 'Upload your resume',
    text: 'Drop in a PDF or DOCX, and paste the job description you\'re applying to. That\'s the only input we need.',
  },
  {
    n: '02',
    title: 'We parse it like the bot would',
    text: 'ResumeScan runs the same text-extraction and section-detection logic real ATS platforms use, then compares it against the job description.',
  },
  {
    n: '03',
    title: 'Get a fix list, not just a score',
    text: 'You get a match score plus a plain-English list: which keywords are missing, which formatting confuses parsers, and what to change first.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="steps">
      <div className="container">
        <div className="steps__head">
          <p className="eyebrow">// process</p>
          <h2 className="steps__title">Three steps. About ninety seconds.</h2>
        </div>
        <div className="steps__grid">
          {STEPS.map((s) => (
            <div className="step" key={s.n}>
              <span className="step__n">{s.n}</span>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__text">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
