const request = require("supertest");
const app = require("../index");

describe("API FutScript", () => {
  it("GET /equipos retorna un arreglo y statusCode 200", async () => {
    const response = await request(app).get("/equipos").send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
  });

  it("POST /login con credenciales correctas retorna un objeto con el token", async () => {
    const credencialesCorrectas = {
      username: "admin",
      password: "1234"
    };

    const response = await request(app).post("/login").send(credencialesCorrectas);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
  });

  it("POST /login con credenciales incorrectas retorna statusCode 400", async () => {
    const credencialesIncorrectas = {
      username: "admin",
      password: "xxxx"
    };

    const response = await request(app).post("/login").send(credencialesIncorrectas);

    expect(response.statusCode).toBe(400);
  });

  it("POST /equipos/:teamID/jugadores con token válido retorna statusCode 201", async () => {
    const loginResponse = await request(app).post("/login").send({
      username: "admin",
      password: "1234"
    });

    const token = loginResponse.body.token;

    const nuevoJugador = {
      name: "Jugador Test",
      posicion: "delantero"
    };

    const response = await request(app)
      .post("/equipos/1/jugadores")
      .set("Authorization", `Bearer ${token}`)
      .send(nuevoJugador);

    expect(response.statusCode).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(nuevoJugador.name);
    expect(response.body.posicion).toBe(nuevoJugador.posicion);
  });
});
