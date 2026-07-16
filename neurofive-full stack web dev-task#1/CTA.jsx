import './CTA.css';

export default function CTA() {
  return (
    <section id="cta" className="cta">
      <div className="container cta__inner">
        <h2 className="cta__title">Find out what the bot sees.</h2>
        <p className="cta__sub">
          Free first scan, no account needed. Takes about the length of a
          coffee break.
        </p>
        <form
          className="cta__form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="you@email.com"
            aria-label="Email address"
          />
          <button type="submit" className="btn btn-primary">
            Scan my resume
          </button>
        </form>
      </div>
    </section>
  );
}
