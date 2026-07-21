import { Router } from "express";
import db from "../db.js";
import { asyncHandler, ApiError } from "../middleware/errorHandler.js";
import { validateRobotPayload } from "../validation.js";

const router = Router();

// GET /api/robots - list all robots
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const robots = db
      .prepare("SELECT * FROM robots ORDER BY created_at DESC")
      .all();
    res.json(robots);
  })
);

// GET /api/robots/:id - get a single robot
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const robot = db
      .prepare("SELECT * FROM robots WHERE id = ?")
      .get(req.params.id);
    if (!robot) throw new ApiError(404, "Robot not found");
    res.json(robot);
  })
);

// POST /api/robots - create a robot
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = validateRobotPayload(req.body);
    const result = db
      .prepare(
        `INSERT INTO robots (name, model, status, battery, location)
         VALUES (@name, @model, @status, @battery, @location)`
      )
      .run(data);
    const robot = db
      .prepare("SELECT * FROM robots WHERE id = ?")
      .get(result.lastInsertRowid);
    res.status(201).json(robot);
  })
);

// PUT /api/robots/:id - update a robot (full update)
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const existing = db
      .prepare("SELECT * FROM robots WHERE id = ?")
      .get(req.params.id);
    if (!existing) throw new ApiError(404, "Robot not found");

    const data = validateRobotPayload(req.body, { partial: true });
    const merged = { ...existing, ...data };

    db.prepare(
      `UPDATE robots
       SET name = @name, model = @model, status = @status,
           battery = @battery, location = @location,
           updated_at = datetime('now')
       WHERE id = @id`
    ).run({ ...merged, id: req.params.id });

    const robot = db
      .prepare("SELECT * FROM robots WHERE id = ?")
      .get(req.params.id);
    res.json(robot);
  })
);

// DELETE /api/robots/:id - remove a robot
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = db
      .prepare("DELETE FROM robots WHERE id = ?")
      .run(req.params.id);
    if (result.changes === 0) throw new ApiError(404, "Robot not found");
    res.status(204).send();
  })
);

export default router;
