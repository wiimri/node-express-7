DROP TABLE IF EXISTS jugadores;
DROP TABLE IF EXISTS equipos;

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

INSERT INTO equipos (name) VALUES
('Real Madrid'),
('Barcelona');

INSERT INTO jugadores (name, posicion, team_id) VALUES
('Karim Benzema', 'delantero', 1),
('Luka Modrić', 'centrocampista', 1),
('Robert Lewandowski', 'delantero', 2),
('Pedri', 'centrocampista', 2);
