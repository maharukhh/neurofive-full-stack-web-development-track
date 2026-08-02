import './Header.css'

export default function Header() {
  return (
    <header className="dash-header">
      <div className="container dash-header__inner">
        <span className="dash-header__mark">§ Fieldnote</span>
        <h1 className="dash-header__title">Ops Dashboard</h1>
        <p className="dash-header__sub">Experiment run activity across all research teams</p>
      </div>
    </header>
  )
}
