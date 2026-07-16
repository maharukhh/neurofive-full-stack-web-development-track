import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="nav__logo-mark" aria-hidden="true" />
          <span>ResumeScan</span>
        </div>
        <p className="footer__note">
          A student-built project — not affiliated with Workday, Greenhouse,
          Lever, iCIMS, or SmartRecruiters.
        </p>
        <p className="footer__copy">© {new Date().getFullYear()} ResumeScan</p>
      </div>
    </footer>
  );
}
