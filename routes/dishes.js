const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all dishes
router.get("/", (req, res) => {
  db.query("SELECT * FROM dishes", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.json(results);
    }
  });
});

// GET a single dish by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM dishes WHERE id = ?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Database query failed" });
    } else if (result.length === 0) {
      res.status(404).json({ message: "Dish not found" });
    } else {
      res.json(result[0]);
    }
  });
});

// POST a new dish
router.post("/", (req, res) => {
  const { name, price, category, description } = req.body;
  const sql = "INSERT INTO dishes (name, price, category, description) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, price, category, description], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.status(201).json({ message: "Dish added successfully", id: result.insertId });
    }
  });
});

module.exports = router;
