// Run with: node src/seed.js
import db from "./db.js";

const robots = [
  { name: "R2-Delta-04", model: "TurtleBot3", status: "active", battery: 82, location: "Warehouse A - Zone 3" },
  { name: "Atlas-07", model: "UR5", status: "idle", battery: 100, location: "Assembly Line 2" },
  { name: "Scout-11", model: "Boston Dynamics Spot", status: "charging", battery: 34, location: "Charging Bay 1" },
  { name: "Forge-02", model: "KUKA KR6", status: "error", battery: 12, location: "Warehouse B - Zone 1" },
];

const insert = db.prepare(
  `INSERT INTO robots (name, model, status, battery, location)
   VALUES (@name, @model, @status, @battery, @location)`
);

const insertMany = db.transaction((items) => {
  for (const item of items) insert.run(item);
});

insertMany(robots);
console.log(`Seeded ${robots.length} robots.`);
