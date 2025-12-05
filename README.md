🏆 Desafío FutScript – API REST con Express, PostgreSQL y JWT

Este proyecto corresponde al Desafío FutScript, donde se desarrolla una API REST en Node.js utilizando:

Express
PostgreSQL (pg / Pool)
JWT para autenticación
Middleware personalizado
Testing con Jest + Supertest

El objetivo es gestionar equipos de fútbol y sus jugadores, con rutas públicas y rutas protegidas mediante token.

📁 Estructura del Proyecto
futscript/
├─ db/
│  └─ connection.js
├─ middlewares/
│  └─ validateToken.js
├─ utils/
│  └─ secretKey.js
├─ tests/
│  └─ futscript.spec.js
├─ script.sql
├─ index.js
├─ package.json
├─ .env
└─ .gitignore

🚀 Requisitos previos

Node.js v16 o superior
PostgreSQL instalado y corriendo

Crear una base de datos llamada:
futscript

🛠 Instalación

Clonar el repositorio e instalar dependencias:
npm install

Crear archivo .env en la raíz del proyecto:
PGHOST=localhost
PGPORT=5432
PGDATABASE=futscript
PGUSER=postgres
PGPASSWORD=TU_PASSWORD
PORT=3000

🗄 Crear tablas y datos iniciales

Ejecutar el archivo script.sql dentro de la base de datos futscript:
CREATE TABLE equipos (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE jugadores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  posicion VARCHAR(40) NOT NULL,
  team_id INTEGER NOT NULL REFERENCES equipos(id) ON DELETE CASCADE
);

INSERT INTO equipos (name) VALUES ('Real Madrid'), ('Barcelona');

INSERT INTO jugadores (name, posicion, team_id) VALUES
('Karim Benzema', 'delantero', 1),
('Luka Modrić', 'centrocampista', 1),
('Robert Lewandowski', 'delantero', 2),
('Pedri', 'centrocampista', 2);

▶ Ejecutar servidor
npm run dev

El servidor iniciará en:
http://localhost:3000

📌 Endpoints de la API
🔑 1. Login – Obtener token
POST /login

Body:
{
  "username": "admin",
  "password": "1234"
}

Respuesta:
{
  "token": "eyJhbGciOi..."
}

📋 2. Listar equipos (pública)
GET /equipos

Respuesta:
[
  { "id": 1, "name": "Real Madrid" },
  { "id": 2, "name": "Barcelona" }
]

👥 3. Listar jugadores por equipo (pública)
GET /equipos/:id/jugadores

Ejemplo:
GET /equipos/1/jugadores

Respuesta:
[
  { "name": "Karim Benzema", "posicion": "delantero" },
  { "name": "Luka Modrić", "posicion": "centrocampista" }
]

🆕 4. Crear nuevo equipo (protegida)
POST /equipos

Headers:
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "Manchester City"
}

Respuesta:
{
  "id": 3,
  "name": "Manchester City"
}

🎽 5. Agregar jugador a un equipo (protegida)
POST /equipos/:id/jugadores

Body:
{
  "name": "Jugador Nuevo",
  "posicion": "delantero"
}

Respuesta:
{
  "id": 5,
  "name": "Jugador Nuevo",
  "posicion": "delantero",
  "team_id": 1
}

🧪 Testing con Jest + Supertest

Ejecutar los tests:
npm test

Resultados esperados:

✔ GET /equipos retorna arreglo + status 200
✔ POST /login (correcto) retorna token + status 200
✔ POST /login (incorrecto) retorna 400
✔ POST /equipos/:id/jugadores retorna 201 con token válido

Si se desea cerrar la conexión de PostgreSQL correctamente al finalizar los tests, se incluye en futscript.spec.js:

const pool = require("../db/connection");

afterAll(async () => {
  await pool.end();
});

🔐 Autenticación JWT

Token generado con:
jwt.sign(payload, secretKey, { expiresIn: "1h" })

Middleware de validación (validateToken.js) verifica:
Header Authorization
Formato Bearer <token>
Token válido y no expirado

"dependencies": {
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^4.19.2",
  "jsonwebtoken": "^9.0.2",
  "pg": "^8.12.0"
},
"devDependencies": {
  "jest": "^29.7.0",
  "supertest": "^7.0.0",
  "nodemon": "^3.1.0"
}

⭐ Conclusión

Este proyecto implementa una API REST robusta con:

Autenticación JWT
Testing automatizado
Conexión real a base de datos
Middleware personalizado
Endpoints protegidos y públicos
Cumple todos los requisitos del Desafío FutScript y está listo para evaluación o despliegue.


