import { useState } from "react";

const EMPTY = { name: "", model: "", status: "idle", battery: 100, location: "" };

export default function RobotForm({ onCreate, creating, createError }) {
  const [form, setForm] = useState(EMPTY);

  const handleChange = (field) => (e) => {
    const value = field === "battery" ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onCreate(form);
    if (ok) setForm(EMPTY);
  };

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <div className="panel__header">
        <h2>Register robot</h2>
        <span className="panel__eyebrow">New unit</span>
      </div>

      <div className="form__grid">
        <label className="field">
          <span className="field__label">Name</span>
          <input
            required
            type="text"
            placeholder="R2-Delta-04"
            value={form.name}
            onChange={handleChange("name")}
          />
        </label>

        <label className="field">
          <span className="field__label">Model</span>
          <input
            required
            type="text"
            placeholder="TurtleBot3"
            value={form.model}
            onChange={handleChange("model")}
          />
        </label>

        <label className="field">
          <span className="field__label">Status</span>
          <select value={form.status} onChange={handleChange("status")}>
            <option value="idle">Idle</option>
            <option value="active">Active</option>
            <option value="charging">Charging</option>
            <option value="error">Error</option>
          </select>
        </label>

        <label className="field">
          <span className="field__label">Battery (%)</span>
          <input
            required
            type="number"
            min="0"
            max="100"
            value={form.battery}
            onChange={handleChange("battery")}
          />
        </label>

        <label className="field field--wide">
          <span className="field__label">Location / zone</span>
          <input
            required
            type="text"
            placeholder="Warehouse A - Zone 3"
            value={form.location}
            onChange={handleChange("location")}
          />
        </label>
      </div>

      {createError && <p className="form__error">{createError}</p>}

      <button className="btn btn--primary" type="submit" disabled={creating}>
        {creating ? "Adding to fleet…" : "Add robot"}
      </button>
    </form>
  );
}
