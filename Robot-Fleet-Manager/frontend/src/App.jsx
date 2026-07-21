import { useMemo } from "react";
import { useRobots } from "./useRobots";
import RobotForm from "./components/RobotForm";
import RobotRow from "./components/RobotRow";

export default function App() {
  const {
    robots,
    loading,
    error,
    reload,
    createRobot,
    creating,
    createError,
    updateRobot,
    deleteRobot,
    rowStatus,
  } = useRobots();

  const stats = useMemo(() => {
    const total = robots.length;
    const active = robots.filter((r) => r.status === "active").length;
    const avgBattery = total
      ? Math.round(robots.reduce((sum, r) => sum + r.battery, 0) / total)
      : 0;
    return { total, active, avgBattery };
  }, [robots]);

  return (
    <div className="app">
      <header className="header">
        <div className="header__title">
          <span className="header__eyebrow">Fleet Control</span>
          <h1>Robot Fleet Manager</h1>
        </div>
        <div className="header__stats">
          <div className="stat">
            <span className="stat__value">{stats.total}</span>
            <span className="stat__label">Units</span>
          </div>
          <div className="stat">
            <span className="stat__value stat__value--active">{stats.active}</span>
            <span className="stat__label">Active</span>
          </div>
          <div className="stat">
            <span className="stat__value">{stats.avgBattery}%</span>
            <span className="stat__label">Avg battery</span>
          </div>
        </div>
      </header>

      <main className="layout">
        <RobotForm onCreate={createRobot} creating={creating} createError={createError} />

        <section className="panel table-panel">
          <div className="panel__header">
            <h2>Fleet roster</h2>
            <button className="btn btn--small" onClick={reload} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {error && (
            <div className="banner banner--error">
              <span>{error}</span>
              <button className="btn btn--small" onClick={reload}>
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="skeleton-list">
              {Array.from({ length: 4 }).map((_, i) => (
                <div className="skeleton-row" key={i} />
              ))}
            </div>
          ) : robots.length === 0 && !error ? (
            <div className="empty-state">
              <p>No robots registered yet.</p>
              <span>Add one with the form to bring it into the fleet.</span>
            </div>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Model</th>
                    <th>Status</th>
                    <th>Battery</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {robots.map((robot) => (
                    <RobotRow
                      key={robot.id}
                      robot={robot}
                      status={rowStatus[robot.id]}
                      onUpdate={updateRobot}
                      onDelete={deleteRobot}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
