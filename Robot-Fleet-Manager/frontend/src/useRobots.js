import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

export function useRobots() {
  const [robots, setRobots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Per-row action state, keyed by robot id: "updating" | "deleting"
  const [rowStatus, setRowStatus] = useState({});
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.list();
      setRobots(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createRobot = useCallback(async (payload) => {
    setCreating(true);
    setCreateError(null);
    try {
      const robot = await api.create(payload);
      setRobots((prev) => [robot, ...prev]);
      return true;
    } catch (err) {
      setCreateError(err.message);
      return false;
    } finally {
      setCreating(false);
    }
  }, []);

  const updateRobot = useCallback(async (id, payload) => {
    setRowStatus((prev) => ({ ...prev, [id]: { action: "updating", error: null } }));
    try {
      const updated = await api.update(id, payload);
      setRobots((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setRowStatus((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return true;
    } catch (err) {
      setRowStatus((prev) => ({ ...prev, [id]: { action: null, error: err.message } }));
      return false;
    }
  }, []);

  const deleteRobot = useCallback(async (id) => {
    setRowStatus((prev) => ({ ...prev, [id]: { action: "deleting", error: null } }));
    try {
      await api.remove(id);
      setRobots((prev) => prev.filter((r) => r.id !== id));
      setRowStatus((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return true;
    } catch (err) {
      setRowStatus((prev) => ({ ...prev, [id]: { action: null, error: err.message } }));
      return false;
    }
  }, []);

  return {
    robots,
    loading,
    error,
    reload: load,
    createRobot,
    creating,
    createError,
    updateRobot,
    deleteRobot,
    rowStatus,
  };
}
