const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const pool = require("./db/connection");
const validateToken = require("./middlewares/validateToken");
const { secretKey } = require("./utils/secretKey");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    const payload = { username };
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    return res.status(200).json({ token });
  }

  return res.status(400).json({ message: "Credenciales inválidas" });
});

app.get("/equipos", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name FROM equipos ORDER BY id ASC"
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error en GET /equipos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/equipos/:teamID/jugadores", async (req, res) => {
  const { teamID } = req.params;

  try {
    const query = `
      SELECT j.name, j.posicion
      FROM jugadores j
      INNER JOIN equipos e ON j.team_id = e.id
      WHERE e.id = $1
      ORDER BY j.id ASC;
    `;
    const { rows } = await pool.query(query, [teamID]);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error en GET /equipos/:teamID/jugadores:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/equipos", validateToken, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "El campo name es obligatorio" });
  }

  try {
    const query = `
      INSERT INTO equipos (name)
      VALUES ($1)
      RETURNING id, name;
    `;
    const { rows } = await pool.query(query, [name]);
    const nuevoEquipo = rows[0];

    return res.status(201).json(nuevoEquipo);
  } catch (error) {
    console.error("Error en POST /equipos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/equipos/:teamID/jugadores", validateToken, async (req, res) => {
  const { teamID } = req.params;
  const { name, posicion } = req.body;

  if (!name || !posicion) {
    return res.status(400).json({
      message: "Los campos name y posicion son obligatorios"
    });
  }

  try {
    const query = `
      INSERT INTO jugadores (name, posicion, team_id)
      VALUES ($1, $2, $3)
      RETURNING id, name, posicion, team_id;
    `;
    const values = [name, posicion, teamID];
    const { rows } = await pool.query(query, values);
    const nuevoJugador = rows[0];

    return res.status(201).json(nuevoJugador);
  } catch (error) {
    console.error("Error en POST /equipos/:teamID/jugadores:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.get("/", (req, res) => {
  res.send("API FutScript funcionando ✅");
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor FutScript escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
