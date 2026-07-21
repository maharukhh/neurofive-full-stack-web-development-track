import './LogosBar.css';

const SYSTEMS = ['Workday', 'Greenhouse', 'Lever', 'iCIMS', 'Taleo', 'SmartRecruiters'];

export default function LogosBar() {
  return (
    <section className="logos">
      <div className="container logos__inner">
        <p className="logos__label">Parsing rules modeled on how these systems read a resume</p>
        <div className="logos__row">
          {SYSTEMS.map((name) => (
            <span className="logos__item" key={name}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
