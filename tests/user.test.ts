import request from "supertest";
import { createApp } from "../src/app";
import prisma from "../src/services/prisma";
import { BookModel, AuthorModel } from "../src/models"; // Modelos necesarios para la instancia de createApp

// Crear una instancia de la aplicación para pruebas
const app = createApp({
  bookModel: BookModel,
  authorModel: AuthorModel,
});

beforeAll(async () => {
  // Limpia los datos de prueba antes de comenzar
  await prisma.user.deleteMany();
});

afterAll(async () => {
  // Desconectar Prisma después de las pruebas
  await prisma.$disconnect();
});

describe("User API", () => {
  it("GET / - should return success message", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("message", "Ok");
  });

  it("POST /register - should register a new user", async () => {
    const newUser = {
      username: "newuser",
      email: "newuser@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    const response = await request(app).post("/register").send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body).toHaveProperty("message", "User created");

    const userInDb = await prisma.user.findUnique({
      where: { email: newUser.email },
    });
    expect(userInDb).toBeTruthy();
  });

  it("POST /login - should login user and return JWT token", async () => {
    const loginDetails = {
      email: "newuser@example.com",
      password: "password123",
    };

    const response = await request(app).post("/login").send(loginDetails);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
    expect(response.body.data).toHaveProperty("token");
  });
});
