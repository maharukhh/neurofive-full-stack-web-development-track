import { useState } from "react";
import StatusBadge from "./StatusBadge";
import BatteryBar from "./BatteryBar";

export default function RobotRow({ robot, status, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(robot);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isUpdating = status?.action === "updating";
  const isDeleting = status?.action === "deleting";
  const rowError = status?.error;

  const startEdit = () => {
    setDraft(robot);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft(robot);
  };

  const handleChange = (field) => (e) => {
    const value = field === "battery" ? Number(e.target.value) : e.target.value;
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const ok = await onUpdate(robot.id, {
      name: draft.name,
      model: draft.model,
      status: draft.status,
      battery: draft.battery,
      location: draft.location,
    });
    if (ok) setEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(robot.id);
  };

  if (editing) {
    return (
      <tr className="row row--editing">
        <td>
          <input value={draft.name} onChange={handleChange("name")} />
        </td>
        <td>
          <input value={draft.model} onChange={handleChange("model")} />
        </td>
        <td>
          <select value={draft.status} onChange={handleChange("status")}>
            <option value="idle">Idle</option>
            <option value="active">Active</option>
            <option value="charging">Charging</option>
            <option value="error">Error</option>
          </select>
        </td>
        <td>
          <input
            type="number"
            min="0"
            max="100"
            value={draft.battery}
            onChange={handleChange("battery")}
          />
        </td>
        <td>
          <input value={draft.location} onChange={handleChange("location")} />
        </td>
        <td className="row__actions">
          <button className="btn btn--small btn--primary" onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? "Saving…" : "Save"}
          </button>
          <button className="btn btn--small" onClick={cancelEdit} disabled={isUpdating}>
            Cancel
          </button>
          {rowError && <span className="row__error">{rowError}</span>}
        </td>
      </tr>
    );
  }

  return (
    <tr className={`row ${isDeleting ? "row--deleting" : ""}`}>
      <td className="row__name">{robot.name}</td>
      <td className="row__muted">{robot.model}</td>
      <td>
        <StatusBadge status={robot.status} />
      </td>
      <td>
        <BatteryBar value={robot.battery} />
      </td>
      <td className="row__muted">{robot.location}</td>
      <td className="row__actions">
        {confirmingDelete ? (
          <>
            <span className="row__confirm-text">Delete this robot?</span>
            <button
              className="btn btn--small btn--danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Removing…" : "Confirm"}
            </button>
            <button
              className="btn btn--small"
              onClick={() => setConfirmingDelete(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="btn btn--small" onClick={startEdit}>
              Edit
            </button>
            <button
              className="btn btn--small btn--danger-outline"
              onClick={() => setConfirmingDelete(true)}
            >
              Delete
            </button>
          </>
        )}
        {rowError && <span className="row__error">{rowError}</span>}
      </td>
    </tr>
  );
}
