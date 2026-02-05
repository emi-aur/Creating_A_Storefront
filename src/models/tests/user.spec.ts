import { User } from "../user";
import * as UserModel from "../user";
import request from "supertest";
import app from "../../server";
import jwt from "jsonwebtoken";

describe("User Handler", () => {
  let authToken: string;
  let testUserId: number;

  // Token vor allen Tests generieren
  beforeAll(async () => {
    // Erstelle Test-User
    const testUser = await UserModel.create({
      firstname: "Biene",
      lastname: "Maya",
      password_digest: "test123",
    });
    testUserId = testUser.id as number;

    // Generiere echten JWT-Token
    authToken = jwt.sign(
      { user: testUser },
      process.env.TOKEN_SECRET as string
    );
  });

  describe("GET /api/users", () => {
    it("sollte eine Liste von Benutzern zurückgeben, wenn ein Token vorhanden ist", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("sollte 401 zurückgeben, wenn der Token fehlt", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/users/:id", () => {
    it("sollte die Daten des Benutzers zurückgeben, wenn ein Token vorhanden ist", async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testUserId);
    });

    it("sollte 401 zurückgeben, wenn der Token fehlt", async () => {
      const response = await request(app).get(`/api/users/${testUserId}`);

      expect(response.status).toBe(401);
    });
  });
});

describe("User Model", () => {
  let createdUserId: number;

  // Erstelle Test-User vor allen Tests
  beforeAll(async () => {
    const user: User = {
      firstname: "Test",
      lastname: "Setup",
      password_digest: "password123",
    };
    const result = await UserModel.create(user);
    createdUserId = result.id as number;
  });

  it("should have an index method", () => {
    expect(UserModel.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(UserModel.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(UserModel.create).toBeDefined();
  });

  it("index method should return a list of users", async () => {
    const result = await UserModel.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it("create method should add a user", async () => {
    const user: User = {
      firstname: "Max",
      lastname: "Musterman",
      password_digest: "password123",
    };
    const result = await UserModel.create(user);
    expect(result).toBeDefined();
    expect(result.firstname).toBe(user.firstname);
    expect(result.id).toBeDefined();
  });

  it("show method should return the correct user", async () => {
    const result = await UserModel.show(createdUserId.toString());
    expect(result?.id).toEqual(createdUserId);
  });
});
