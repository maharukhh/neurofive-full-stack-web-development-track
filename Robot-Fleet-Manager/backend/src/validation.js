import { ApiError } from "./middleware/errorHandler.js";

const VALID_STATUSES = ["idle", "active", "charging", "error"];

// isPartial = true for PATCH-style partial updates (PUT here, but kept flexible)
export function validateRobotPayload(body, { partial = false } = {}) {
  const errors = [];
  const data = {};

  if (!partial || body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length === 0) {
      errors.push("name is required and must be a non-empty string");
    } else {
      data.name = body.name.trim();
    }
  }

  if (!partial || body.model !== undefined) {
    if (typeof body.model !== "string" || body.model.trim().length === 0) {
      errors.push("model is required and must be a non-empty string");
    } else {
      data.model = body.model.trim();
    }
  }

  if (!partial || body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      errors.push(`status must be one of: ${VALID_STATUSES.join(", ")}`);
    } else {
      data.status = body.status;
    }
  }

  if (!partial || body.battery !== undefined) {
    const battery = Number(body.battery);
    if (!Number.isInteger(battery) || battery < 0 || battery > 100) {
      errors.push("battery must be an integer between 0 and 100");
    } else {
      data.battery = battery;
    }
  }

  if (!partial || body.location !== undefined) {
    if (typeof body.location !== "string" || body.location.trim().length === 0) {
      errors.push("location is required and must be a non-empty string");
    } else {
      data.location = body.location.trim();
    }
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors.join("; "));
  }

  return data;
}
